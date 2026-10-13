# Data Dictionary – sample files in `01_sample_data/`

> Simulated data for FICTIONAL Kesar Kitchen Foods. Period: April – September 2026 (H1 FY 2026-27). Currency: Rs.
> The files are deliberately a little messy – exactly like real exports. Do **not** fix them by hand: the app must.

## 1. `Sales_Apr-Sep-2026.xlsx`
**Sheet `Transactions`** – one row per order.

| Column | Type | Meaning / example |
|---|---|---|
| Order_ID | text | `KK-50001` |
| Order_Date | date | order date (some stored as text `15-05-2026`) |
| City | text | Vadodara, Ahmedabad, Surat, Rajkot (with spelling variants) |
| Channel | text | Retail Store, Distributor, Amazon, Own Website, Quick Commerce |
| Product | text | `Kaju Katli 500g` |
| Category | text | Namkeen, Sweets, Ready-to-Eat, Spices, Beverages |
| Qty | number | units |
| Unit_Price | number | MRP per unit, Rs |
| Discount_Pct | number | % discount given |
| Net_Amount | number | Qty × Unit_Price × (1 − Discount_Pct/100), rounded (some stored as text `Rs 1,250`) |
| Sales_Rep | text | field sales person, or `Online Team` |
| Payment_Mode | text | UPI, Cash, Card, COD, NEFT, Credit 30 days |

**Sheet `Monthly_Targets`** – Month (1st of month), City, Target_Amount (Rs).

## 2. `Inventory_Stock_Sep-2026.xlsx` (sheet `Stock_Sep-2026`)
Row 1 is a report title, row 2 is blank, **row 3 is the header**, the last row is a `TOTAL` row.

| Column | Meaning |
|---|---|
| SKU | product + warehouse code, `KK05-SUR` |
| Product, Category | as in sales |
| Warehouse | Vadodara WH, Ahmedabad WH, Surat WH |
| Opening_Stock, Received, Sold, Closing_Stock | units for September 2026. Closing should = Opening + Received − Sold |
| Reorder_Level | re-order when Closing_Stock ≤ this |
| Unit_Cost | our cost per unit, Rs |
| Expiry_Date | earliest expiry of the stock in hand |

## 3. `Marketing_Campaigns_H1.xlsx` (sheet `Campaigns`)
| Column | Meaning |
|---|---|
| Campaign_ID, Campaign_Name | `MK-001`, `Summer Aam Panna - Instagram` |
| Platform | Instagram, Facebook, Google Ads, YouTube, WhatsApp, Print / Hoardings |
| Month | 1st of the month |
| Spend | Rs spent (a few stored as text) |
| Impressions → Clicks → Leads → Orders | marketing funnel counts |
| Revenue | Rs revenue attributed to the campaign |

Useful formulas: CTR = Clicks ÷ Impressions; ROAS = Revenue ÷ Spend; Cost per order = Spend ÷ Orders.

## 4. `Customer_Feedback_H1.csv`
| Column | Meaning |
|---|---|
| Feedback_ID | `FB-0001` |
| Date | text `dd-mm-yyyy` |
| City, Channel, Product | as in sales |
| Rating | 1–5 stars (some blank = customer skipped the question) |
| NPS_Score | 0–10 "How likely are you to recommend us?" |
| Issue_Type | Taste, Packaging, Delivery delay, Price, Quantity / weight, None |
| Comment | free text |

NPS = % of responses scoring 9–10 (promoters) − % scoring 0–6 (detractors). Range −100 to +100.
