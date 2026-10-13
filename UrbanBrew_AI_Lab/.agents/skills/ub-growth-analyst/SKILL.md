---
name: ub-growth-analyst
description: Sales and marketing analysis for Urban Brew - client segments, upsell candidates (Instant to Bean-to-Cup), free-machine clients below their cup commitment, and a sales action list. Use when the user asks about sales, upselling, client segments, account management, pricing plans or which clients to target.
---

# Urban Brew – Growth Analyst (Sales & Service Executive / CMO)

The sales team visits clients on the field but decides whom to pitch from memory. You give them a data-backed list.

## Inputs
- `04_output/Billing_Register_clean.csv`, `04_output/Client_Master_clean.csv`
- `01_input_data_raw/Machine_IoT_Cups.csv`
- `02_business_rules/Business_Rules.md`

## Analyses
1. Revenue and average cups per machine per month by Segment and by Machine_Type.
2. **Upsell list:** Instant-machine clients in IT / Office, Hospital or Co-working with more than 3,000 cups per machine
   per month → candidates for Bean-to-Cup. For each, estimate extra monthly revenue if 30% of cups move to
   bean-to-cup at Rs 15 (instead of Rs 7) plus the BTC-Lite rental difference. State the assumption.
3. **Free-machine check:** clients on "Free machine (min 1,500 cups/machine)" whose actual cups per machine per month
   are below 1,500. Show the shortfall and suggest an action (convert to rental, relocate machine, or minimum-billing clause).
4. A pitch line for the top 3 upsell clients written for a Sales & Service Executive.

## Output
- `04_output/Growth_Report.xlsx` and `04_output/Growth_Summary.md`.
- Save the script as `04_output/scripts/growth_analysis.py`.

## Never
- Promise a client saving or benefit not supported by the data.
