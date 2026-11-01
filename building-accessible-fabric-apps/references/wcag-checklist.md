# WCAG 2.2 AA checklist for Fabric data apps

Use this to map findings to success criteria. Each criterion links to its W3C Understanding page, at https://www.w3.org/WAI/WCAG22/Understanding/ followed by the slug in brackets.

| Criterion | Level | What it means in a data app | How to check |
|---|---|---|---|
| 1.1.1 Non-text Content (non-text-content) | A | Charts, KPI icons, boolean icons and image cells have text alternatives | Screen reader; inspect accessible names |
| 1.3.1 Info and Relationships (info-and-relationships) | A | Headings, tables with header cells, labelled groups and form labels in markup | axe; inspect DOM |
| 1.3.2 Meaningful Sequence (meaningful-sequence) | A | DOM order matches the visual reading order | Tab-order listing; screen reader reading |
| 1.4.1 Use of Color (use-of-color) | A | Series and states distinguishable without colour | Greyscale screenshot |
| 1.4.3 Contrast (Minimum) (contrast-minimum) | AA | 4.5:1 for normal text, including small chart labels; 3:1 for large text; both themes | axe in light and dark |
| 1.4.4 Resize Text (resize-text) | AA | Text at 200 per cent without loss of content or function | rem override at 200% |
| 1.4.10 Reflow (reflow) | AA | Works at 320 CSS pixels; grids and charts may scroll in their own region | 320px viewport |
| 1.4.11 Non-text Contrast (non-text-contrast) | AA | 3:1 for series colours, focus rings, input borders, meaningful gridlines | Colour contrast check per theme |
| 1.4.12 Text Spacing (text-spacing) | AA | No clipping with the text-spacing overrides | Text-spacing style override |
| 1.4.13 Content on Hover or Focus (content-on-hover-or-focus) | AA | Tooltips appear on focus, dismiss with Escape, stay while hovered | Keyboard and mouse |
| 2.1.1 Keyboard (keyboard) | A | Chart points, filters, cross-highlighting, grid, lightbox all keyboard operable | Keyboard only |
| 2.1.2 No Keyboard Trap (no-keyboard-trap) | A | Focus can always leave charts, grids and dialogs | Keyboard only |
| 2.4.2 Page Titled (page-titled) | A | `document.title` updates for each view | Inspect title after navigation |
| 2.4.3 Focus Order (focus-order) | A | Focus moves to the new view's heading; dialogs return focus | Keyboard only |
| 2.4.7 Focus Visible (focus-visible) | AA | Visible focus indicator on every focusable element | Keyboard, both themes |
| 2.4.11 Focus Not Obscured (Minimum) (focus-not-obscured-minimum) | AA | Sticky headers and panels never completely hide the focused element | Tab through with sticky elements in view |
| 2.5.7 Dragging Movements (dragging-movements) | AA | Single-pointer alternative for any drag | Mouse without dragging |
| 2.5.8 Target Size (Minimum) (target-size-minimum) | AA | 24 by 24 CSS pixel targets or enough spacing | axe `target-size`; measure |
| 3.3.1 Error Identification (error-identification) | A | Input errors described in text | Submit invalid data |
| 3.3.2 Labels or Instructions (labels-or-instructions) | A | Visible labels on all inputs and filters | Inspect |
| 3.3.3 Error Suggestion (error-suggestion) | AA | Errors suggest a correction where possible | Submit invalid data |
| 3.3.7 Redundant Entry (redundant-entry) | A | Previously entered data is not asked for again in the same process | Walk through multi-step forms |
| 4.1.2 Name, Role, Value (name-role-value) | A | Custom controls, cell renderers and chart points expose name, role, state | axe; accessibility tree |
| 4.1.3 Status Messages (status-messages) | AA | Loading, empty, saved and error states announced without focus moving | Screen reader; check live regions exist before updates |

**Beyond AA (recommended):**

| Item | Level | What it means in a data app | How to check |
|---|---|---|---|
| 2.3.3 Animation from Interactions (animation-from-interactions) | AAA | Spinners, transitions and animated highlights stop under `prefers-reduced-motion` | Playwright `reducedMotion: 'reduce'` |
| Windows High Contrast (forced colors) | Not a WCAG criterion | Bars, selection and focus stay visible when the system forces colours; report failures under 1.4.11 or 2.4.7 when they hide content or focus | Playwright `forcedColors: 'active'`; Windows contrast themes |
