# Kesar Kitchen – "Excel to Dashboard" Web App: Requirements

> Classroom simulation. **Kesar Kitchen Foods** is a FICTIONAL company and every number in this lab is simulated.

## 1. The business problem
Kesar Kitchen Foods (Vadodara) sells Gujarati namkeen, sweets, ready-to-eat mixes, spices and beverages in
Vadodara, Ahmedabad, Surat and Rajkot, through retail stores, distributors, Amazon, its own website and
quick-commerce apps.

Every Monday the MIS executive downloads 4 spreadsheets, cleans them by hand and builds pivot charts in Excel
for the founders. This takes about **6 hours a week**, and the charts break whenever the export changes a little.

**Your job:** use an AI coding assistant to build a **single-page web app (HTML + CSS + JavaScript)** where anyone can
**upload an Excel / CSV file and instantly see a clean, correct, interactive dashboard**. No server, no install:
the founders just double-click `index.html`.

## 2. Technical constraints (give these to the AI exactly)
| # | Constraint |
|---|---|
| T1 | Exactly 3 files: `04_output/dashboard/index.html`, `style.css`, `app.js`. No frameworks, no build step, no backend. |
| T2 | Works by double-clicking `index.html` (file://) in Chrome / Edge. |
| T3 | Libraries only from a CDN, with a fixed version: **SheetJS** `https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js` and **Chart.js** `https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js`. |
| T4 | The uploaded file never leaves the browser (read it with `FileReader` / `arrayBuffer`). |
| T5 | Accepts `.xlsx`, `.xls` and `.csv`. Shows a friendly error for anything else, or an empty file. |
| T6 | Responsive: usable on a laptop and on a phone (cards and charts stack in one column). |
| T7 | Readable code: small functions, comments for every section, no console errors. |

## 3. Data-cleaning rules (the app must apply these, automatically, in this order)
| # | Rule | Why (look in the sample files) |
|---|---|---|
| C1 | **Find the header row**: the first row in which at least half of the cells are filled. Rows above it are titles. | Inventory file has a title + a blank row above the header |
| C2 | Remove rows where **every cell is blank**. | Sales file |
| C3 | Remove rows whose first cell is `TOTAL` / `Grand Total` (any case). | Inventory file has a TOTAL row – keeping it doubles every total |
| C4 | Remove **exact duplicate** rows (all cells identical). Count them. | Sales file |
| C5 | Trim spaces from every text cell. | `"Vadodara "` |
| C6 | **Numbers stored as text** → numbers: strip `Rs`, `₹`, commas, `/-`, spaces. | `Net_Amount`, `Spend` |
| C7 | **Dates** → real dates. Excel date serials and text dates. Text dates are **DAY first** (`01-04-2026` = 1 April 2026). | `Order_Date`, `Date` |
| C8 | **City** → one of `Vadodara`, `Ahmedabad`, `Surat`, `Rajkot` (`Baroda`→Vadodara, `Ahmd`/`AMD`/`Amdavad`→Ahmedabad, any case). | Sales file |
| C9 | **Blank numbers stay blank** – they are ignored in averages, never counted as 0. | `Rating` in feedback |

After cleaning, show a **Data Quality panel**: rows read, header row found, blank rows removed, total rows removed,
duplicates removed, values converted (text→number, text→date, city fixes), and blanks per column.

## 4. Functional requirements (every file)
| # | Feature |
|---|---|
| F1 | Upload by **drag-and-drop** and by **"Choose file"** button. Show file name, size and sheet count. |
| F2 | If the workbook has more than one sheet, a **sheet selector** dropdown. |
| F3 | **Auto-detect** each column's type: number, date or text. |
| F4 | **Data preview table**: first 50 rows, search box, click a column header to sort. |
| F5 | **KPI cards** at the top (4–6 big numbers, formatted in Indian style, e.g. `Rs 56,28,836`). |
| F6 | **Smart dashboard**: recognise which file was uploaded (by its column names) and draw the charts in section 5. |
| F7 | **Custom chart builder** for ANY file: choose Group-by column (X), Value column (Y), aggregation (Sum / Average / Count / Min / Max) and chart type (Bar / Horizontal bar / Line / Pie / Doughnut). |
| F8 | **Filters**: at least 2 dropdown filters (e.g. City, Category). Changing a filter updates KPIs, charts and table. |
| F9 | **Insights box**: 3–5 auto-generated sentences with numbers, e.g. "August is the best month: Rs 15.2 lakh (27% of H1)". |
| F10 | **Export**: download each chart as PNG and the cleaned + filtered data as CSV. |
| F11 | **Light / dark theme** toggle. |
| F12 | A **Reset** button to upload another file. |

## 5. Smart dashboard – required visuals per file
### 5.1 Sales (`Sales_Apr-Sep-2026.xlsx`) – detect by columns `Order_ID`, `Net_Amount`
- KPIs: Total revenue, Orders, Units sold, Average order value, Best city.
- Line chart: **Revenue by month** (Apr → Sep, in calendar order).
- Bar chart: **Revenue by city**.
- Doughnut: **Revenue share by category**.
- Bar: **Revenue by channel**.
- Horizontal bar: **Top 10 products** by revenue.
- Grouped bar: **Target vs Actual by month** (reads the `Monthly_Targets` sheet of the same workbook).
- Filters: City, Channel, Category.

### 5.2 Inventory (`Inventory_Stock_Sep-2026.xlsx`) – detect by `SKU`, `Closing_Stock`
- KPIs: SKUs, Total closing units, **Stock value** (Closing_Stock × Unit_Cost), Low-stock SKUs, Expiring ≤ 30 days.
- Bar: **Stock value by warehouse**.
- Bar: **Sell-through % by category** = Sold ÷ (Opening + Received).
- **Red alert table**: SKUs where Closing_Stock ≤ Reorder_Level.
- Table: SKUs expiring within 30 days of 30-Sep-2026.
- Data-quality check: rows where Closing_Stock ≠ Opening_Stock + Received − Sold.
- Filters: Warehouse, Category.

### 5.3 Marketing (`Marketing_Campaigns_H1.xlsx`) – detect by `Campaign_ID`, `Spend`
- KPIs: Total spend, Revenue, **ROAS** (Revenue ÷ Spend), Orders, Cost per order.
- Grouped bar: **Spend vs Revenue by platform**.
- Bar: **ROAS by platform** (colour bars below 1.0 red – they lose money).
- Funnel (horizontal bar): Impressions → Clicks → Leads → Orders.
- Line: **Spend by month**.
- Filters: Platform, Month.

### 5.4 Customer feedback (`Customer_Feedback_H1.csv`) – detect by `Feedback_ID`, `NPS_Score`
- KPIs: Responses, Average rating (out of 5), **NPS** = % promoters (9–10) − % detractors (0–6), % complaints.
- Bar: **Rating distribution** (1 to 5 stars).
- Doughnut: Promoters / Passives / Detractors.
- Bar: **Complaints by issue type** (exclude `None`).
- Bar: **Average rating by channel**.
- Filters: City, Channel.

### 5.5 Any other spreadsheet
No smart dashboard – show the Data Quality panel, preview, generic KPIs (rows, columns, sum of the first numeric
column) and the **custom chart builder**. The app must not crash.

## 6. Definition of done
- [ ] All 4 sample files load without a console error (F12 → Console).
- [ ] KPI numbers match the numbers you calculated yourself in Excel (Step 2 of the prompts).
- [ ] Ahmedabad appears as ONE city, not three. Inventory has no "TOTAL" bar.
- [ ] Filters change KPIs and charts. Exported CSV opens in Excel.
- [ ] Works on a phone-sized window (Chrome DevTools → device toolbar).
