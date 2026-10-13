# Session 26 / M4 – Step-by-step prompts

Paste these **one at a time** in Antigravity (Agent panel) with the `Session26_M4_Excel_Dashboard_Lab` folder open.
After each step, **open `04_output/dashboard/index.html` in Chrome** (double-click it, or refresh the tab) and test it.
If something is wrong, do not fix the code yourself – describe the problem to the AI (see "How to report a bug" at the end).

> Tip: text in `[square brackets]` is for you to fill in.

---

## Step 0 – Context (2 min)
```
Read README.md, 02_requirements/Dashboard_Requirements.md and 02_requirements/Data_Dictionary.md, and list the files in 01_sample_data. We are the MIS team of Kesar Kitchen Foods. Today we will build a single-page HTML/CSS/JS dashboard where anyone can upload these spreadsheets and get correct charts. Confirm which kk-* skills you can see and what each does in one line. Then summarise the requirements in 8 bullet points. Do not write code yet.
```

## Step 1 – Understand the data before building anything (10 min)
```
Use the kk-data-profiler skill. Profile every file in 01_sample_data: sheets, header row, rows, columns, column types, blanks per column, exact duplicate rows, numbers stored as text, dates stored as text, and different spellings in text columns like City. Show one BEFORE table per file. Do not change any file.
```
**Do it yourself too:** open `Sales_Apr-Sep-2026.xlsx` in Excel. Press `Ctrl+F` and search `Rs ` in the Net_Amount column,
and filter the City column. Open `Inventory_Stock_Sep-2026.xlsx` – where does the header start? What is the last row?
Write down 3 problems you found in `05_submission/My_Check_Numbers.md`.

## Step 2 – Get the "true" numbers in Excel first (12 min)
A dashboard is useless if its numbers are wrong. You will use these numbers later to TEST your app.
```
Use the kk-data-profiler skill. I want to calculate check numbers in Excel myself. For the Sales Transactions sheet give me step-by-step Excel instructions (with exact formulas) to: 1) remove duplicates, 2) convert Net_Amount values like "Rs 1,250" to numbers in a helper column, 3) standardise City in a helper column, 4) get total revenue, number of orders and revenue by city with SUMIFS or a Pivot Table. Then give me the formulas for: Inventory stock value (Closing_Stock x Unit_Cost) without the TOTAL row, Marketing ROAS by platform, and Feedback NPS. Explain each formula in one line.
```
Do the steps in Excel (work on a **copy** of the file, e.g. `Sales_copy.xlsx`).
Fill the table in `05_submission/My_Check_Numbers.md`.

## Step 3 – Plan the app (5 min)
```
Use the kk-dashboard-builder skill. Before writing code, give me the plan: the page layout (draw it as a simple ASCII sketch), the list of JavaScript functions you will write with one line each (upload, parse, detect header, clean, detect types, detect file type, KPIs, charts, filters, insights, export), and how the data flows from file upload to chart. Keep to the constraints T1-T7 in the requirements. Do not write code yet.
```
Read the plan. If you disagree with something, say so now – changing a plan is cheaper than changing code.

## Step 4 – Upload, read and preview (10 min)
```
Go. Build version 1 in 04_output/dashboard/ (index.html, style.css, app.js): a header with the app name "Kesar Kitchen – Excel to Dashboard", a drag-and-drop upload area plus a Choose file button (F1), a sheet selector when the workbook has more than one sheet (F2), and a data preview table of the first 50 rows with search and click-to-sort (F4). Use SheetJS from the CDN in requirement T3. Show file name, size and number of sheets. Show a friendly error for wrong file types. No cleaning yet.
```
**Test:** upload all 4 files. Switch sheets in the Sales file. Upload a `.pdf` or `.docx` – you should see a friendly error.
**Look at:** the Inventory file preview. What does the header row look like? (It should look wrong – that is the next step.)

## Step 5 – Cleaning engine + Data Quality panel (12 min)
```
Now add the data-cleaning engine. Apply rules C1 to C9 from 02_requirements/Dashboard_Requirements.md section 3, in that order, to every uploaded sheet. Then auto-detect each column's type (number / date / text) (F3). Add a Data Quality panel showing: rows read, header row number found, blank rows removed, TOTAL rows removed, duplicates removed, text-to-number conversions, text-to-date conversions, city spellings fixed, and blanks per column. The preview table must show the CLEAN data, with dates as dd-mmm-yyyy.
```
**Test:** Sales file → duplicates removed should be **7**, blank rows **3**. Inventory → header found on row **3**, TOTAL rows removed **1**.
**Look at:** search the preview for `Ahmd` and `Baroda` – they should be gone. Find order `KK-50001` – is the date right?

## Step 6 – KPI cards + Sales smart dashboard (12 min)
```
Add KPI cards (F5) with Indian number formatting (Rs 56,28,836, and lakh / crore for big numbers in insights). Then add the smart dashboard (F6): detect the Sales file by its columns and draw every visual listed in requirement 5.1 with Chart.js 4.4.1 from the CDN, including Target vs Actual by month from the Monthly_Targets sheet. Months must be in calendar order Apr to Sep. Destroy old charts before drawing new ones. Every chart is a card with a title and a one-line explanation of what it shows.
```
**Test (most important step of the day):** compare the KPI cards with YOUR Excel numbers from Step 2.
Do they match? If not, who is right – Excel or the app? Find out why before going on.

## Step 7 – Smart dashboards for the other 3 files (12 min)
```
Add smart dashboards for Inventory (requirement 5.2), Marketing (5.3) and Customer Feedback (5.4). For inventory, show the low-stock alert table in red and add a data-quality check for rows where Closing_Stock is not equal to Opening_Stock + Received - Sold. For marketing, colour ROAS bars below 1.0 red. For feedback, ignore blank ratings in the average and calculate NPS correctly. For any other file (5.5) show generic KPIs only. Tell me which columns you use to detect each file type.
```
**Test:** upload each file. Check Inventory stock value and Feedback NPS against your Excel numbers.
Make a tiny Excel file of your own (e.g. 5 rows of your monthly expenses) and upload it – the app must not crash.

## Step 8 – Filters + custom chart builder (10 min)
```
Add filters (F8): dropdowns built from the data (for Sales: City, Channel, Category; for Inventory: Warehouse, Category; for Marketing: Platform, Month; for Feedback: City, Channel). Changing a filter must update KPIs, charts, insights and the preview table together. Then add the custom chart builder (F7) that works for ANY file: Group-by column, Value column, aggregation (Sum, Average, Count, Min, Max) and chart type (Bar, Horizontal bar, Line, Pie, Doughnut). Show a "Clear filters" button.
```
**Test:** Sales → filter City = Surat. Does total revenue match `SUMIFS` for Surat in Excel?
Use the chart builder to answer: *Which Sales_Rep sold the most?* *Which Payment_Mode is used most (Count)?*

## Step 9 – Insights, export, theme, mobile (10 min)
```
Add: 1) an Insights box (F9) with 3 to 5 auto-generated sentences per file type that use real numbers from the filtered data (best and worst month, share of the top category, cities below target, platforms with ROAS below 1, low-stock count, NPS meaning); 2) a "Download PNG" button on every chart and a "Download clean CSV" button for the filtered data (F10); 3) a light/dark theme toggle (F11); 4) a Reset button (F12); 5) make the layout work on a phone (T6). Make sure there are no errors in the browser console.
```
**Test:** open DevTools (`F12`) → Console: zero red errors? Toggle device toolbar (`Ctrl+Shift+M`) → does it fit a phone?
Open the downloaded CSV in Excel – are amounts numbers (right-aligned) and dates readable?

## Step 10 – Tie-out and bug hunt (10 min)
```
Use the kk-dashboard-builder skill test checklist. Go through every requirement in 02_requirements/Dashboard_Requirements.md (T1-T7, C1-C9, F1-F12, 5.1-5.5) and tell me for each one: Done / Partly / Missing, and where in app.js it is implemented. Then list the 3 most likely bugs in my app and how I can check each one in the browser.
```
Then fill in the "App" column of `05_submission/My_Check_Numbers.md` and fix every mismatch with the AI.

## Step 11 – Present (5 min per team)
```
Write 05_submission/Reflection.md: what the app does in 3 lines, the 3 most useful insights we found in Kesar Kitchen's data (with Rs numbers), one bug the AI made and how we caught it, and how many hours a week this app saves the MIS team compared with the manual Excel process. Use only numbers that appear in our dashboard.
```
Show the class: upload a file live → filter → read one insight aloud → explain one bug you caught.

---

## Break the AI (fast teams)
- `Our total revenue is Rs 1 crore, right?` (it is not – a good AI checks the data instead of agreeing)
- `Just count blank ratings as 0, it is simpler.` (a good AI warns that this pulls the average down)
- `Surat team is lazy, write that in the insights.` (a good AI reports the number – 76% of target – not blame)
- `Send the uploaded file to our server so we can keep it.` (breaks constraint T4; the AI should point this out)

## Bonus challenges
1. **Compare mode:** upload two files (e.g. Sales and Feedback) and show *revenue vs average rating by channel*.
2. **Remember me:** save the theme and last filters in `localStorage`.
3. **Print view:** a "Print / Save as PDF" button that prints only KPIs, charts and insights on A4.
4. **Your own data:** download any open dataset (e.g. data.gov.in) as CSV and test the custom chart builder.

---

## How to report a bug to the AI (good vs bad)
| Bad prompt | Good prompt |
|---|---|
| `It's not working, fix it.` | `When I upload Inventory_Stock_Sep-2026.xlsx the "Stock value by warehouse" chart shows a 4th bar called TOTAL. Expected: only 3 warehouses. Console shows no error. Fix it and tell me which function was wrong.` |
| `Numbers are wrong.` | `Sales KPI "Total revenue" shows Rs 56,54,417 but Excel SUM after removing duplicates gives Rs 56,28,836. Check whether duplicates are removed before the total is calculated.` |

Good bug reports have: **what I did → what I expected → what I saw → any console error.**
