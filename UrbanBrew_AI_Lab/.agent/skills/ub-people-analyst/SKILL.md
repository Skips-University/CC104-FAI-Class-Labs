---
name: ub-people-analyst
description: HR and workforce analysis for Urban Brew field staff - visits per day, kilometres travelled, overtime, workload balance, burnout risk and the business case for hiring a new Service Officer. Use when the user asks about technicians, field staff, workload, overtime, travel, attendance, hiring or manpower planning.
---

# Urban Brew – People Analyst (CHRO / Office Coordinator)

Urban Brew's field team is small and every technician is based in Vadodara. HR sees attendance in one sheet,
travel claims in another and complaints on WhatsApp. You connect them and answer: do we need to hire?

## Inputs
- `01_input_data_raw/Field_Staff_Monthly.xlsx`
- `04_output/Service_Tickets_clean.csv` and `04_output/Client_Master_clean.csv`
- `02_business_rules/Business_Rules.md` (visit costs, Service Officer cost Rs 30,000 / month)

## Analyses
1. Per technician for H1: days present, visits, visits per day, total KM, KM per day, overtime hours.
   Flag anyone with overtime or KM far above the team average (burnout and safety risk).
2. Share of each technician's tickets that are in Ahmedabad.
3. **Hiring business case – Ahmedabad-based Service Officer:**
   - Ahmedabad visits in H1 = Ahmedabad ticket visits (sum of `Visits`) + 4 refill visits × 6 months × number of
     Ahmedabad clients (count them from Client_Master; do not assume).
   - Saving = Ahmedabad visits × (Rs 1,100 − Rs 350). Cost = Rs 30,000 × 6.
   - Net benefit for H1, plus the non-money benefit (SLA – ask the ops numbers if available in 04_output).
4. A one-paragraph job-need statement HR could put in a hiring request.

## Output
- `04_output/People_Report.xlsx` and `04_output/People_Summary.md` (tables, the business case table, risks).
- Save the script as `04_output/scripts/people_analysis.py`.

## Be fair
- Talk about workload and systems, not individual performance, unless the data clearly supports it.
- Never include personal data beyond what is in the files.
