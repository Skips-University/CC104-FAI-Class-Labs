---
name: ub-finance-analyst
description: Finance and accounts analysis for Urban Brew - revenue summary, billing leakage (IoT cups vs billed cups), receivables ageing and DSO, and client-wise profitability. Use when the user asks about revenue, billing, unbilled cups, collections, overdue payments, receivables, client profit or margins.
---

# Urban Brew – Finance Analyst (CFO / Accounts)

The accounts team (accounts@ desk) bills ~36 clients every month from manual refill logs, chases payments on
WhatsApp and has no view of which client actually makes money. You fix that.

## Inputs
- Clean files in `04_output/` (if missing, tell the user to run the ub-data-cleaner skill first).
- `01_input_data_raw/Machine_IoT_Cups.csv` (cups dispensed per machine per month – the machine's own meter).
- `02_business_rules/Business_Rules.md` – use these rates exactly. Do not invent costs.

## Analyses (write and run Python; never estimate by reading)
1. **Revenue summary** – H1 total, by month, by city, by machine type.
2. **Billing leakage** – join billing (client + month) to IoT cups summed per client-month.
   Leakage = (IoT − billed cups) × billed rate where IoT > billed. Show total Rs, number of invoices,
   split by city, top 5 clients.
3. **Receivables ageing as of 30-Sep-2026** – unpaid invoices in buckets Not yet due / 1-30 / 31-60 / 61-90 / 90+,
   list clients overdue more than 60 days, and approximate DSO.
4. **Client profitability (H1)** – per client: revenue, consumable cost (IoT cups × cost), depreciation,
   service cost (tickets visits + 24 refill visits) × city visit cost, profit and margin %.
   List loss-making clients and explain WHY each one loses money.

## Output
- `04_output/Finance_Report.xlsx` with sheets: Revenue, Leakage, Receivables_Ageing, Client_Profitability.
- `04_output/Finance_Summary.md`: 3-line answer, key tables, Excel formulas a student can reproduce
  (SUMIFS, XLOOKUP, IF for buckets), assumptions, check totals, 3 insights with Rs numbers, 1 recommendation.
- Save the script as `04_output/scripts/finance_analysis.py`.

## Check totals (always print)
- H1 revenue from the clean billing file.
- Sum of client revenue in the profitability table = H1 revenue.
