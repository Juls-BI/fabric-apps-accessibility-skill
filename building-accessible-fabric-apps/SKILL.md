---
name: building-accessible-fabric-apps
description: Default way to write UI code for Microsoft Fabric Apps - Rayfin SDK projects, the data app (dataapp) template and their React/TypeScript front ends over semantic models. Builds every view, chart, KPI card, filter, slicer, data grid, dialog and cross-highlighting interaction accessible by default (WCAG 2.2 AA keyboard and focus, screen reader names, status announcements, contrast in light and dark themes, text resizing, reflow, reduced motion, high contrast), adds axe-core checks to the template's Playwright browser validation, and writes accessibility rules into copilot-instructions.md. Use it for any front-end or UI change in a Fabric App or Rayfin project (signs - rayfin.yml, @microsoft/rayfin or @microsoft/fabric-visuals packages, the dataapp template), even when the request never mentions accessibility, and for accessibility audits of such apps. Not for backend-only Rayfin configuration or deployment, or React Native.
---

# Building accessible Fabric Apps

A Fabric App is a standard web application. Apply the rules below while you generate code, not as a clean-up pass afterwards, because retrofitting focus order, live regions and accessible names into finished components is much harder than building them in.

## Workflow

Copy this checklist and work through it:

```
Accessibility progress:
- [ ] 1. Inspect the project
- [ ] 2. Build with the rules below
- [ ] 3. Run automated checks
- [ ] 4. Run the keyboard and zoom checks
- [ ] 5. Report findings mapped to WCAG criteria
```

### 1. Inspect the project

Before editing, find out what the template already gives you, because its components decide how much you need to add:

- Read the repository's agent instructions and skills (for example `copilot-instructions.md`). If there is no accessibility section, offer to add the one in [assets/agent-instructions-accessibility.md](assets/agent-instructions-accessibility.md) so every later agent session gets the same rules.
- Identify the chart library behind the visual primitives and check its accessibility support. Don't assume it is accessible by default. If the project uses Microsoft's Fabric visual components (`@microsoft/fabric-visuals`, `@microsoft/fabric-datagrid`), read [references/fabric-components.md](references/fabric-components.md) first: they have keyboard navigation and a table view built in, and the rules there take precedence over the generic chart patterns.
- Find the data grid, the cell renderers, the central theme or style file, and the existing browser-validation workflow (the data app template ships a Playwright-based one).

### 2. Build with the rules

Follow the rules in the next section. For code patterns (chart alternatives, live regions, focus on view change, grid semantics, CSS for text and focus), read [references/patterns.md](references/patterns.md).

### 3. Run automated checks

Add axe-core to the template's existing Playwright validation rather than creating a separate tool, so the checks run wherever the template's checks already run. See "Automated checks" in [references/patterns.md](references/patterns.md). Run it in light and dark themes, at desktop width and at 320 CSS pixels. Fix violations and rerun until clean.

Automated tools find only part of the problems. A clean axe run is not a statement of WCAG conformance, so never describe it as one.

### 4. Run the keyboard and zoom checks

Script or perform these, and state clearly which ones a person still has to do with a screen reader:

1. Keyboard access to every interactive chart, filter and grid, with no keyboard trap.
2. Focus moves to the new view's heading after a view change, and the page title updates.
3. Loading, empty, saved and error states are announced.
4. Contrast in both light and dark themes, plus forced-colors and reduced-motion modes.
5. Reflow at 320 CSS pixels (two-dimensional content excepted), text resized to 200 per cent, and the WCAG text-spacing values applied.

### 5. Report

Use [references/wcag-checklist.md](references/wcag-checklist.md) to map each finding to its success criterion. Report in this format:

```markdown
## Accessibility results
**Automated (axe-core):** <n> violations fixed, <n> remaining
**Fixed:** <criterion number and name> - <what changed, file>
**Remaining:** <criterion> - <issue> - <suggested fix>
**Needs manual testing:** <screen reader (NVDA/JAWS/Narrator) checks a person must run>
```

## Rules

### Structure and controls

- Use native HTML first: `<button>`, `<a href>`, `<table>`, `<select>`, `<input>` with `<label>`. Native elements bring keyboard support, roles and states for free; ARIA is for when no native element fits.
- Every custom control exposes its name, role, state and value (4.1.2). Cross-highlighting selections use `aria-pressed` or `aria-selected`; expanders use `aria-expanded`.
- An image inside a control that already has an accessible name (a thumbnail button, an icon button) gets `alt=""`, so the name isn't read twice. Standalone images get meaningful alt text.
- Give the app one `<main>`, a logical heading hierarchy, and DOM order that matches visual order, because the DOM order is the reading and tab order.

### Charts and visuals

- Every chart has an accessible name and a text alternative (1.1.1). For a static chart: `role="img"` with an `aria-label` that states the title and the key takeaway, plus a data table alternative the user can open.
- `role="img"` hides everything inside it from assistive technology. If points inside a chart are focusable (cross-highlighting, drill-down), do not put `role="img"` on the container; use a labelled `role="group"` and give each focusable point an accessible name with its category and formatted value.
- Reuse the semantic model's format strings in accessible names and tables, so a screen reader hears "$1,500.50", not "1500.5".
- Don't rely on colour alone to distinguish series or states (1.4.1). Add direct labels, markers or patterns, and keep the legend text.
- Series colours, chart gridlines that carry meaning, focus indicators and input borders need 3:1 against adjacent colours (1.4.11). Check both themes; a palette that passes in light often fails in dark.
- For `VegaVisual` charts and `DataGrid`, follow [references/fabric-components.md](references/fabric-components.md) instead of the two `role="img"` and `role="group"` rules above: always give them a `header` title with the takeaway in the subtitle, keep their frame (restyle it with `containerClassName` if the user wants a plain look, rather than using `chromeless`), and don't wrap them or add your own keyboard handling.

### Text

- Body text and labels need 4.5:1 contrast; large text (at least 18pt, or 14pt bold) needs 3:1 (1.4.3). Small axis labels and legends count as normal text.
- Size text in `rem`, not `px`, so it follows the reader's browser font-size setting as well as zoom (1.4.4).
- Don't give text containers fixed heights or clip text with `overflow: hidden`. Data grid rows, KPI cards, tooltips and axis labels must survive the text-spacing overrides in 1.4.12 without losing content.
- If an SVG chart scales with its container, make sure its labels don't shrink below a readable size at narrow widths.

### Keyboard and focus

- Everything that works with a mouse works with a keyboard (2.1.1), with no keyboard trap (2.1.2).
- Keep a visible focus indicator (2.4.7). Never remove `outline` without a replacement; style `:focus-visible` with at least 3:1 contrast.
- Sticky headers, filter panes and toolbars must not completely hide the focused element (2.4.11). Use `scroll-padding-top` equal to the sticky header height.
- Tooltips and hover cards also appear on focus, can be dismissed with Escape, and stay open while the pointer is over them (1.4.13).
- Dialogs and the grid's image lightbox move focus inside when opened, close with Escape, and return focus to the control that opened them.
- On a view change in the single-page app, update `document.title` (2.4.2) and move focus to the new view's main heading.

### Pointer

- Pointer targets are at least 24 by 24 CSS pixels, or have enough spacing around them (2.5.8). Dense grids, chart markers, legend toggles and icon buttons are the usual failures.
- Anything done by dragging (reordering, resizing, range sliders) also works with single clicks or buttons (2.5.7).

### Status messages

- Loading, empty results, saved changes and errors are announced without moving focus (4.1.3). Use `role="status"` for loading, empty and saved; use `role="alert"` for errors that need attention now.
- The live region must already be in the DOM before its content changes. Inserting a new element that contains the message is often not announced.

### Layout and reflow

- Content works at 320 CSS pixels wide without two-dimensional scrolling (1.4.10). Data tables, grids and charts are exempt because they need a two-dimensional layout, but navigation, filters, cards and text are not.
- Give exempt content its own scrolling region. A scrollable region needs `tabindex="0"`, a role and an accessible name, so keyboard users can scroll it.

### Motion and display modes

These go beyond AA, but each costs one media query and protects people who can't use the app without them.

- Respect `prefers-reduced-motion`: replace spinners, chart transitions and animated highlights with a static indicator. Motion can make people with vestibular disorders unwell (2.3.3 is AAA).
- Support Windows High Contrast with `@media (forced-colors: active)`. Forced colours remove backgrounds and box-shadows, so bars drawn with `background` vanish and selection shown by shadow disappears. Draw bars with borders or SVG fills using system colours (`CanvasText`, `Highlight`, `ButtonText`), and show focus and selection with `outline` or `border`.

### Forms and writing data

- Fabric Apps can write data. Every input has a visible label (3.3.2). Errors are identified in text and linked with `aria-describedby` and `aria-invalid` (3.3.1), with a suggested correction where possible (3.3.3).
- Don't ask for information the user already entered in the same process (3.3.7).

### Authentication

Keep the template's Fabric SSO sign-in; don't build a separate sign-in flow. If you add any extra verification step, it must not depend on a cognitive function test such as remembering or transcribing a code unless copy and paste or a password manager can complete it (3.3.8).
