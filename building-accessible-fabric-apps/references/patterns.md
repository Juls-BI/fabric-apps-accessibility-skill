# Accessibility code patterns for Fabric Apps

React and TypeScript patterns for the rules in SKILL.md. Adapt names to the project's own components; keep the accessibility parts intact.

## Contents
- Static chart with a text alternative
- Interactive chart points (cross-highlighting)
- Status messages
- View changes: page title and focus
- Data grids
- Scrollable regions for two-dimensional content
- CSS: text, focus, sticky headers
- CSS: reduced motion and forced colors
- Automated checks (axe-core in Playwright)
- Keyboard, zoom and text-spacing checks

## Static chart with a text alternative

```tsx
<figure>
  <div role="img" aria-label={`${title}. ${summary}`}>
    <RevenueChart data={rows} />
  </div>
  <figcaption>{title}</figcaption>
  <details>
    <summary>Show data for {title}</summary>
    <table>
      <caption>{title}</caption>
      <thead>
        <tr><th scope="col">Month</th><th scope="col">Revenue</th></tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.month}><th scope="row">{r.month}</th><td>{formatValue(r.revenue, revenueFormat)}</td></tr>
        ))}
      </tbody>
    </table>
  </details>
</figure>
```

Write `summary` as the takeaway a sighted reader gets at a glance ("Highest in November at $1.2M, down 8% on last year"), built from the query result, not hard-coded. Format values with the same semantic model format string the chart uses.

## Interactive chart points (cross-highlighting)

`role="img"` would hide focusable points, so use a labelled group and make each point a control:

```tsx
<g role="group" aria-label={`${title}. Select a bar to filter the other visuals.`}>
  {rows.map((r, i) => (
    <rect
      key={r.region}
      role="button"
      tabIndex={i === activeIndex ? 0 : -1}
      aria-pressed={selected === r.region}
      aria-label={`${r.region}: ${formatValue(r.sales, salesFormat)}`}
      onClick={() => toggle(r.region)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(r.region); }
        if (e.key === 'ArrowRight') setActiveIndex(Math.min(i + 1, rows.length - 1));
        if (e.key === 'ArrowLeft') setActiveIndex(Math.max(i - 1, 0));
      }}
      {...barGeometry(r)}
    />
  ))}
</g>
```

This is a roving tabindex: the chart is one tab stop and arrow keys move between points, so a chart with 50 bars doesn't add 50 tab stops. Move DOM focus to the newly active point when `activeIndex` changes. Still offer the data table alternative.

## Status messages

Render the regions once, empty, and change only their text:

```tsx
export function StatusRegions({ status, error }: { status: string; error: string }) {
  return (
    <>
      <div role="status" className="visually-hidden">{status}</div>
      <div role="alert" className="visually-hidden">{error}</div>
    </>
  );
}
```

Set `status` to messages such as "Loading sales data", "No results for the selected filters" and "Changes saved", and `error` to the user-facing error text. Keep the visible loading, empty and error states too; the regions add the announcement.

## View changes: page title and focus

```tsx
function useViewChange(viewTitle: string, appName: string) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    document.title = `${viewTitle} - ${appName}`;
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus();
  }, [viewTitle, appName]);
  return headingRef;
}

// in the view
const headingRef = useViewChange('Sales by region', 'Sales insights');
<h1 ref={headingRef} tabIndex={-1}>Sales by region</h1>
```

Skipping the first render avoids stealing focus on initial load. Deployed apps open inside the Fabric portal, so also check what the portal shows as the page title.

## Data grids

- **Read-only grid:** use a native `<table>` with `<caption>`, `<th scope="col">` and, where a column identifies the row, `<th scope="row">`. Put the sort control as a `<button>` inside the header cell and set `aria-sort="ascending" | "descending" | "none"` on the `<th>`.
- **Interactive grid** (cell editing, cell-level selection): use `role="grid"` and follow the WAI-ARIA Authoring Practices grid pattern (https://www.w3.org/WAI/ARIA/apg/patterns/grid/): one tab stop, arrow keys between cells, Enter or F2 to edit.
- **Custom cell renderers:** data bars need the value as text (visible or visually hidden); boolean icons need a text equivalent ("Yes"/"No"), not just an icon; image cells need `alt`; the image lightbox is a modal dialog (`role="dialog"`, `aria-modal="true"`, labelled, Escape closes, focus returns to the cell).

## Scrollable regions for two-dimensional content

```tsx
<div role="region" aria-label="Sales detail table" tabIndex={0} className="scroll-x">
  <SalesGrid />
</div>
```

The region is exempt from reflow but must be reachable and scrollable by keyboard.

## CSS: text, focus, sticky headers

```css
body { font-size: 1rem; line-height: 1.5; }

:focus-visible {
  outline: 3px solid var(--focus-ring); /* at least 3:1 against both themes' backgrounds */
  outline-offset: 2px;
}

html { scroll-padding-top: var(--sticky-header-height); } /* keeps focused items out from under sticky headers */

.grid-cell, .kpi-card, .tooltip { height: auto; min-height: 2.5rem; overflow: visible; white-space: normal; }

.scroll-x { overflow-x: auto; }

.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
```

Define focus, text and series colours in the template's central theme so they apply to every component, and give each one a value per theme.

## CSS: reduced motion and forced colors

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .spinner { animation: none; border-top-color: currentColor; } /* static ring; the status region still says "Loading" */
}

@media (forced-colors: active) {
  .bar { background: none; border: 2px solid CanvasText; }   /* HTML bars: backgrounds are removed in this mode */
  .bar[aria-pressed="true"] { background: Highlight; border-color: Highlight; forced-color-adjust: none; }
  svg .series { fill: CanvasText; stroke: CanvasText; }       /* SVG fills are not forced, so set them explicitly */
  svg .series.selected { fill: Highlight; stroke: Highlight; }
  :focus-visible { outline: 3px solid Highlight; }
}
```

Selection and focus shown only by `box-shadow` or background colour disappear in forced-colors mode, so always pair them with `outline` or `border`.

## Automated checks (axe-core in Playwright)

Install `@axe-core/playwright` as a dev dependency, then add a test beside the template's existing browser-validation tests:

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [1280, 320]) {
    test(`axe ${colorScheme} ${width}px`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      // wait until visuals have finished loading before scanning, using the template's own readiness signal
      const results = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
```

If the template switches theme with its own setting instead of `prefers-color-scheme`, set that instead of `emulateMedia`. Run the scan in each view, not just the first one.

For the display modes, take screenshots with `await page.emulateMedia({ forcedColors: 'active' })` and `await page.emulateMedia({ reducedMotion: 'reduce' })`, and check that bars, selection and focus are still visible and that nothing animates.

## Keyboard, zoom and text-spacing checks

**Tab order:** list what receives focus and compare it with the visual order:

```ts
const order: string[] = [];
for (let i = 0; i < 60; i++) {
  await page.keyboard.press('Tab');
  order.push(await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? `${el.tagName} ${el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 40)}` : 'none';
  }));
}
console.log(order.join('\n'));
```

Then assert specific behaviour, for example `await expect(page.getByRole('button', { name: /North/ })).toBeFocused()` after arrowing through a chart, and that Escape closes the lightbox and returns focus.

**Text at 200 per cent** (works because text is sized in rem):

```ts
await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
```

**Text spacing** (the WCAG 1.4.12 values):

```ts
await page.addStyleTag({ content: `
  * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
  p { margin-bottom: 2em !important; }
` });
```

After each override, take screenshots and check for clipped or overlapping text in grids, cards, tooltips and axis labels.
