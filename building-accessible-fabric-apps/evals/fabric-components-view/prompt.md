---
tags: [skill-creator]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

I'm building a "Product performance" page in our Fabric App (Rayfin data app template). Please use Microsoft's components that come with the template: VegaVisual from @microsoft/fabric-visuals for the charts and DataGrid from @microsoft/fabric-datagrid for the table. I need a monthly units line chart, a bar chart of revenue by category where clicking a bar filters the grid, and a product grid with columns product_name, category, photo_url (show the photo as a thumbnail), units and rev_amt. Users want to rearrange the grid columns. Keep the charts clean and minimal, without the card frame around them. I don't have the scaffold open right now so just write standalone React + TypeScript files I can drop in later. Assume a useProductQuery(filters) hook that returns { table, status: 'loading' | 'success' | 'error', error }, where table is a DataTable.
