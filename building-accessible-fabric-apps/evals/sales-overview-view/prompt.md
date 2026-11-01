---
tags: [skill-creator]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

I'm building a Fabric App with the Rayfin data app template over our Sales semantic model. Can you write the main "Sales overview" view: three KPI cards (Revenue, Orders, Margin %), a monthly revenue line chart, a bar chart of sales by region that cross-highlights the other visuals when you click a bar, a date range filter, and a detail data grid with sortable columns. I don't have the scaffold open right now so just write standalone React + TypeScript files (and CSS) I can drop in later. Assume a useSalesQuery(filters) hook that returns { rows, status: 'loading' | 'success' | 'error', error } and a formatValue(value, formatString) helper.
