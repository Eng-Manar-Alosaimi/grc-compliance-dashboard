# SAMA GRC Compliance Analytics Dashboard

React 18 + TypeScript dashboard for SAMA Key Principles of Governance assessments.

## Run

```bash
bun install
bun run dev
```

Then open the URL Vite prints (typically http://localhost:5173).

- `/` — PDF intake, framework selector, **Run Assessment** (`POST http://localhost:8000/assess`), and **Load Demo Data (Q1, Q2, Q3)**
- `/dashboard` — KPIs, trends, category comparison, status donut, high-risk gaps, traceability

Production build:

```bash
bun run build
bun run preview
```

## Data

Quarterly packs live in `src/data/q1.json`, `q2.json`, and `q3.json`. Replace those files with your assessment output; the UI reads `raw_assessments` and `analytics` only from those documents (missing `status_distribution` keys are treated as 0).
