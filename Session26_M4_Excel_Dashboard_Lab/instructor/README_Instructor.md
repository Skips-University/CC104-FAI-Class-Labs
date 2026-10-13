# Instructor notes – Session 26 / M4 "Excel to Dashboard"

> **Remove this `instructor/` folder before sharing the lab with students** – it has the answers and a working solution.

## Contents
| File | Purpose |
|---|---|
| `Answer_Key.md` | Check totals for every KPI, planted data problems, hidden business stories, common student mistakes |
| `reference_dashboard/` | Working solution (`index.html`, `style.css`, `app.js`) – double-click `index.html` to demo |
| `generate_sample_data.py` | Recreates `01_sample_data/` (fixed seed → identical files) |
| `compute_answer_key.py` | Recomputes the check totals with pandas: `python instructor/compute_answer_key.py` |

The reference solution was verified against the answer key: Sales Rs 56,28,836 / 1,424 orders,
Inventory stock value Rs 18,71,287 / 12 low-stock SKUs, Marketing spend Rs 5,60,500 / ROAS 2.31x,
Feedback average rating 3.50 / NPS 1.2. It loads all 4 files with zero console errors.

## Running the session (~2 h)
1. **Hook (5 min):** show the raw Sales file in Excel (scroll to a "Rs 1,250" cell and a "Baroda" row), then demo the
   reference dashboard: upload → filter City = Surat → read the target insight. "In 2 hours you will build this."
2. **Steps 0–2 (25 min):** insist students finish the Excel check numbers before building. That is the
   "AI-assisted analysis in Excel" part of the module, and it gives them a way to test the app.
3. **Steps 3–9 (70 min):** walk around. Most teams get stuck at Step 5 (header row / TOTAL row) and Step 6
   (chart not destroyed → "Canvas is already in use"). Let them debug with a good bug-report prompt rather than
   fixing it for them.
4. **Step 10–11 (15 min):** 2–3 teams demo. Ask each: "Show me one number and prove it is right."

## Discussion questions
- The AI wrote code that runs without errors but gives a wrong total. How would you have noticed without Excel?
- Which is more dangerous: a crash or a wrong number? Why?
- Where should cleaning rules live: in Excel, in the app, or at the source system? Who owns them?
- Kesar Kitchen's export changes a column name next month (`Net_Amount` → `Net Amount`). What breaks? How would you design for that?

## If the AI tool is unavailable
Students can still do Steps 1–2 fully in Excel, then explore the reference dashboard and answer the discussion
questions using the Insights box.
