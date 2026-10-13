# Submission Checklist & Rubric

## Submit (zip the folder or push to your repo)
- [ ] `04_output/dashboard/index.html`, `style.css`, `app.js`
- [ ] `05_submission/My_Check_Numbers.md` – all 11 rows filled, Excel AND App columns
- [ ] `05_submission/Reflection.md` (Step 11)
- [ ] 3 screenshots in `05_submission/`: `sales.png` (with a filter applied), `inventory.png`
      (low-stock table visible), `phone.png` (mobile view)
- [ ] `05_submission/Prompt_Log.md` – copy the prompts you actually used, including your bug-fix prompts

## Self-test before you submit
- [ ] All 4 sample files load, zero red errors in the Console
- [ ] Ahmedabad is one city (not 3); Inventory has no "TOTAL" bar
- [ ] Sales KPIs = your Excel numbers
- [ ] Filters change KPIs, charts, insights and the table together
- [ ] A spreadsheet the app has never seen (your own) loads without crashing
- [ ] Downloaded CSV opens in Excel with numbers as numbers
- [ ] Works on a phone-sized screen

## Rubric (50 marks)
| Area | Marks | Full marks when… |
|---|---|---|
| Data understanding (Step 1–2) | 8 | ≥ 3 real data problems named; Excel formulas used and explained |
| Correct numbers (tie-out) | 12 | All 11 checks match, or every mismatch is explained and fixed |
| Cleaning + Data Quality panel (C1–C9) | 8 | All rules work; panel shows counts |
| Smart dashboards (5.1–5.4) | 10 | All required visuals present, titled, readable |
| Features (filters, builder, insights, export, theme, mobile) | 7 | F7–F12 work |
| Prompting & reflection | 5 | Prompt log shows clear, specific prompts and at least one good bug report; honest reflection |

**Automatic deductions:** hard-coded numbers in `app.js` (−10), data sent to an external server (−10),
app only works for one file (−5).
