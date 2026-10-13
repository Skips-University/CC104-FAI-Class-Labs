# Session 26 / M4 – AI-Assisted Data Analysis Using Excel and Spreadsheets
## Lab: "Excel to Dashboard" – build a web app that turns any spreadsheet into charts

**Company (fictional):** Kesar Kitchen Foods, Vadodara – Gujarati namkeen, sweets, ready-to-eat mixes, spices
and beverages sold in Vadodara, Ahmedabad, Surat and Rajkot through stores, distributors, Amazon, its own
website and quick-commerce apps.

> IMPORTANT: Kesar Kitchen Foods is a made-up company. All data in this folder is SIMULATED for teaching.

---

## The story
Every Monday, Kesar Kitchen's MIS executive downloads 4 spreadsheets (sales, stock, marketing, customer feedback),
cleans them by hand and builds pivot charts for the founders. It takes **6 hours a week** and breaks every time
the export changes.

Today **you** are the MIS team. Using an AI coding assistant you will:
1. **Understand** the messy spreadsheets with AI (profiling).
2. **Calculate the true numbers in Excel** with AI's help (SUMIFS, pivots, NPS, ROAS) – your answer key.
3. **Build a single-page web app (HTML + CSS + JavaScript)** – upload an Excel/CSV file and instantly get a clean,
   filtered, interactive dashboard with KPIs, charts and insights.
4. **Test the app against your Excel numbers** and catch the AI's mistakes.

You will **not** write code by hand. You will write **prompts**, **test**, and **check numbers**. That is the skill.

## Learning outcomes
By the end of the lab you can:
- Profile a spreadsheet and name its data-quality problems (duplicates, text-numbers, title rows, spelling variants).
- Use AI to write and explain Excel formulas (SUMIFS, COUNTIFS, XLOOKUP, IFERROR, pivot tables).
- Turn a business requirement into a step-by-step build plan for an AI assistant.
- Verify AI-generated output against an independent calculation ("tie-out").
- Write a precise bug report that an AI can act on.

---

## Folder map
```
Session26_M4_Excel_Dashboard_Lab/
├── README.md                     <- you are here
├── .agent/skills/                <- 2 AI skills (auto-loaded by Antigravity for this workspace)
│   ├── kk-data-profiler/           profiles the files + teaches Excel formulas
│   └── kk-dashboard-builder/       builds and tests the web app
├── 01_sample_data/               <- INPUT: 4 messy sample files (do not edit!)
│   ├── Sales_Apr-Sep-2026.xlsx       2 sheets: Transactions, Monthly_Targets
│   ├── Inventory_Stock_Sep-2026.xlsx title row on top, TOTAL row at the bottom
│   ├── Marketing_Campaigns_H1.xlsx   6 platforms x 6 months
│   └── Customer_Feedback_H1.csv      ratings + NPS (a CSV, not Excel)
├── 02_requirements/
│   ├── Dashboard_Requirements.md   <- WHAT the app must do (IDs T1-T7, C1-C9, F1-F12, 5.1-5.5)
│   └── Data_Dictionary.md          <- what every column means
├── 03_prompts/
│   └── Prompts_Step_by_Step.md     <- the prompts you paste, Step 0 to Step 11
├── 04_output/dashboard/          <- the AI creates index.html, style.css, app.js here
└── 05_submission/
    ├── My_Check_Numbers.md         <- your Excel numbers vs the app's numbers
    └── Submission_Checklist.md     <- what to submit + how you are graded
```

## Setup (5 minutes)
1. Copy the whole `Session26_M4_Excel_Dashboard_Lab` folder to your laptop, e.g. `D:\Session26_M4_Excel_Dashboard_Lab`
   (keep the `.agent` folder – it may be hidden).
2. Open **Antigravity** → **Open Folder** → select `Session26_M4_Excel_Dashboard_Lab`.
3. In the Agent panel type: `Which skills can you see in this workspace?` – you should see `kk-data-profiler` and
   `kk-dashboard-builder`. If not, check the path is `.agent/skills/<skill-name>/SKILL.md`.
4. You need: **Chrome or Edge**, **Excel** (or Google Sheets / LibreOffice Calc), and internet (the app loads
   two libraries from a CDN). Python is only needed for Step 1 profiling – if it is missing, ask the agent to
   install `pandas` and `openpyxl`, or pair with a classmate.
5. Read `02_requirements/Dashboard_Requirements.md` (5 min). Then open `03_prompts/Prompts_Step_by_Step.md`
   and start at **Step 0**.

> Using a different AI tool (Claude Code, Cursor, Copilot, ChatGPT)? The lab still works: paste the content of the
> two `SKILL.md` files into the chat first, then use the same prompts.

## Timeline (~2 hours)
| Step | What | Time |
|---|---|---|
| 0 | Give the AI the context | 2 min |
| 1 | Profile the messy data | 10 min |
| 2 | Calculate check numbers in Excel (with AI formulas) | 12 min |
| 3 | Plan the app (no code yet) | 5 min |
| 4 | Upload + preview | 10 min |
| 5 | Cleaning engine + Data Quality panel | 12 min |
| 6 | KPIs + Sales dashboard → **tie-out vs Excel** | 12 min |
| 7 | Inventory, Marketing, Feedback dashboards | 12 min |
| 8 | Filters + custom chart builder | 10 min |
| 9 | Insights, export, dark mode, mobile | 10 min |
| 10 | Requirement check + bug hunt | 10 min |
| 11 | Reflection + 3-minute demo | 5 min |

## How to run your app
Double-click `04_output/dashboard/index.html` – it opens in your browser. After each AI change, press `Ctrl+F5`
to refresh. Press `F12` → **Console** to see errors (copy-paste red errors to the AI).

## The 3 habits for this lab
1. **Test after every step.** Upload all 4 files, not just one.
2. **Numbers first, beauty later.** A beautiful chart with a wrong total is worse than no chart.
   If the app and Excel disagree, find out *why* before moving on.
3. **Prompt like a manager.** Say what you did, what you expected, what you saw (see the bug-report table at the
   end of the prompts file).

## What to submit
See `05_submission/Submission_Checklist.md`. In short: the `04_output/dashboard/` folder,
`My_Check_Numbers.md`, `Reflection.md` and 3 screenshots.
