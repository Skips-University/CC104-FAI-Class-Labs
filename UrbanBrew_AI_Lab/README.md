# Urban Brew AI Lab – AI-Assisted Data Analysis (Finance / Operations)

**Company:** Urban Brew (Urban Beverages), Vadodara, Gujarat – https://urbanbrew.in
Workplace beverage solutions: bean-to-cup and instant coffee machines, snack & beverage vending, refill
subscriptions and SLA-backed service in Vadodara & Ahmedabad.

> IMPORTANT: The company is real. The DATA in this folder is SIMULATED for teaching, modelled on its public
> business model. It is not Urban Brew's actual data, clients or employees. Do not contact the company about it.

## Folder map
```
UrbanBrew_AI_Lab/
├── .agent/skills/            <- 5 AI skills (already installed for this workspace)
│   ├── ub-data-cleaner/        MIS / Chief Data Officer
│   ├── ub-finance-analyst/     CFO / Accounts
│   ├── ub-service-ops-analyst/ COO / Service Head
│   ├── ub-people-analyst/      CHRO / Office Coordinator
│   └── ub-growth-analyst/      Sales & Service Executive / CMO
├── 01_input_data_raw/        <- BEFORE: messy exports, exactly as teams get them (do not edit)
├── 02_business_rules/        <- rates, costs, SLA hours the AI must use
├── 03_prompts/               <- step-by-step prompts to paste
└── 04_output/                <- AFTER: everything the AI creates lands here
```

## Setup (5 minutes)
1. Copy this whole `UrbanBrew_AI_Lab` folder to your laptop, e.g. `D:\UrbanBrew_AI_Lab` (keep the `.agent` folder; it is hidden on some systems).
2. Open Antigravity → **Open Folder** → select `UrbanBrew_AI_Lab`.
3. Check Python: in the Antigravity terminal type `python --version`. If it is missing, ask the agent:
   "Install Python and pandas + openpyxl for this workspace", or work in pairs with someone who has it.
4. In the Agent panel type: `Which skills can you see in this workspace?` You should see the 5 `ub-*` skills.
   If not, check the folder name is `.agent/skills/<skill-name>/SKILL.md`.
5. Open `03_prompts/Prompts_Step_by_Step.md` and start at Step 0.

## The before / after habit
After every step, open the raw file and the output file side by side and answer:
1. What changed? 2. How long would this take by hand? 3. Would I sign this number? How did I check it?
