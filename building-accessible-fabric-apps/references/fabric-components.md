# Fabric visual components

How to keep the accessibility features of Microsoft's Fabric visual components working. Read this when the project imports `@microsoft/fabric-visuals`, `@microsoft/fabric-datagrid` or `@microsoft/fabric-visuals-extensibility`.

Everything here comes from the packages' public READMEs and published code (version 5.0.0, MIT licence). The packages are in preview, so check the README in `node_modules` for the installed version before relying on a detail.

## Contents

- What the components already provide
- Charts with VegaVisual
- Hand-built VisualContainer
- Data grids with DataGrid
- Theme, motion and high contrast
- Keyboard checks for the browser validation
- Sources

## What the components already provide

| Component | Built in | What you still do |
|---|---|---|
| `VegaVisual` | Keyboard exploration of axes, data points and legend items (Vega-Lite specs only, not Flint); a framed container named by its header; a "Show as a table" dialog with the chart's data | Pass a header, keep the frame, don't hide or wrap the chart |
| `VisualContainer` | Container keyboard modes, toolbar, overflow menu, "Show as a table" action | Supply the table source yourself |
| `DataGrid` | Sort buttons with `aria-sort`, selection, expand and collapse labels, keyboard filter menus, labelled grand totals, image preview dialog | Write clear headers and alt text, offer alternatives to dragging |
| Theme (`useCssTheme`) | Light and dark tokens; system colours in high contrast | Use the tokens, check custom palettes |

Work with these features rather than rebuilding them. A second keyboard model or a second name on top of a component that already has one makes the app harder to use, not easier.

## Charts with VegaVisual

```tsx
import { VegaVisual, useCssTheme } from '@microsoft/fabric-visuals';

export function RevenueByRegion({ data }: { data: DataTable }) {
  const theme = useCssTheme();
  return (
    <VegaVisual
      spec={revenueByRegionSpec}
      data={data}
      theme={theme}
      header={{ title: 'Revenue by region', subtitle: 'West grew fastest, up 12% on last quarter' }}
    />
  );
}
```

- **Always pass `header` with a title.** The frame takes its accessible name from the header title and subtitle. Without a header, every chart on the page gets the same generic name ("Visual container"), so a screen reader user can't tell them apart.
- **Use the subtitle for the takeaway.** The subtitle is visible and is part of the accessible name, so one sentence there gives everyone the key insight (1.1.1).
- **The header title renders as an `h4`.** Plan the page's headings so the chart titles sit under a sensible `h2`/`h3` section heading, and don't add a separate heading with the same text next to the chart, or it is read twice.
- **Keep the frame, but change how it looks if asked.** `chromeless` removes the frame, its header, its toolbar and the "Show as a table" action. When the user wants charts without the card look, give them that look without `chromeless` (see "When the user wants no card frame" below). Use `chromeless` only when the chart sits inside a `VisualContainer` that you set up yourself.
- **Never wrap the chart in `role="img"` or `aria-hidden`.** The chart has its own keyboard exploration layer with focusable items. `role="img"` would hide those items from assistive technology. The `role="img"` pattern in [patterns.md](patterns.md) is for charts you draw yourself, not for `VegaVisual`.
- **Don't add your own roving tabindex or key handlers to chart marks.** Keyboard entry is built in: Tab to the chart's frame, press Enter to explore, use arrow keys and Tab within a region, Enter to drill in, Escape to go back up and leave.
- **Format values for the table.** "Show as a table" displays the source rows from the `data` prop. Pass data whose columns have clear display names and format strings, so the table reads as well as the chart.

### Flint specs

`VegaVisual` also accepts [Flint](https://microsoft.github.io/flint-chart/) specs (it treats a spec with top-level `chartType` and `encodings` as Flint). The header, the frame and the rules above apply to them in the same way, with one important difference: in the published 5.0.0 code, the keyboard exploration layer is only created for Vega-Lite specs, so a Flint chart can't be explored from the keyboard.

- Prefer Vega-Lite for charts that people need to explore or interact with, such as charts with cross-highlighting or drill-down.
- If you use Flint, keep the header and frame so the chart still has a name and the "Show as a table" view, and give any chart interaction (for example clicking a bar to filter) a keyboard alternative outside the chart, such as filter buttons.
- Check the installed version: if its README says keyboard navigation covers Flint, this difference no longer applies.

### When the user wants no card frame

A request like "keep the charts clean, without the card frame" is about appearance. Deliver the plain look and keep what the frame does for accessibility; don't refuse the request or quietly ignore it.

`containerClassName` styles the frame's inner card surface (background, border, radius, padding), so a plain card is one class:

```tsx
<VegaVisual
  spec={monthlyUnitsSpec}
  data={data}
  theme={theme}
  header={{ title: 'Monthly units', subtitle: 'Peak in November, up 18% on October' }}
  containerClassName="plain-visual"
/>
```

```css
.plain-visual {
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
}
```

- The title, the keyboard entry point and "Show as a table" all stay.
- Keep a visible focus indicator on the frame: with the border gone, check that `:focus-visible` still shows clearly (2.4.7) and stays visible in forced colours.
- If the user also objects to the visible title, explain that it names the chart for screen reader users and suggest keeping it small rather than removing it.
- Tell the user what you did and why in one or two sentences, so the choice isn't a surprise.

## Hand-built VisualContainer

When you frame content yourself with `VisualContainer`, built-in actions are opt-in. Turn on "Show as a table" and give it a stable table source:

```tsx
import { VisualContainer } from '@microsoft/fabric-visuals-extensibility';
import type { BuiltInActions } from '@microsoft/fabric-visuals-extensibility';

function KpiTrend({ rows }: { rows: KpiRow[] }) {
  const provideTables = useCallback(() => buildKpiTables(rows), [rows]);
  const actions = useMemo<BuiltInActions>(
    () => ({ viewAsTable: { tableSource: provideTables } }),
    [provideTables],
  );
  return (
    <VisualContainer header={{ title: 'Monthly active users', subtitle: 'Up 4% since March' }} builtInActions={actions}>
      <Sparkline rows={rows} />
    </VisualContainer>
  );
}
```

- Give it a `header` for the same reason as `VegaVisual`.
- The content inside (here, a custom sparkline) still follows the chart rules in SKILL.md.
- Custom actions need a short, specific `label`; it becomes the button's accessible name.

## Data grids with DataGrid

```tsx
import { DataGrid, ImageCell } from '@microsoft/fabric-datagrid';
import type { GridColumnDef } from '@microsoft/fabric-datagrid';

const columns: GridColumnDef[] = [
  { id: 'product', header: 'Product' },
  {
    id: 'photo',
    header: 'Photo',
    sortable: false,
    filterable: false,
    cellRenderer: (value, row) => <ImageCell src={String(value)} alt={`${row.product} product photo`} />,
  },
  { id: 'revenue', header: 'Revenue', numericStyling: true },
];

<DataGrid
  data={rows}
  columns={columns}
  header={{ title: 'Product sales', subtitle: 'Top 50 products this quarter' }}
  capabilities={{ disableColumnReorder: true }}
/>
```

- **Headers become labels.** Sort buttons and filter menus are named from the column header ("Sort by Revenue"), so write headers people understand, in full, not field names or abbreviations like `rev_amt` or "GM%" (2.4.6). When the data is a `DataTable`, set `displayName` on its columns.
- **`ImageCell` needs real alt text.** The preview button and the preview dialog are both named from `alt`, so here `alt` is not decorative: describe the image. The README example uses `alt="thumbnail"`, which gives every row the same name; don't copy it.
- **Dragging needs an alternative (2.5.7).** Column resizing and reordering are documented as drag interactions. If users need them, add a single-pointer alternative (for example a column settings dialog with move up/down buttons and width options) and apply the result through `columns`. If they don't need them, turn them off with `disableColumnResize` and `disableColumnReorder`.
- **Give the grid a header** so it has a name, like a chart.
- **Grand totals** are already announced as a totals row; keep the provided label rather than replacing it with an empty cell.
- **Sticky rows**: the header and a top grand-totals row are sticky. Check that they don't hide the focused cell when scrolling with the keyboard (2.4.11).
- **Check cell navigation yourself.** The README documents keyboard selection (Shift+arrow, Ctrl+C) and keyboard filter menus. Test that every cell, sort button and expand toggle can be reached and used from the keyboard in the installed version.

## Theme, motion and high contrast

- Get the theme from `useCssTheme()` (or `readCssTheme()`) and pass it to every component, so charts and grids follow the app's light and dark tokens instead of hard-coded colours.
- If you replace the data colours, check every series against the background in both themes (1.4.11) and keep labels or markers so colour isn't the only cue (1.4.1).
- In high contrast mode the components switch to system colours. Don't override them with fixed colours in your own CSS.
- Chart entrance animation checks `prefers-reduced-motion` before it plays, so leave the default `motion` setting rather than forcing animation. Your own spinners and transitions still need the reduced-motion rule in SKILL.md.

## Keyboard checks for the browser validation

Add these to the Playwright checks alongside axe-core (see "Automated checks" in [patterns.md](patterns.md)):

```ts
test('chart can be explored and left with the keyboard', async ({ page }) => {
  await page.goto('/sales');
  const chart = page.getByLabel(/Revenue by region/).first(); // the frame, named by its header
  await chart.focus();
  await page.keyboard.press('Enter');          // focus moves into the first chart region
  await expect(chart).not.toBeFocused();
  await page.keyboard.press('Escape');         // from a top-level region, back to the frame
  await expect(chart).toBeFocused();
  await page.keyboard.press('Tab');            // and on to the next control on the page
  await expect(chart).not.toBeFocused();
});

test('chart data is available as a table', async ({ page }) => {
  await page.goto('/sales');
  await page.getByLabel(/Revenue by region/).first().focus();
  await page.keyboard.press('Alt+Shift+F10');  // move to the chart toolbar
  await page.getByRole('button', { name: 'More actions' }).press('Enter');
  await page.getByRole('menuitem', { name: 'Show as a table' }).press('Enter');
  await expect(page.getByRole('dialog').getByRole('table')).toBeVisible();
});
```

The selectors are a starting point; adjust them to the roles and names the installed version renders. A person still needs to try the chart exploration with a screen reader, because these tests only prove that focus moves.

## Sources

- [@microsoft/fabric-visuals on npm](https://www.npmjs.com/package/@microsoft/fabric-visuals) (Visual framing; Accessible keyboard navigation; Entrance motion)
- [@microsoft/fabric-visuals-extensibility on npm](https://www.npmjs.com/package/@microsoft/fabric-visuals-extensibility) (VisualContainer; Show as table; Keyboard navigation)
- [@microsoft/fabric-datagrid on npm](https://www.npmjs.com/package/@microsoft/fabric-datagrid) (Props; Capabilities; Grand totals)
- [@microsoft/fabric-visuals-core on npm](https://www.npmjs.com/package/@microsoft/fabric-visuals-core) (Theme; high contrast)
