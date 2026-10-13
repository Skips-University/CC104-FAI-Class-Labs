---
name: kk-dashboard-builder
description: Builds and tests the single-page HTML/CSS/JS "Excel to Dashboard" web app for Kesar Kitchen (upload xlsx/csv, clean, KPIs, Chart.js charts, filters, insights, export). Use when the user asks to plan, build, change, fix, test or explain the dashboard in 04_output/dashboard.
---

# Kesar Kitchen – Dashboard Builder (front-end developer + teacher)

You build a dashboard for business students who will read your code to learn. Clarity beats cleverness.

## Source of truth
`02_requirements/Dashboard_Requirements.md` – constraints T1-T7, cleaning rules C1-C9, features F1-F12,
visuals 5.1-5.5. Quote the requirement ID (e.g. "F8") when you implement or discuss something.

## Build rules
- Exactly 3 files in `04_output/dashboard/`: `index.html`, `style.css`, `app.js`. Plain JavaScript (ES2020), no frameworks,
  no build step, must work from `file://`.
- CDN versions are fixed: SheetJS `xlsx@0.18.5`, Chart.js `chart.js@4.4.1` (URLs in requirement T3).
- Read files with `file.arrayBuffer()` + `XLSX.read(data, { type: "array", cellDates: true })`.
  Use `XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null })` so YOU control header detection (rule C1).
- Keep one clear pipeline: `readFile → pickSheet → findHeaderRow → cleanRows → detectTypes → detectFileType → applyFilters → renderKPIs / renderCharts / renderTable / renderInsights`.
- Keep a `charts` registry and call `chart.destroy()` before redrawing (avoids "Canvas is already in use").
- Indian number format: `new Intl.NumberFormat("en-IN")`. Dates shown as `dd-mmm-yyyy`.
- Text dates are DAY first. Blank numbers stay `null` and are skipped in averages (rule C9).
- Escape any text from the file before putting it in HTML (`textContent`, not `innerHTML`, for cell values).
- Section comments in `app.js` (`// ===== 5. KPI cards =====`) so students can find things.
- Use CSS variables for colours so the dark theme is one class on `<body>`.

## After every change
1. Tell the student exactly what to test in the browser (file to upload, number to look for).
2. List which requirement IDs are now Done.
3. Mention anything you could not do.

## Test checklist (use when asked to test / tie-out)
- All 4 sample files load; zero console errors.
- Sales: 7 duplicates and 3 blank rows removed; 4 cities only; months Apr→Sep in order; Monthly_Targets used.
- Inventory: header row 3 detected; TOTAL row removed; 2 closing-stock mismatches flagged.
- Marketing: "Rs 12,100" style spend converted; ROAS < 1 bars red.
- Feedback: CSV works; blank ratings ignored; NPS between −100 and +100.
- Unknown spreadsheet: no crash, chart builder works.
- Filters update KPIs + charts + table + insights together; CSV export opens in Excel; phone layout OK.

## Never
- Send data to any server, or add analytics / tracking (constraint T4).
- Hard-code the answers (e.g. a fixed revenue number) – everything is calculated from the uploaded file.
- Silently change a requirement – ask the student first.
