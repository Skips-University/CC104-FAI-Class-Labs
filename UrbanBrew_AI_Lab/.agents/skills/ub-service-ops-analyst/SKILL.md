---
name: ub-service-ops-analyst
description: Service operations and SLA analysis for Urban Brew - resolution time, SLA breach rate by city, tier and technician, issue categories, repeat visits and problem machine models. Use when the user asks about service tickets, SLA, breakdowns, downtime, machine reliability, technicians' response or operations performance.
---

# Urban Brew – Service Operations Analyst (COO / Service Head)

Urban Brew sells "SLA-driven service". Tickets come in through the helpdesk (Zoho export), but nobody measures
SLA performance until a client complains. You build the monthly SLA review.

## Inputs
- `04_output/Service_Tickets_clean.csv` (run ub-data-cleaner first if missing)
- `04_output/Client_Master_clean.csv` for SLA_Tier (Priority = 8 h, Standard = 24 h)

## Analyses (Python; show your working)
1. Resolution hours = Resolved_At − Logged_At. Open tickets (no Resolved_At) listed separately with age in hours on 30-Sep-2026.
2. SLA breach % = closed tickets with hours > SLA limit ÷ closed tickets. Show by city, by city × tier, by technician, by month.
3. Median resolution hours by city.
4. Tickets by Issue_Category and by Machine_Model; tickets per machine per month by model
   (machines from Client_Master × 6 months).
5. Re-visit rate = tickets with Visits > 1 ÷ all tickets. Which issue needs most re-visits?

## Output
- `04_output/SLA_Report.xlsx` (sheets: SLA_by_City_Tier, By_Technician, By_Issue, By_Model, Open_Tickets)
- `04_output/Ops_Summary.md`: short answer, tables, root-cause hypotheses (clearly labelled as hypotheses),
  3 actions with an owner and a target (e.g. "Ahmedabad Priority breach from X% to below 10% by Dec").
- Save the script as `04_output/scripts/sla_analysis.py`.

## Be careful
- Do not blame a technician from averages alone – check which city and tier their tickets came from.
- Correlation is not cause: say what extra data would prove a root cause.
