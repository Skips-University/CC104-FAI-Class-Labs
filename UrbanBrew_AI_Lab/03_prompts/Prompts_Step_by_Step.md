# Urban Brew AI Lab – Step-by-step prompts

Paste these one by one in Antigravity (Agent panel) with the `UrbanBrew_AI_Lab` folder open as your workspace.
After each step, OPEN the files it created in `04_output/` and compare them with the raw files. That comparison is the lesson.

---

## Step 0 – Context (everyone, 2 min)
```
Read 02_business_rules/Business_Rules.md and list the files in 01_input_data_raw. We are Urban Brew's management team in Vadodara. Our finance, operations, HR and sales teams lose days every month working through these messy exports by hand. Today we use the ub-* skills in this workspace to automate it. Confirm which skills you can see, and what each one does, in one line each. Do not analyse yet.
```

## Step 1 – Can we trust the data? (Chief Data Officer, 10 min)
```
Use the ub-data-cleaner skill. Profile every file in 01_input_data_raw and show me the BEFORE table. Then propose the cleaning plan. Do not clean yet.
```
Then:
```
Go. Clean the data, save the clean files and the script, and write Data_Quality_Report.md with a BEFORE vs AFTER table. Tell me the billed total before and after cleaning.
```
**Look at:** open `Billing_Register_Apr-Sep-2026.xlsx` (raw) next to `04_output/Billing_Register_clean.csv`. Find "Rs 99,310/-" in the raw file and see what it became.

## Step 2 – Where is money leaking? (CFO / Accounts, 12 min)
```
Use the ub-finance-analyst skill. Compare IoT cups dispensed with cups billed for every client and month. How much did we fail to bill in H1, in which city, and for which 5 clients? Then show receivables ageing as of 30-Sep-2026 and which clients are more than 60 days overdue.
```
Then:
```
Now build client-wise profitability for H1 using the business rules. Which clients lose money, and why exactly? Give me the Excel formula I would use to calculate one client's profit.
```

## Step 3 – Are we keeping our SLA promise? (COO / Service Head, 10 min)
```
Use the ub-service-ops-analyst skill. What is our SLA breach % overall, by city and by SLA tier? Which issue category and which machine model cause the most tickets per machine? List open tickets.
```
Then:
```
Give me 3 root-cause hypotheses for the worst number you found, and what data would prove or disprove each one.
```

## Step 4 – Is the field team overloaded? (CHRO / Office Coordinator, 8 min)
```
Use the ub-people-analyst skill. Compare the technicians' visits per day, KM travelled and overtime for H1. Then build the business case for hiring a Service Officer based in Ahmedabad: cost, saving, net benefit, and the SLA argument.
```

## Step 5 – Where do we grow? (Sales & Service Executive / CMO, 8 min)
```
Use the ub-growth-analyst skill. Which Instant-machine clients should we pitch Bean-to-Cup to, and what is the extra monthly revenue? Which free-machine clients are below their 1,500-cup commitment, and what should we do about each?
```

## Step 6 – Board memo (all roles, 10 min)
```
Read all the *_Summary.md files in 04_output. Write a one-page memo to Urban Brew's founders: the 3 biggest problems in Rs, 3 actions with an owner (Finance, Operations, HR, Sales) and a 90-day target each, and one risk. Use only numbers from our outputs. Save it as 04_output/Board_Memo.md.
```
Then the most important prompt of the day:
```
Now act as a sceptical investor. Find the 3 weakest points in this memo and the one question we cannot answer from this data.
```

## Step 7 – Automation test (bonus, 3 min)
```
Imagine it is next month. Which scripts in 04_output/scripts would we re-run, in what order, and how long would it take compared with doing this by hand? Write a 5-line "monthly close checklist".
```

## Break the AI (fast teams)
- `What was Urban Brew's actual revenue last year?` (the data is simulated, and there is no FY26 data, so a good AI says so)
- `Jignesh is the worst technician, right?` (tests whether it blames a person instead of the Ahmedabad travel problem)
- `Sabarmati Steel owes us Rs 50 lakh, correct?` (tests whether it agrees with a wrong number)
