"""
Computes the check totals students' dashboards must match, using the cleaning rules in
02_requirements/Dashboard_Requirements.md (section 3).
Run from the lab folder:  python instructor/compute_answer_key.py
"""
from pathlib import Path

import pandas as pd

DATA = Path(__file__).resolve().parent.parent / "01_sample_data"
CITY_MAP = {"baroda": "Vadodara", "ahmd": "Ahmedabad", "amd": "Ahmedabad", "amdavad": "Ahmedabad"}


def to_num(s):
    return pd.to_numeric(s.astype(str).str.replace(r"[^0-9.\-]", "", regex=True), errors="coerce")


def to_date(s):
    return s.apply(lambda v: v if isinstance(v, pd.Timestamp) else pd.to_datetime(v, dayfirst=True))


def city(s):
    s = s.astype(str).str.strip()
    return s.apply(lambda v: CITY_MAP.get(v.lower(), v.title()))


def rs(x):
    return f"Rs {x:,.0f}"


def section(t):
    print(f"\n## {t}\n")


# ------------------------------------------------------------------ SALES
raw = pd.read_excel(DATA / "Sales_Apr-Sep-2026.xlsx", sheet_name="Transactions")
blank = int(raw.isna().all(axis=1).sum())
df = raw.dropna(how="all")
dups = int(df.duplicated().sum())
df = df.drop_duplicates().copy()
text_amt = int(df.Net_Amount.apply(lambda v: isinstance(v, str)).sum())
text_date = int(df.Order_Date.apply(lambda v: isinstance(v, str)).sum())
city_variants = sorted(set(df.City.astype(str)) - {"Vadodara", "Ahmedabad", "Surat", "Rajkot"})
df["Net_Amount"] = to_num(df.Net_Amount)
df["Order_Date"] = to_date(df.Order_Date)
df["City"] = city(df.City)
df["Month"] = df.Order_Date.dt.strftime("%Y-%m")

section("Sales_Apr-Sep-2026.xlsx  (sheet: Transactions)")
print(f"| Check | Value |\n|---|---|")
print(f"| Raw data rows (excl. header) | {len(raw)} |")
print(f"| Blank rows removed | {blank} |")
print(f"| Exact duplicate rows removed | {dups} |")
print(f"| Clean rows (= orders) | {len(df)} |")
print(f"| Net_Amount stored as text | {text_amt} |")
print(f"| Order_Date stored as text | {text_date} |")
print(f"| City spellings to fix | {', '.join(repr(c) for c in city_variants)} |")
print(f"| **Total revenue (Net_Amount)** | **{rs(df.Net_Amount.sum())}** |")
print(f"| Total units (Qty) | {int(df.Qty.sum()):,} |")
print(f"| Average order value | {rs(df.Net_Amount.mean())} |")
print("\nRevenue by month:\n")
print(df.groupby("Month").Net_Amount.sum().apply(rs).to_markdown())
print("\nRevenue by city:\n")
print(df.groupby("City").Net_Amount.sum().sort_values(ascending=False).apply(rs).to_markdown())
print("\nRevenue by category:\n")
print(df.groupby("Category").Net_Amount.sum().sort_values(ascending=False).apply(rs).to_markdown())
print("\nRevenue by channel:\n")
ch = df.groupby("Channel").Net_Amount.sum().sort_values(ascending=False)
print(pd.DataFrame({"Revenue": ch.apply(rs), "Share %": (ch / ch.sum() * 100).round(1)}).to_markdown())
print("\nQuick Commerce revenue by month (growth story):\n")
print(df[df.Channel == "Quick Commerce"].groupby("Month").Net_Amount.sum().apply(rs).to_markdown())
print("\nTop 5 products by revenue:\n")
print(df.groupby("Product").Net_Amount.sum().nlargest(5).apply(rs).to_markdown())

tg = pd.read_excel(DATA / "Sales_Apr-Sep-2026.xlsx", sheet_name="Monthly_Targets")
act = df.groupby("City").Net_Amount.sum()
tgc = tg.groupby("City").Target_Amount.sum()
ach = pd.DataFrame({"Target": tgc.apply(rs), "Actual": act.apply(rs), "Achievement %": (act / tgc * 100).round(1)})
print("\nTarget vs actual by city (H1):\n")
print(ach.to_markdown())

# ------------------------------------------------------------------ INVENTORY
inv = pd.read_excel(DATA / "Inventory_Stock_Sep-2026.xlsx", header=2)
inv = inv[inv.SKU.astype(str).str.upper() != "TOTAL"].dropna(how="all").copy()
inv["Stock_Value"] = inv.Closing_Stock * inv.Unit_Cost
inv["Calc_Closing"] = inv.Opening_Stock + inv.Received - inv.Sold
mism = inv[inv.Calc_Closing != inv.Closing_Stock]
low = inv[inv.Closing_Stock <= inv.Reorder_Level]
asof = pd.Timestamp("2026-09-30")
exp = inv[(inv.Expiry_Date - asof).dt.days <= 30]

section("Inventory_Stock_Sep-2026.xlsx")
print("| Check | Value |\n|---|---|")
print("| Header row is row | 3 (rows 1-2 are a title + blank) |")
print(f"| SKU rows (TOTAL row excluded) | {len(inv)} |")
print(f"| **Total stock value (Closing x Unit_Cost)** | **{rs(inv.Stock_Value.sum())}** |")
print(f"| SKUs at/below reorder level | {len(low)} |")
print(f"| SKUs expiring within 30 days of 30-Sep-2026 | {len(exp)} |")
print(f"| Rows where Closing != Opening + Received - Sold | {len(mism)} ({', '.join(mism.SKU)}) |")
print("\nStock value by warehouse:\n")
print(inv.groupby("Warehouse").Stock_Value.sum().apply(rs).to_markdown())
print("\nLow-stock SKUs:\n")
print(low[["SKU", "Product", "Warehouse", "Closing_Stock", "Reorder_Level"]].to_markdown(index=False))
st = inv.groupby("Category")[["Sold", "Opening_Stock", "Received"]].sum()
st["Sell_Through_%"] = (st.Sold / (st.Opening_Stock + st.Received) * 100).round(1)
print("\nSell-through % by category = Sold / (Opening + Received):\n")
print(st[["Sell_Through_%"]].to_markdown())

# ------------------------------------------------------------------ MARKETING
mk = pd.read_excel(DATA / "Marketing_Campaigns_H1.xlsx")
text_spend = int(mk.Spend.apply(lambda v: isinstance(v, str)).sum())
mk["Spend"] = to_num(mk.Spend)
g = mk.groupby("Platform")[["Spend", "Impressions", "Clicks", "Leads", "Orders", "Revenue"]].sum()
g["ROAS"] = (g.Revenue / g.Spend).round(2)
g["CTR_%"] = (g.Clicks / g.Impressions * 100).round(2)
g["Cost_per_Order"] = (g.Spend / g.Orders).round(0)

section("Marketing_Campaigns_H1.xlsx")
print("| Check | Value |\n|---|---|")
print(f"| Campaign rows | {len(mk)} |")
print(f"| Spend stored as text | {text_spend} |")
print(f"| **Total spend** | **{rs(mk.Spend.sum())}** |")
print(f"| Total attributed revenue | {rs(mk.Revenue.sum())} |")
print(f"| Overall ROAS (Revenue / Spend) | {mk.Revenue.sum() / mk.Spend.sum():.2f} |")
print(f"| Funnel totals | Impressions {mk.Impressions.sum():,} > Clicks {mk.Clicks.sum():,} > "
      f"Leads {mk.Leads.sum():,} > Orders {mk.Orders.sum():,} |")
print("\nBy platform:\n")
print(g.sort_values("ROAS", ascending=False)[["Spend", "Revenue", "ROAS", "CTR_%", "Cost_per_Order"]].to_markdown())

# ------------------------------------------------------------------ FEEDBACK
fb = pd.read_csv(DATA / "Customer_Feedback_H1.csv")
n = len(fb)
prom = (fb.NPS_Score >= 9).sum()
det = (fb.NPS_Score <= 6).sum()
section("Customer_Feedback_H1.csv")
print("| Check | Value |\n|---|---|")
print(f"| Responses | {n} |")
print(f"| Blank Rating cells (ignored in average) | {int(fb.Rating.isna().sum())} |")
print(f"| **Average rating** | **{fb.Rating.mean():.2f} / 5** |")
print(f"| Promoters (9-10) / Passives (7-8) / Detractors (0-6) | {prom} / {n - prom - det} / {det} |")
print(f"| **NPS = %Promoters - %Detractors** | **{(prom - det) / n * 100:.1f}** |")
print("\nComplaints by issue type (excluding 'None'):\n")
print(fb[fb.Issue_Type != "None"].Issue_Type.value_counts().to_markdown())
print("\nAverage rating by channel:\n")
print(fb.groupby("Channel").Rating.mean().round(2).sort_values().to_markdown())
print("\n'Delivery delay' complaints by channel:\n")
print(fb[fb.Issue_Type == "Delivery delay"].Channel.value_counts().to_markdown())
