# Urban Brew – Business Rules for the AI Lab

> Classroom simulation. Urban Brew (Urban Beverages, Vadodara) is a real company, but every number,
> client name and employee name in this lab is SIMULATED for teaching. None of it is Urban Brew's actual data.

Period: April 2026 – September 2026 (H1 of FY 2026-27). Currency: Indian Rupees (Rs). "As of" date: 30-Sep-2026.

## What Urban Brew sells
- Places coffee / beverage / snack machines at client workplaces (offices, factories, hospitals, colleges, co-working).
- Earns: monthly machine rental + consumables billed per cup / item.
- Field technicians visit every client weekly (refill + preventive maintenance) and also attend breakdown tickets.

## Machine models (per machine)
| Model | Type | Rental / month | Billed per cup or item | Our cost per cup or item | Depreciation / month |
|---|---|---|---|---|---|
| IM-200 | Instant | 1,500 | 7 | 4.2 | 700 |
| IM-400 | Instant | 2,000 | 7 | 4.2 | 1,000 |
| BTC-Lite | Bean-to-Cup | 6,000 | 15 | 8.5 | 3,500 |
| BTC-Pro | Bean-to-Cup | 9,000 | 15 | 8.5 | 5,500 |
| SV-60 | Snack Vending | 5,000 | 22 | 17 | 4,000 |

## Plans
- **Rental + Consumables**: client pays rental + consumables.
- **Free machine (min 1,500 cups/machine)**: no rental; client promises at least 1,500 cups per machine per month.

## Service
- Every client gets 4 refill / maintenance visits a month, plus breakdown visits (column `Visits` in tickets).
- Cost per visit: **Vadodara Rs 350**, **Ahmedabad Rs 1,100** (all technicians are based in Vadodara and travel ~230 km round trip).
- SLA (time from ticket logged to resolved): **Priority = 8 hours**, **Standard = 24 hours**. Tier is in Client_Master.
- Ticket still unresolved on 30-Sep-2026 = "open".

## Finance definitions
- Revenue = Rental_Amount + Consumables_Amount (= Total_Amount).
- Client profit = Revenue − consumable cost (on IoT cups dispensed) − depreciation − (service visits × cost per visit).
- **Billing leakage** = (IoT Cups_Dispensed − Cups_Billed) × billed rate, only where IoT > billed.
- Overdue days = 30-Sep-2026 − Due_Date for unpaid invoices. Buckets: Not yet due, 1-30, 31-60, 61-90, 90+.
- DSO (approx.) = Outstanding receivables ÷ H1 revenue × 183 days.

## HR assumption for the hiring question
- A new Service Officer based in Ahmedabad costs Rs 30,000 a month (salary + bike + phone).
- If hired, Ahmedabad visits cost the same as Vadodara visits (Rs 350).
