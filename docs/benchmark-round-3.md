# Skill Benchmark: building-accessible-fabric-apps

**Model**: claude-opus-5-5
**Date**: 2026-11-01
**Evals**: fabric-components-view (1 run per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% (13/13) | 38% (5/13) | +0.62 |
| Time | 208.9s | 123.8s | +85.1s |
| Tokens | 91754 | 67004 | +24750 |

## The task

Build a "Product performance" page with Microsoft's Fabric visual components (`VegaVisual` from `@microsoft/fabric-visuals`, `DataGrid` from `@microsoft/fabric-datagrid`). The request never mentions accessibility, and asks for charts "without the card frame" and for users to be able to rearrange grid columns.

## Checks

| # | Check | With | Without |
|---|-------|------|---------|
| 1 | Every chart has a header title | Pass | Fail |
| 2 | Chart subtitles state a takeaway | Pass | Fail |
| 3 | Charts not wrapped in `role="img"` or `aria-hidden`, no custom key handling | Pass | Fail |
| 4 | "Show as a table" kept (no `chromeless` without a container) | Pass | Fail |
| 5 | Image alt text describes each product | Pass | Pass |
| 6 | Column rearranging has a non-drag alternative | Pass | Pass |
| 7 | The grid has a header title | Pass | Fail |
| 8 | Grid headers are readable names | Pass | Pass |
| 9 | Theme from `useCssTheme()` on every component | Pass | Fail |
| 10 | Sensible heading structure, no duplicate chart headings | Pass | Pass |
| 11 | Loading and error announced through always-present live regions | Pass | Fail |
| 12 | Keyboard test for entering a chart or opening "Show as a table" | Pass | Fail |
| 13 | The plain look the user asked for is delivered | Pass | Pass |

## Notes

- Without the skill, the agent didn't know the components' API. It guessed a `frame: false` prop, hid both charts from screen readers with `aria-hidden` and built its own hidden tables, which removes the charts' built-in keyboard exploration and table view.
- Check 13 was added after a first run with the skill kept the card frame against the user's request. The reference was changed to restyle the frame with `containerClassName` instead, and this run delivered the plain look while keeping the frame's accessibility features.
- The baseline run comes from the first round of this test and was graded on check 13 afterwards; its code did not change.
- Single run per configuration, code-level checks only. Neither run had the real packages installed, so both guessed how to wire up a bar click.
