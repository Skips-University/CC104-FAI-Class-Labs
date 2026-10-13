/* Kesar Kitchen – Excel to Dashboard (instructor reference solution)
 * Pipeline: readFile -> pickSheet -> findHeaderRow -> cleanSheet -> detectTypes -> detectKind
 *           -> applyFilters -> analyse -> render KPIs / insights / charts / tables / preview
 * Requirement IDs (T1-T7, C1-C9, F1-F12, 5.1-5.5) refer to 02_requirements/Dashboard_Requirements.md
 */

// ===== 1. Constants and formatting helpers =====
const AS_OF = new Date(2026, 8, 30, 12); // 30-Sep-2026, the report date for inventory expiry
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CITY_FIX = { baroda: "Vadodara", ahmd: "Ahmedabad", amd: "Ahmedabad", amdavad: "Ahmedabad" };
const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

const rs = (v) => "Rs " + nf.format(Math.round(v || 0));
const num = (v) => nf.format(Math.round(v || 0));
const pct = (v, d = 1) => (isFinite(v) ? v.toFixed(d) : "0") + "%";
function lakh(v) {
  if (Math.abs(v) >= 1e7) return `Rs ${(v / 1e7).toFixed(2)} crore`;
  if (Math.abs(v) >= 1e5) return `Rs ${(v / 1e5).toFixed(1)} lakh`;
  return rs(v);
}
const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
const monthKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const monthLabel = (key) => `${MONTHS[Number(key.slice(5, 7)) - 1]}-${key.slice(0, 4)}`;
const isBlank = (v) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

// ===== 2. Value converters (C6, C7, C8) =====
const NUM_RE = /^\s*(?:rs\.?|inr|₹)?\s*-?[\d,]*\.?\d+\s*(?:\/-)?\s*$/i;
const DMY_RE = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/;
const DMONY_RE = /^(\d{1,2})[- ]([A-Za-z]{3})[A-Za-z]*[- ](\d{4})$/;
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})/;

function toNumber(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string" && NUM_RE.test(v)) return parseFloat(v.replace(/rs\.?|inr|₹|,|\/-|\s/gi, ""));
  return null;
}

// Excel dates arrive as Date objects that can be a few minutes off midnight (time-zone quirk),
// so we snap every date to 12:00 local time on the nearest day.
function toDate(v) {
  if (v instanceof Date) {
    const t = new Date(v.getTime() + 12 * 3600e3);
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 12);
  }
  if (typeof v !== "string") return null;
  const s = v.trim();
  let m = s.match(DMY_RE); // DAY first: 01-04-2026 = 1 April 2026
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], 12);
  m = s.match(DMONY_RE);
  if (m) {
    const mi = MONTHS.findIndex((x) => x.toLowerCase() === m[2].toLowerCase());
    if (mi >= 0) return new Date(+m[3], mi, +m[1], 12);
  }
  m = s.match(ISO_RE);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], 12);
  return null;
}
const looksLikeDate = (v) => v instanceof Date || (typeof v === "string" && toDate(v) !== null);

function fixCity(s) {
  const t = String(s).trim();
  const fixed = CITY_FIX[t.toLowerCase()];
  if (fixed) return fixed;
  return t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ===== 3. Cleaning engine (C1-C9) =====
// C1: header = first row where at least half the cells are filled
function findHeaderRow(rows) {
  const width = Math.max(0, ...rows.slice(0, 30).map((r) => r.length));
  for (let i = 0; i < Math.min(rows.length, 30); i++) {
    const filled = rows[i].filter((v) => !isBlank(v)).length;
    if (filled > 0 && filled >= width / 2) return i;
  }
  return 0;
}

// F3: a column is a date / number column when 80% of its filled cells look like one
function detectType(values) {
  const filled = values.filter((v) => !isBlank(v));
  if (!filled.length) return "text";
  const dates = filled.filter(looksLikeDate).length;
  if (dates / filled.length >= 0.8) return "date";
  const nums = filled.filter((v) => toNumber(v) !== null).length;
  if (nums / filled.length >= 0.8) return "number";
  return "text";
}

function cleanSheet(rawRows) {
  const q = { rowsRead: 0, headerRow: 0, blankRows: 0, totalRows: 0, duplicates: 0,
    textToNumber: 0, textToDate: 0, cityFixed: 0, blanks: {} };
  if (!rawRows.length) return { columns: [], types: {}, rows: [], quality: q };

  const h = findHeaderRow(rawRows);
  q.headerRow = h + 1;
  const seenNames = {};
  const columns = rawRows[h].map((v, i) => {
    let name = isBlank(v) ? `Column_${i + 1}` : String(v).trim();
    if (seenNames[name]) name = `${name}_${++seenNames[name]}`; else seenNames[name] = 1;
    return name;
  });

  let body = rawRows.slice(h + 1).map((r) => columns.map((_, i) => (r[i] === undefined ? null : r[i])));
  q.rowsRead = body.length;

  // C2: drop fully blank rows
  let before = body.length;
  body = body.filter((r) => !r.every(isBlank));
  q.blankRows = before - body.length;

  // C3: drop TOTAL / Grand Total rows
  before = body.length;
  body = body.filter((r) => !/^(grand\s+)?total$/i.test(String(r[0] ?? "").trim()));
  q.totalRows = before - body.length;

  // C4: drop exact duplicates
  const seen = new Set();
  before = body.length;
  body = body.filter((r) => {
    const key = JSON.stringify(r.map((v) => (v instanceof Date ? v.getTime() : v)));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  q.duplicates = before - body.length;

  // C5: trim text, blank strings -> null
  body = body.map((r) => r.map((v) => (typeof v === "string" ? (v.trim() === "" ? null : v.trim()) : v)));

  // F3 + C6 + C7 + C8 + C9: convert column by column
  const types = {};
  columns.forEach((col, i) => {
    const type = detectType(body.map((r) => r[i]));
    types[col] = type;
    const isCity = /^city$/i.test(col);
    body.forEach((r) => {
      const v = r[i];
      if (v === null) return; // C9: blanks stay blank
      if (type === "number") {
        if (typeof v === "string" && !/^-?\d+(\.\d+)?$/.test(v)) q.textToNumber++;
        r[i] = toNumber(v);
      } else if (type === "date") {
        if (typeof v === "string") q.textToDate++;
        r[i] = toDate(v);
      } else {
        const s = String(v);
        if (isCity) {
          r[i] = fixCity(s);
          if (r[i] !== s) q.cityFixed++;
        } else r[i] = s;
      }
    });
    q.blanks[col] = body.filter((r) => r[i] === null).length;
  });

  const rows = body.map((r) => Object.fromEntries(columns.map((c, i) => [c, r[i]])));
  return { columns, types, rows, quality: q };
}

// ===== 4. File-type detection (F6) =====
function detectKind(columns) {
  const has = (...names) => names.every((n) => columns.includes(n));
  if (has("Order_ID", "Net_Amount")) return "sales";
  if (has("SKU", "Closing_Stock")) return "inventory";
  if (has("Campaign_ID", "Spend")) return "marketing";
  if (has("Feedback_ID", "NPS_Score")) return "feedback";
  return "generic";
}
const KIND_LABEL = { sales: "Sales", inventory: "Inventory", marketing: "Marketing",
  feedback: "Customer feedback", generic: "Generic spreadsheet" };
const FILTERS = { sales: ["City", "Channel", "Category"], inventory: ["Warehouse", "Category"],
  marketing: ["Platform", "Month"], feedback: ["City", "Channel"] };

// ===== 5. Aggregation helpers =====
const sum = (rows, col) => rows.reduce((a, r) => a + (r[col] ?? 0), 0);
function avg(rows, col) {
  const v = rows.map((r) => r[col]).filter((x) => x !== null && x !== undefined); // C9
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}
// groupBy -> array of [key, value]; agg = sum | avg | count | min | max
function groupBy(rows, keyFn, valFn = () => 1, agg = "sum") {
  const m = new Map();
  rows.forEach((r) => {
    const k = keyFn(r);
    if (k === null || k === undefined) return;
    if (!m.has(k)) m.set(k, []);
    const v = valFn(r);
    m.get(k).push(v);
  });
  return [...m].map(([k, vals]) => {
    const nums = vals.filter((v) => typeof v === "number");
    let out;
    if (agg === "count") out = vals.length;
    else if (!nums.length) out = 0;
    else if (agg === "avg") out = nums.reduce((a, b) => a + b, 0) / nums.length;
    else if (agg === "min") out = Math.min(...nums);
    else if (agg === "max") out = Math.max(...nums);
    else out = nums.reduce((a, b) => a + b, 0);
    return [k, out];
  });
}
const byValueDesc = (a, b) => b[1] - a[1];
const byKey = (a, b) => (a[0] < b[0] ? -1 : 1);

// ===== 6. Smart dashboards (5.1-5.5) =====
// Each returns { kpis, charts, tables, insights } computed only from the (filtered) rows.
function analyseSales(rows, ctx) {
  const total = sum(rows, "Net_Amount");
  const byCity = groupBy(rows, (r) => r.City, (r) => r.Net_Amount).sort(byValueDesc);
  const byMonth = groupBy(rows, (r) => r.Order_Date && monthKey(r.Order_Date), (r) => r.Net_Amount).sort(byKey);
  const byCat = groupBy(rows, (r) => r.Category, (r) => r.Net_Amount).sort(byValueDesc);
  const byChannel = groupBy(rows, (r) => r.Channel, (r) => r.Net_Amount).sort(byValueDesc);
  const top10 = groupBy(rows, (r) => r.Product, (r) => r.Net_Amount).sort(byValueDesc).slice(0, 10);

  const charts = [
    { id: "s_month", title: "Revenue by month", desc: "Net revenue per calendar month.", type: "line",
      labels: byMonth.map((x) => monthLabel(x[0])), datasets: [{ label: "Revenue", data: byMonth.map((x) => x[1]) }], fmt: rs },
    { id: "s_city", title: "Revenue by city", desc: "After merging spellings like Baroda / Ahmd.", type: "bar",
      labels: byCity.map((x) => x[0]), datasets: [{ label: "Revenue", data: byCity.map((x) => x[1]) }], fmt: rs },
    { id: "s_cat", title: "Revenue share by category", desc: "Which product family earns the money.", type: "doughnut",
      labels: byCat.map((x) => x[0]), datasets: [{ label: "Revenue", data: byCat.map((x) => x[1]) }], fmt: rs },
    { id: "s_channel", title: "Revenue by channel", desc: "Stores and distributors vs online.", type: "bar",
      labels: byChannel.map((x) => x[0]), datasets: [{ label: "Revenue", data: byChannel.map((x) => x[1]) }], fmt: rs },
    { id: "s_top", title: "Top 10 products", desc: "Ranked by net revenue.", type: "hbar", wide: true,
      labels: top10.map((x) => x[0]), datasets: [{ label: "Revenue", data: top10.map((x) => x[1]) }], fmt: rs },
  ];

  const insights = [];
  if (byMonth.length) {
    const best = [...byMonth].sort(byValueDesc)[0];
    const worst = [...byMonth].sort(byValueDesc).at(-1);
    insights.push(`${monthLabel(best[0])} is the best month: ${lakh(best[1])} (${pct((best[1] / total) * 100)} of the period); ` +
      `the weakest is ${monthLabel(worst[0])} at ${lakh(worst[1])}.`);
  }
  if (byCat.length) insights.push(`${byCat[0][0]} brings ${pct((byCat[0][1] / total) * 100)} of revenue (${lakh(byCat[0][1])}).`);

  // Target vs actual: targets are per city and month, so only the City filter applies to them
  if (ctx.targets) {
    const cityFilter = ctx.filters.City;
    const tRows = ctx.targets.filter((t) => !cityFilter || t.City === cityFilter);
    const tMonth = new Map(groupBy(tRows, (t) => t.Month && monthKey(t.Month), (t) => t.Target_Amount));
    const keys = [...new Set([...tMonth.keys(), ...byMonth.map((x) => x[0])])].sort();
    const aMonth = new Map(byMonth);
    charts.push({ id: "s_target", title: "Target vs actual by month", wide: true, type: "bar",
      desc: "From the Monthly_Targets sheet. Targets are set per city, so only the City filter applies to them.",
      labels: keys.map(monthLabel),
      datasets: [{ label: "Target", data: keys.map((k) => tMonth.get(k) || 0) },
        { label: "Actual", data: keys.map((k) => aMonth.get(k) || 0) }], fmt: rs });
    const tCity = new Map(groupBy(ctx.targets, (t) => t.City, (t) => t.Target_Amount));
    const below = byCity.filter(([c, a]) => tCity.get(c) && a / tCity.get(c) < 0.95)
      .map(([c, a]) => `${c} (${pct((a / tCity.get(c)) * 100)})`);
    if (below.length) insights.push(`Below 95% of target: ${below.join(", ")}.`);
    else insights.push("Every city shown is at or above 95% of its target.");
  }

  // fastest-growing channel: first month vs last month
  if (byMonth.length >= 2) {
    const first = byMonth[0][0], last = byMonth.at(-1)[0];
    const growth = groupBy(rows, (r) => r.Channel, (r) => r)
      .map(([ch]) => {
        const chRows = rows.filter((r) => r.Channel === ch);
        const f = sum(chRows.filter((r) => monthKey(r.Order_Date) === first), "Net_Amount");
        const l = sum(chRows.filter((r) => monthKey(r.Order_Date) === last), "Net_Amount");
        return [ch, f ? (l / f - 1) * 100 : 0];
      }).sort(byValueDesc);
    if (growth.length > 1 && growth[0][1] > 0)
      insights.push(`Fastest-growing channel: ${growth[0][0]} (+${growth[0][1].toFixed(0)}% from ${monthLabel(first)} to ${monthLabel(last)}).`);
  }

  return {
    kpis: [
      { label: "Total revenue", value: rs(total), note: lakh(total) },
      { label: "Orders", value: num(rows.length) },
      { label: "Units sold", value: num(sum(rows, "Qty")) },
      { label: "Average order value", value: rs(rows.length ? total / rows.length : 0) },
      { label: "Best city", value: byCity[0] ? byCity[0][0] : "–", note: byCity[0] ? lakh(byCity[0][1]) : "" },
    ],
    charts, tables: [], insights,
  };
}

function analyseInventory(rows) {
  const value = (r) => (r.Closing_Stock ?? 0) * (r.Unit_Cost ?? 0);
  const stockValue = rows.reduce((a, r) => a + value(r), 0);
  const low = rows.filter((r) => r.Closing_Stock !== null && r.Closing_Stock <= r.Reorder_Level);
  const daysLeft = (r) => (r.Expiry_Date ? Math.round((r.Expiry_Date - AS_OF) / 864e5) : Infinity);
  const expiring = rows.filter((r) => daysLeft(r) <= 30);
  const mismatch = rows.filter((r) => r.Opening_Stock + r.Received - r.Sold !== r.Closing_Stock);
  const byWh = groupBy(rows, (r) => r.Warehouse, value).sort(byValueDesc);
  const st = groupBy(rows, (r) => r.Category, (r) => r).map(([cat]) => {
    const cr = rows.filter((r) => r.Category === cat);
    return [cat, (sum(cr, "Sold") / (sum(cr, "Opening_Stock") + sum(cr, "Received"))) * 100];
  }).sort(byValueDesc);

  const insights = [];
  if (low.length) {
    const lowWh = groupBy(low, (r) => r.Warehouse).sort(byValueDesc)[0];
    insights.push(`${low.length} SKUs are at or below reorder level – ${lowWh[1]} of them in ${lowWh[0]}. Reorder now.`);
  } else insights.push("No SKU is at or below its reorder level.");
  if (byWh.length) insights.push(`${byWh[0][0]} holds ${pct((byWh[0][1] / stockValue) * 100)} of stock value (${lakh(byWh[0][1])}).`);
  if (st.length) insights.push(`Slowest-moving category: ${st.at(-1)[0]} (sell-through ${pct(st.at(-1)[1])}); fastest: ${st[0][0]} (${pct(st[0][1])}).`);
  if (expiring.length) insights.push(`${expiring.length} SKU(s) expire within 30 days of ${fmtDate(AS_OF)} – push them with an offer.`);
  if (mismatch.length) insights.push(`Data check: ${mismatch.length} row(s) where Closing ≠ Opening + Received − Sold (${mismatch.map((r) => r.SKU).join(", ")}).`);

  const sku = (r) => [r.SKU, r.Product, r.Warehouse];
  return {
    kpis: [
      { label: "SKUs", value: num(rows.length) },
      { label: "Closing units", value: num(sum(rows, "Closing_Stock")) },
      { label: "Stock value", value: rs(stockValue), note: "Closing × Unit cost" },
      { label: "Low-stock SKUs", value: num(low.length), note: "Closing ≤ reorder level" },
      { label: "Expiring ≤ 30 days", value: num(expiring.length) },
    ],
    charts: [
      { id: "i_wh", title: "Stock value by warehouse", desc: "Closing stock × unit cost, Rs.", type: "bar",
        labels: byWh.map((x) => x[0]), datasets: [{ label: "Stock value", data: byWh.map((x) => x[1]) }], fmt: rs },
      { id: "i_st", title: "Sell-through % by category", desc: "Sold ÷ (Opening + Received). Higher = faster moving.", type: "bar",
        labels: st.map((x) => x[0]), datasets: [{ label: "Sell-through %", data: st.map((x) => x[1]) }], fmt: (v) => pct(v) },
    ],
    tables: [
      { title: "Low stock – reorder now", alert: true, desc: "Closing stock at or below reorder level.",
        columns: ["SKU", "Product", "Warehouse", "Closing", "Reorder level"],
        rows: low.sort((a, b) => a.Closing_Stock - b.Closing_Stock).map((r) => [...sku(r), r.Closing_Stock, r.Reorder_Level]) },
      { title: "Expiring within 30 days", desc: `Expiry on or before ${fmtDate(new Date(AS_OF.getTime() + 30 * 864e5))}.`,
        columns: ["SKU", "Product", "Warehouse", "Expiry", "Days left"],
        rows: expiring.map((r) => [...sku(r), fmtDate(r.Expiry_Date), daysLeft(r)]) },
      { title: "Data check: closing stock mismatch", alert: true, desc: "Closing ≠ Opening + Received − Sold.",
        columns: ["SKU", "Product", "Warehouse", "Closing in file", "Calculated"],
        rows: mismatch.map((r) => [...sku(r), r.Closing_Stock, r.Opening_Stock + r.Received - r.Sold]) },
    ],
    insights,
  };
}

function analyseMarketing(rows) {
  const spend = sum(rows, "Spend"), revenue = sum(rows, "Revenue"), orders = sum(rows, "Orders");
  const plats = [...new Set(rows.map((r) => r.Platform))];
  const p = plats.map((name) => {
    const pr = rows.filter((r) => r.Platform === name);
    const s = sum(pr, "Spend"), rv = sum(pr, "Revenue");
    return { name, spend: s, revenue: rv, roas: s ? rv / s : 0, orders: sum(pr, "Orders") };
  }).sort((a, b) => b.roas - a.roas);
  const byMonth = groupBy(rows, (r) => r.Month && monthKey(r.Month), (r) => r.Spend).sort(byKey);
  const funnel = ["Impressions", "Clicks", "Leads", "Orders"].map((c) => [c, sum(rows, c)]);

  const losers = p.filter((x) => x.roas < 1);
  const insights = [];
  if (p.length) insights.push(`Best return: ${p[0].name} – ROAS ${p[0].roas.toFixed(1)}x (Rs ${nf.format(Math.round(p[0].roas * 100))} back for every Rs 100).`);
  if (losers.length) insights.push(`Losing money (ROAS < 1): ${losers.map((x) => `${x.name} ${x.roas.toFixed(2)}x`).join(", ")} – ${lakh(losers.reduce((a, x) => a + x.spend, 0))} spent here.`);
  insights.push(`Overall ROAS is ${(spend ? revenue / spend : 0).toFixed(2)}x on ${lakh(spend)} of spend.`);
  if (funnel[0][1]) insights.push(`Only ${pct((funnel[3][1] / funnel[1][1]) * 100, 2)} of clicks become orders.`);

  return {
    kpis: [
      { label: "Total spend", value: rs(spend) },
      { label: "Revenue", value: rs(revenue) },
      { label: "ROAS", value: (spend ? revenue / spend : 0).toFixed(2) + "x", note: "Revenue ÷ Spend" },
      { label: "Orders", value: num(orders) },
      { label: "Cost per order", value: rs(orders ? spend / orders : 0) },
    ],
    charts: [
      { id: "m_svr", title: "Spend vs revenue by platform", desc: "Where the money went and what came back.", type: "bar", wide: true,
        labels: p.map((x) => x.name), datasets: [{ label: "Spend", data: p.map((x) => x.spend) },
          { label: "Revenue", data: p.map((x) => x.revenue) }], fmt: rs },
      { id: "m_roas", title: "ROAS by platform", desc: "Red bars are below 1.0x – they lose money.", type: "bar",
        labels: p.map((x) => x.name), datasets: [{ label: "ROAS", data: p.map((x) => +x.roas.toFixed(2)) }],
        fmt: (v) => v.toFixed(2) + "x", critical: (v) => v < 1 },
      { id: "m_funnel", title: "Marketing funnel", desc: "Log scale – each step is roughly 10x smaller.", type: "hbar", log: true,
        labels: funnel.map(([c, v], i) => (i ? `${c} (${pct((v / funnel[i - 1][1]) * 100)})` : c)),
        datasets: [{ label: "Count", data: funnel.map((x) => x[1]) }], fmt: num },
      { id: "m_month", title: "Spend by month", desc: "Festive months (Aug, Sep) get more budget.", type: "line", wide: true,
        labels: byMonth.map((x) => monthLabel(x[0])), datasets: [{ label: "Spend", data: byMonth.map((x) => x[1]) }], fmt: rs },
    ],
    tables: [], insights,
  };
}

function analyseFeedback(rows) {
  const n = rows.length;
  const scored = rows.filter((r) => r.NPS_Score !== null);
  const prom = scored.filter((r) => r.NPS_Score >= 9).length;
  const det = scored.filter((r) => r.NPS_Score <= 6).length;
  const nps = scored.length ? ((prom - det) / scored.length) * 100 : 0;
  const complaints = rows.filter((r) => r.Issue_Type && r.Issue_Type !== "None");
  const dist = [1, 2, 3, 4, 5].map((s) => rows.filter((r) => r.Rating === s).length);
  const issues = groupBy(complaints, (r) => r.Issue_Type).sort(byValueDesc);
  const byChannel = groupBy(rows, (r) => r.Channel, (r) => r.Rating, "avg").sort((a, b) => a[1] - b[1]);
  const blankRatings = rows.filter((r) => r.Rating === null).length;

  const insights = [];
  insights.push(`NPS is ${nps.toFixed(1)}: ${prom} promoters vs ${det} detractors – ` +
    (nps < 0 ? "more critics than fans." : nps < 20 ? "barely positive, almost as many critics as fans." : "healthy."));
  if (issues.length) insights.push(`Top complaint: ${issues[0][0]} (${issues[0][1]} of ${complaints.length} complaints).`);
  if (byChannel.length) {
    const worst = byChannel[0][0];
    const wIssue = groupBy(complaints.filter((r) => r.Channel === worst), (r) => r.Issue_Type).sort(byValueDesc)[0];
    insights.push(`Lowest-rated channel: ${worst} (${byChannel[0][1].toFixed(2)} / 5)` + (wIssue ? `, mainly "${wIssue[0]}".` : "."));
  }
  if (blankRatings) insights.push(`${blankRatings} responses skipped the rating – they are ignored in the average, not counted as 0.`);

  return {
    kpis: [
      { label: "Responses", value: num(n) },
      { label: "Average rating", value: avg(rows, "Rating").toFixed(2) + " / 5" },
      { label: "NPS", value: nps.toFixed(1), note: "% promoters − % detractors" },
      { label: "Complaints", value: pct(n ? (complaints.length / n) * 100 : 0), note: `${complaints.length} responses` },
    ],
    charts: [
      { id: "f_dist", title: "Rating distribution", desc: `Number of responses per star rating (${blankRatings} blank).`, type: "bar",
        labels: ["1★", "2★", "3★", "4★", "5★"], datasets: [{ label: "Responses", data: dist }], fmt: num },
      { id: "f_nps", title: "Promoters, passives, detractors", desc: "Promoter 9–10, passive 7–8, detractor 0–6.", type: "doughnut",
        labels: ["Promoters", "Passives", "Detractors"], datasets: [{ label: "Responses", data: [prom, scored.length - prom - det, det] }],
        status: ["good", "neutral", "critical"], fmt: num },
      { id: "f_issue", title: "Complaints by issue type", desc: "Responses with an issue (excludes 'None').", type: "hbar",
        labels: issues.map((x) => x[0]), datasets: [{ label: "Complaints", data: issues.map((x) => x[1]) }], fmt: num },
      { id: "f_channel", title: "Average rating by channel", desc: "Out of 5; blank ratings ignored.", type: "bar",
        labels: byChannel.map((x) => x[0]), datasets: [{ label: "Avg rating", data: byChannel.map((x) => +x[1].toFixed(2)) }],
        fmt: (v) => nf2.format(v) },
    ],
    tables: [], insights,
  };
}

function analyseGeneric(rows, ctx) {
  const firstNum = ctx.columns.find((c) => ctx.types[c] === "number");
  return {
    kpis: [
      { label: "Rows", value: num(rows.length) },
      { label: "Columns", value: num(ctx.columns.length) },
      ...(firstNum ? [{ label: `Sum of ${firstNum}`, value: nf2.format(sum(rows, firstNum)) }] : []),
    ],
    charts: [], tables: [],
    insights: ["This file is not one of the 4 known Kesar Kitchen files, so there is no smart dashboard. " +
      "Use the custom chart builder below to explore it."],
  };
}

function analyse(kind, rows, ctx) {
  const fn = { sales: analyseSales, inventory: analyseInventory, marketing: analyseMarketing,
    feedback: analyseFeedback }[kind] || analyseGeneric;
  return fn(rows, ctx);
}

// ===== 7. Filters (F8) =====
const filterValue = (row, col, types) =>
  types[col] === "date" ? (row[col] ? monthLabel(monthKey(row[col])) : "(blank)") : String(row[col] ?? "(blank)");

function filterColumns(kind, columns, types, rows) {
  if (FILTERS[kind]) return FILTERS[kind].filter((c) => columns.includes(c));
  return columns.filter((c) => types[c] === "text")
    .filter((c) => { const n = new Set(rows.map((r) => r[c])).size; return n >= 2 && n <= 30; })
    .slice(0, 2);
}
function applyFilters(rows, filters, types) {
  return rows.filter((r) => Object.entries(filters).every(([c, v]) => !v || filterValue(r, c, types) === v));
}

// Node export so the cleaning/analysis logic can be unit-tested outside the browser
if (typeof module !== "undefined") {
  module.exports = { cleanSheet, detectKind, analyse, applyFilters, toDate, toNumber, fixCity, findHeaderRow };
}

// ===================================================================================
// ===== 8. Browser UI (everything below needs the page) =====
if (typeof document !== "undefined") {
  const $ = (id) => document.getElementById(id);
  const state = { workbook: null, file: null, sheet: null, columns: [], types: {}, rows: [], quality: null,
    kind: "generic", targets: null, filters: {}, sort: { col: null, dir: 1 }, search: "" };
  const charts = {}; // registry: always destroy before redrawing

  // ----- Colours (categorical slots in fixed order; status colours reserved) -----
  const SERIES = { light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"],
    dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"] };
  const STATUS = { good: "#0ca30c", critical: "#d03b3b", neutral: "#898781" };
  const isDark = () => document.body.classList.contains("dark");
  const series = () => SERIES[isDark() ? "dark" : "light"];
  const cssVar = (n) => getComputedStyle(document.body).getPropertyValue(n).trim();

  // ----- Upload (F1, T4, T5) -----
  const showError = (msg) => { $("errorBox").textContent = msg; $("errorBox").hidden = !msg; };
  $("fileInput").addEventListener("change", (e) => e.target.files[0] && handleFile(e.target.files[0]));
  const dz = $("dropZone");
  ["dragenter", "dragover"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("over"); }));
  dz.addEventListener("drop", (e) => e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]));

  async function handleFile(file) {
    showError("");
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) return showError(`"${file.name}" is not a spreadsheet. Please upload .xlsx, .xls or .csv.`);
    if (file.size === 0) return showError(`"${file.name}" is empty.`);
    if (typeof XLSX === "undefined") return showError("Could not load the SheetJS library – check your internet connection.");
    try {
      // CSV is read as plain text so SheetJS does not guess dates month-first; we parse them DAY first (C7)
      state.workbook = ext === "csv"
        ? XLSX.read(await file.text(), { type: "string", raw: true })
        : XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
    } catch (err) {
      return showError(`Could not read "${file.name}": ${err.message}`);
    }
    state.file = file;
    const names = state.workbook.SheetNames;
    $("sheetSelect").replaceChildren(...names.map((n) => new Option(n, n)));
    $("sheetWrap").hidden = names.length < 2;
    $("fileInfo").textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB · ${names.length} sheet${names.length > 1 ? "s" : ""}`;
    loadSheet(names[0]);
  }

  const sheetRows = (name) => XLSX.utils.sheet_to_json(state.workbook.Sheets[name],
    { header: 1, raw: true, defval: null, blankrows: true });

  // ----- Sheet -> clean data (F2, C1-C9) -----
  function loadSheet(name) {
    const clean = cleanSheet(sheetRows(name));
    Object.assign(state, { sheet: name, columns: clean.columns, types: clean.types, rows: clean.rows,
      quality: clean.quality, filters: {}, sort: { col: null, dir: 1 }, search: "" });
    if (!state.rows.length) showError(`Sheet "${name}" has no data rows.`);
    state.kind = detectKind(state.columns);
    state.targets = null;
    if (state.kind === "sales") { // the Monthly_Targets sheet of the same workbook (5.1)
      const tName = state.workbook.SheetNames.find((n) => n !== name && cleanSheet(sheetRows(n)).columns.includes("Target_Amount"));
      if (tName) state.targets = cleanSheet(sheetRows(tName)).rows;
    }
    $("kindBadge").textContent = KIND_LABEL[state.kind];
    $("searchBox").value = "";
    $("uploadSection").hidden = true;
    $("dashboard").hidden = false;
    $("resetBtn").hidden = false;
    buildFilters();
    buildBuilderOptions();
    renderQuality();
    renderAll();
  }
  $("sheetSelect").addEventListener("change", (e) => loadSheet(e.target.value));

  // ----- Filters UI (F8) -----
  function buildFilters() {
    const box = $("filterBox");
    box.replaceChildren();
    filterColumns(state.kind, state.columns, state.types, state.rows).forEach((col) => {
      const values = [...new Map(state.rows.map((r) => [filterValue(r, col, state.types), r[col]])).entries()]
        .sort((a, b) => (state.types[col] === "date" ? a[1] - b[1] : a[0].localeCompare(b[0]))).map((x) => x[0]);
      const sel = document.createElement("select");
      sel.append(new Option("All", ""), ...values.map((v) => new Option(v, v)));
      sel.addEventListener("change", () => { state.filters[col] = sel.value; renderAll(); });
      const label = document.createElement("label");
      label.append(col.replace(/_/g, " "), sel);
      box.append(label);
    });
  }
  $("clearFilters").addEventListener("click", () => {
    state.filters = {};
    $("filterBox").querySelectorAll("select").forEach((s) => (s.value = ""));
    renderAll();
  });
  const filtered = () => applyFilters(state.rows, state.filters, state.types);

  // ----- Render everything that depends on filters -----
  function renderAll() {
    const rows = filtered();
    const result = analyse(state.kind, rows, { targets: state.targets, filters: state.filters, columns: state.columns, types: state.types });
    renderKPIs(result.kpis);
    renderInsights(result.insights, rows.length);
    renderCharts(result.charts, result.tables);
    renderBuilder();
    renderTable();
  }

  // ----- KPI cards (F5) -----
  function renderKPIs(kpis) {
    $("kpis").replaceChildren(...kpis.map((k) => {
      const d = document.createElement("div");
      d.className = "kpi";
      d.innerHTML = '<div class="label"></div><div class="value"></div><div class="note"></div>';
      d.children[0].textContent = k.label;
      d.children[1].textContent = k.value;
      d.children[2].textContent = k.note || "";
      return d;
    }));
  }

  // ----- Insights (F9) -----
  function renderInsights(list, n) {
    const items = n ? list : ["No rows match the current filters."];
    $("insights").replaceChildren(...items.map((t) => { const li = document.createElement("li"); li.textContent = t; return li; }));
  }

  // ----- Charts (F6, F10 PNG) -----
  const bgPlugin = { id: "bg", beforeDraw(c) { // so downloaded PNGs are not transparent
    const ctx = c.ctx; ctx.save(); ctx.fillStyle = cssVar("--surface"); ctx.fillRect(0, 0, c.width, c.height); ctx.restore(); } };

  function chartConfig(spec) {
    const pal = series();
    const round = spec.type === "pie" || spec.type === "doughnut";
    const horizontal = spec.type === "hbar";
    const datasets = spec.datasets.map((ds, i) => {
      let color = pal[i % pal.length];
      if (round) color = spec.status ? spec.status.map((s) => STATUS[s]) : ds.data.map((_, j) => pal[j % pal.length]);
      else if (spec.critical) color = ds.data.map((v) => (spec.critical(v) ? STATUS.critical : pal[0]));
      return { ...ds, backgroundColor: color, borderColor: round ? cssVar("--surface") : color,
        borderWidth: round ? 2 : spec.type === "line" ? 2 : 0, borderRadius: round ? 0 : 4,
        pointRadius: 4, tension: 0, maxBarThickness: 48 };
    });
    const fmt = spec.fmt || num;
    const valueAxis = { beginAtZero: true, type: spec.log ? "logarithmic" : "linear",
      grid: { color: cssVar("--line") }, ticks: { callback: (v) => (spec.log ? num(v) : fmt(v)) } };
    const catAxis = { grid: { display: false } };
    return {
      type: horizontal ? "bar" : spec.type,
      data: { labels: spec.labels, datasets },
      plugins: [bgPlugin],
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: horizontal ? "y" : "x",
        interaction: { mode: round ? "nearest" : "index", intersect: round },
        plugins: {
          legend: { display: round || datasets.length > 1, position: "bottom" },
          tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${fmt(round ? c.parsed : horizontal ? c.parsed.x : c.parsed.y)}` +
            (round ? ` (${pct((c.parsed / c.dataset.data.reduce((a, b) => a + b, 0)) * 100)})` : "") } },
        },
        scales: round ? {} : horizontal ? { x: valueAxis, y: catAxis } : { x: catAxis, y: valueAxis },
      },
    };
  }

  function drawChart(id, canvas, spec) {
    if (charts[id]) charts[id].destroy();
    Chart.defaults.color = cssVar("--ink-2");
    Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", sans-serif';
    charts[id] = new Chart(canvas, chartConfig(spec));
  }

  function card(title, desc, wide) {
    const c = document.createElement("div");
    c.className = "card" + (wide ? " wide" : "");
    c.innerHTML = '<div class="chart-head"><div><h2></h2><p></p></div></div>';
    c.querySelector("h2").textContent = title;
    c.querySelector("p").textContent = desc || "";
    return c;
  }

  function renderCharts(specs, tables) {
    Object.keys(charts).filter((k) => k !== "builder").forEach((k) => { charts[k].destroy(); delete charts[k]; });
    const grid = $("charts");
    grid.replaceChildren();
    specs.forEach((spec) => {
      const c = card(spec.title, spec.desc, spec.wide);
      const btn = document.createElement("button");
      btn.className = "btn ghost png-btn"; btn.type = "button"; btn.textContent = "Download PNG";
      btn.addEventListener("click", () => downloadPng(spec.id, spec.title));
      c.querySelector(".chart-head").append(btn);
      const box = document.createElement("div"); box.className = "chart-box";
      const canvas = document.createElement("canvas");
      canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", spec.title);
      box.append(canvas); c.append(box); grid.append(c);
      drawChart(spec.id, canvas, spec);
    });
    tables.forEach((t) => {
      const c = card(`${t.title} (${t.rows.length})`, t.desc, true);
      const wrap = document.createElement("div"); wrap.className = "table-wrap";
      wrap.append(t.rows.length ? makeTable(t.columns, t.rows, t.alert) : Object.assign(document.createElement("p"), { className: "muted", textContent: "None." }));
      c.append(wrap); grid.append(c);
    });
  }

  function makeTable(columns, rows, alert) {
    const table = document.createElement("table");
    if (alert) table.className = "alert-table";
    const tr = table.createTHead().insertRow();
    columns.forEach((c) => { const th = document.createElement("th"); th.textContent = c; tr.append(th); });
    const body = table.createTBody();
    rows.forEach((r) => {
      const row = body.insertRow();
      r.forEach((v) => { const td = row.insertCell(); td.textContent = typeof v === "number" ? nf2.format(v) : v; if (typeof v === "number") td.className = "num"; });
    });
    return table;
  }

  function downloadPng(id, title) {
    const a = document.createElement("a");
    a.href = charts[id].toBase64Image("image/png", 1);
    a.download = title.replace(/[^\w]+/g, "_") + ".png";
    a.click();
  }

  // ----- Custom chart builder (F7) -----
  function buildBuilderOptions() {
    const groupCols = state.columns.filter((c) => state.types[c] !== "number" || new Set(state.rows.map((r) => r[c])).size <= 30);
    $("bX").replaceChildren(...groupCols.map((c) => new Option(c, c)));
    const numCols = state.columns.filter((c) => state.types[c] === "number");
    $("bY").replaceChildren(new Option("(row count)", ""), ...numCols.map((c) => new Option(c, c)));
    const pref = { sales: ["City", "Net_Amount"], inventory: ["Warehouse", "Closing_Stock"],
      marketing: ["Platform", "Clicks"], feedback: ["Issue_Type", ""] }[state.kind];
    if (pref) { $("bX").value = pref[0]; $("bY").value = pref[1]; }
    if (numCols.length) $("bAgg").value = "sum";
  }
  ["bX", "bY", "bAgg", "bType"].forEach((id) => $(id).addEventListener("change", renderBuilder));

  function renderBuilder() {
    const x = $("bX").value, y = $("bY").value, type = $("bType").value;
    const agg = y ? $("bAgg").value : "count";
    if (!x) return;
    const isDate = state.types[x] === "date";
    let data = groupBy(filtered(), (r) => (isDate ? (r[x] ? monthKey(r[x]) : null) : r[x] ?? "(blank)"), (r) => (y ? r[y] : 1), agg);
    data = isDate || type === "line" ? data.sort(byKey) : data.sort(byValueDesc);
    if ((type === "pie" || type === "doughnut") && data.length > 8) { // never more than 8 colours: fold into "Other"
      const other = data.slice(7).reduce((a, d) => a + d[1], 0);
      data = [...data.slice(0, 7), ["Other", other]];
    } else data = data.slice(0, 30);
    const aggName = { sum: "Sum", avg: "Average", count: "Count", min: "Min", max: "Max" }[agg];
    drawChart("builder", $("builderChart"), {
      type, labels: data.map((d) => (isDate ? monthLabel(d[0]) : String(d[0]))),
      datasets: [{ label: y ? `${aggName} of ${y}` : "Rows", data: data.map((d) => +d[1].toFixed(2)) }],
      fmt: (v) => nf2.format(v),
    });
  }

  // ----- Data quality panel (C1-C9) -----
  function renderQuality() {
    const q = state.quality;
    const items = [["Rows read", q.rowsRead], ["Header found on row", q.headerRow], ["Blank rows removed", q.blankRows],
      ["TOTAL rows removed", q.totalRows], ["Duplicates removed", q.duplicates], ["Text → number", q.textToNumber],
      ["Text → date", q.textToDate], ["City spellings fixed", q.cityFixed], ["Clean rows", state.rows.length]];
    const grid = document.createElement("div"); grid.className = "quality-grid";
    items.forEach(([label, v]) => {
      const d = document.createElement("div"); d.className = "q-item";
      d.innerHTML = "<b></b><span></span>";
      d.firstChild.textContent = num(v); d.lastChild.textContent = label;
      grid.append(d);
    });
    const blanks = makeTable(["Column", "Type", "Blank cells"], state.columns.map((c) => [c, state.types[c], q.blanks[c]]));
    $("quality").replaceChildren(grid, blanks);
  }

  // ----- Preview table (F4): first 50 rows, search, click-to-sort -----
  const cellText = (v) => (v instanceof Date ? fmtDate(v) : v === null ? "" : typeof v === "number" ? nf2.format(v) : String(v));
  function renderTable() {
    let rows = filtered();
    const s = state.search.toLowerCase();
    if (s) rows = rows.filter((r) => state.columns.some((c) => cellText(r[c]).toLowerCase().includes(s)));
    const { col, dir } = state.sort;
    if (col) rows = [...rows].sort((a, b) => (a[col] ?? "") > (b[col] ?? "") ? dir : (a[col] ?? "") < (b[col] ?? "") ? -dir : 0);
    $("rowCount").textContent = `(showing ${Math.min(50, rows.length)} of ${num(rows.length)} rows)`;
    const table = $("preview");
    table.replaceChildren();
    const tr = table.createTHead().insertRow();
    state.columns.forEach((c) => {
      const th = document.createElement("th");
      th.textContent = c + (col === c ? (dir > 0 ? " ▲" : " ▼") : "");
      th.addEventListener("click", () => { state.sort = { col: c, dir: col === c ? -dir : 1 }; renderTable(); });
      tr.append(th);
    });
    const body = table.createTBody();
    rows.slice(0, 50).forEach((r) => {
      const row = body.insertRow();
      state.columns.forEach((c) => { const td = row.insertCell(); td.textContent = cellText(r[c]); if (state.types[c] === "number") td.className = "num"; });
    });
  }
  $("searchBox").addEventListener("input", (e) => { state.search = e.target.value; renderTable(); });

  // ----- Export clean CSV (F10) -----
  $("csvBtn").addEventListener("click", () => {
    const esc = (v) => { const s = v instanceof Date ? `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}` : v ?? "";
      return /[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : s; };
    const lines = [state.columns.map(esc).join(","), ...filtered().map((r) => state.columns.map((c) => esc(r[c])).join(","))];
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }); // BOM so Excel reads ₹ etc.
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${state.file.name.replace(/\.\w+$/, "")}_${state.sheet}_clean.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // ----- Theme (F11) and reset (F12) -----
  $("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    $("themeBtn").textContent = isDark() ? "Light mode" : "Dark mode";
    if (state.rows.length) renderAll();
  });
  $("resetBtn").addEventListener("click", () => {
    Object.values(charts).forEach((c) => c.destroy());
    Object.keys(charts).forEach((k) => delete charts[k]);
    $("fileInput").value = "";
    $("dashboard").hidden = true;
    $("uploadSection").hidden = false;
    $("resetBtn").hidden = true;
    showError("");
  });
}
