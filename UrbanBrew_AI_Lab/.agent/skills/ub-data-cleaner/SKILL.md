---
name: ub-data-cleaner
description: Profiles and cleans Urban Brew's raw spreadsheet exports (billing register, Zoho service tickets, client master, IoT cups, field staff) and produces clean files plus a before/after data quality report. Use when the user asks to check, profile, clean, standardise or fix the raw data in 01_input_data_raw.
---

# Urban Brew – Data Cleaner (MIS / Chief Data Officer)

You help the MIS team turn messy monthly exports into clean, trustworthy files. Every month this takes the
accounts team 2 days by hand; your job is to do it in minutes AND leave a reusable script.

## Inputs
- Raw files: `01_input_data_raw/` (never modify these)
- Rules: `02_business_rules/Business_Rules.md`

## Steps
1. **Profile first, change nothing.** For every raw file report: rows, columns, blanks per column, exact duplicate rows,
   distinct spellings of name columns (client, city, technician), date formats found, numbers stored as text.
   Show this as a table titled **BEFORE**.
2. **Propose a numbered cleaning plan** and wait for the user to say "go".
3. **Clean** (write and run Python/pandas):
   - Client names → the exact `Client_Name` in `Client_Master.xlsx` (map variants like UPPERCASE, "Pvt Ltd", missing spaces, short forms).
   - City → only `Vadodara` or `Ahmedabad` (Baroda = Vadodara; Ahmd / AMD = Ahmedabad).
   - Dates → real dates. Indian format is DAY first (01/04/2026 = 1 April).
   - Amounts → numbers (strip "Rs", commas, "/-"). `Amount_Paid = "pending"` → 0 and `Paid_Date` blank.
   - Remove exact duplicate rows; report how many.
   - Technician names → full proper name (e.g. "JIGNESH", "Jignesh" → "Jignesh Patel").
   - Service ticket free text `Issue_Description` → add column `Issue_Category` with exactly these 6 values:
     Grinder jam, Not dispensing, Water leak, Descaling / cleaning, Payment / card reader, Display / power.
4. **Save** to `04_output/`: `Billing_Register_clean.csv`, `Service_Tickets_clean.csv`, `Client_Master_clean.csv`.
5. **Save the script** as `04_output/scripts/clean_data.py` so next month the team just runs it again.
6. **Write `04_output/Data_Quality_Report.md`** with a BEFORE vs AFTER table per file
   (rows, duplicates, spellings, text-numbers, total billed amount before and after).

## Check before you finish
- Clean billing rows = 36 clients × 6 months = 216. If not, explain.
- Every client name in the clean billing file exists in Client_Master.
- Print the clean total billed amount so a human can tie it out.

## Never
- Delete a row that is not an exact duplicate without asking.
- Guess a client mapping you are not sure about – list it as "needs human check".
