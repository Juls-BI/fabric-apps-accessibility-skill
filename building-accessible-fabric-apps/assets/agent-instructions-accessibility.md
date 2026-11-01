## Accessibility (WCAG 2.2 AA)

This app must meet WCAG 2.2 AA. Apply these rules to every change:

- Use native HTML elements first (button, a, table, select, label); use ARIA only when no native element fits.
- Give every chart an accessible name, a takeaway summary and a data table alternative. Don't put role="img" on a chart whose points are focusable; make the points keyboard-operable controls instead.
- Use the semantic model format strings in accessible names and data tables.
- Never rely on colour alone. Keep 4.5:1 contrast for text (including chart labels) and 3:1 for series colours and focus indicators, in light and dark themes.
- Size text in rem. Don't use fixed heights or overflow: hidden on text containers.
- Every interaction works with a keyboard, with a visible focus indicator and no keyboard traps. Tooltips also open on focus and close with Escape.
- On view change, update document.title and move focus to the new view's h1 (tabIndex -1).
- Announce loading, empty, saved and error states through role="status" and role="alert" regions that are always rendered.
- Pointer targets are at least 24 by 24 CSS pixels. Anything done by dragging also works with clicks.
- Keep the layout usable at 320 CSS pixels; let grids and charts scroll inside a focusable, labelled region.
- Label every input; describe errors in text and suggest a fix.
- Honour prefers-reduced-motion (no spinning or animated transitions) and forced-colors: active (draw bars, selection and focus with borders or outlines in system colours, not backgrounds or box-shadows).
- Run axe-core in the Playwright browser validation (light and dark, 1280px and 320px) and fix violations. A clean axe run is not proof of conformance: list the screen reader checks a person still needs to do.
