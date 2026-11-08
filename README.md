# Building accessible Fabric Apps

[![Latest release](https://img.shields.io/github/v/release/Juls-BI/fabric-apps-accessibility-skill.svg)](https://github.com/Juls-BI/fabric-apps-accessibility-skill/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Targets WCAG 2.2 AA (not a conformance claim)](https://img.shields.io/badge/WCAG-2.2%20AA%20target-1f6feb.svg)](https://www.w3.org/TR/WCAG22/)
[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-SKILL.md-6f42c1.svg)](building-accessible-fabric-apps/SKILL.md)
[![Works with GitHub Copilot](https://img.shields.io/badge/works%20with-GitHub%20Copilot-24292f.svg)](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
[![Works with Claude](https://img.shields.io/badge/works%20with-Claude-d97757.svg)](https://code.claude.com/docs/en/skills)
[![Microsoft Fabric Apps (preview)](https://img.shields.io/badge/Microsoft%20Fabric%20Apps-preview-0f7b6c.svg)](https://learn.microsoft.com/en-us/fabric/apps/overview)


An Agent Skill that makes coding agents build **Microsoft Fabric Apps** (Rayfin SDK, the data app template, React front ends over semantic models) **accessible by default**, to WCAG 2.2 AA.

A Fabric App is a standard web application, so every accessibility requirement has to be met in its code. When AI agents write that code, the accessibility rules need to be in their instructions from the start. This skill puts them there.

Agent Skills is an open format, so the same skill folder works in GitHub Copilot (agent mode in VS Code, the Copilot CLI and the Copilot cloud agent), Claude Code and the Claude apps.

## What it does

Once installed, the agent loads the skill for any UI work in a Fabric App or Rayfin project, including requests that never mention accessibility ("add a KPI row", "build the sales page"). It then:

- builds charts with accessible names, takeaway summaries and data table alternatives
- uses the accessibility built into Microsoft's Fabric visual components (`VegaVisual`, `DataGrid`) rather than replacing or hiding it
- makes cross-highlighting chart points keyboard-operable controls with their selected state exposed
- keeps focus visible, handles focus and page titles on view changes, and keeps sticky headers from hiding focus
- announces loading, empty, saved and error states through live regions that are always on the page
- writes plain-language labels and full column headers instead of semantic model field names and abbreviations
- sizes text in rem and keeps grids, cards and tooltips readable at 200% text and with WCAG text spacing
- checks contrast in light and dark themes, and supports reduced motion and Windows High Contrast
- adds axe-core checks to the template's Playwright browser validation
- reports findings mapped to WCAG criteria, without claiming conformance from automated checks alone
- offers to add an accessibility section to the project's `copilot-instructions.md`, so other agents follow the same rules

It also audits existing Fabric App views.

## Install

**GitHub Copilot:** copy the [`building-accessible-fabric-apps`](building-accessible-fabric-apps) folder into your Fabric App project at `.github/skills/` and commit it, so everyone working on the app gets it. For yourself only, use `~/.copilot/skills/`. In VS Code, type `/skills` in chat to check that it's listed. See the [VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills) and [GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-skills) docs.

**Claude Code:** copy the same folder to `.claude/skills/` in the project, or `~/.claude/skills/` for yourself.

**Claude (web or desktop):** download `building-accessible-fabric-apps.skill` from the [latest release](https://github.com/Juls-BI/fabric-apps-accessibility-skill/releases/latest) and upload it under Settings > Capabilities > Skills. Organisation admins can share it with everyone.

**Always-on rules (any agent):** a skill loads only when the agent decides the task needs it. To make the core rules apply to every request as well, paste [`assets/agent-instructions-accessibility.md`](building-accessible-fabric-apps/assets/agent-instructions-accessibility.md) into the project's `.github/copilot-instructions.md` or `AGENTS.md`. The skill offers to do this the first time it runs.

## Contents

| Path | Purpose |
|---|---|
| `building-accessible-fabric-apps/SKILL.md` | Workflow and rules |
| `building-accessible-fabric-apps/references/patterns.md` | React/TypeScript and CSS patterns, Playwright and axe-core checks |
| `building-accessible-fabric-apps/references/fabric-components.md` | Using Microsoft's Fabric visual components (`VegaVisual`, `VisualContainer`, `DataGrid`) without breaking their built-in accessibility |
| `building-accessible-fabric-apps/references/wcag-checklist.md` | WCAG 2.2 criteria mapped to data app components |
| `building-accessible-fabric-apps/assets/agent-instructions-accessibility.md` | Rules block for agent instruction files |
| `building-accessible-fabric-apps/evals/` | Test cases and trigger queries |
| `docs/` | Benchmark results |

## Test results

Three realistic tasks, each run in Claude with and without the skill and graded against pass/fail checks on the code itself. Two of the tasks never mention accessibility.

| Task | Round 1: with / without | Round 2: with / without |
|---|---|---|
| Build a sales overview view | 9/9 vs 7/9 | 11/11 vs 7/11 |
| Build a lightbox and sticky filter bar | 9/9 vs 8/9 | 11/11 vs 8/11 |
| Audit an existing dashboard | 10/10 vs 10/10 | 17/17 vs 13/17 |
| **Total** | **28/28 vs 25/28** | **39/39 vs 28/39** |

Round 2 added checks for reduced motion and high contrast and made the audit harder. With the skill, runs take about twice as long because they also write accessibility tests and a WCAG-mapped report. Full numbers are in [docs/benchmark-round-2.md](docs/benchmark-round-2.md).

Round 3 tested a page built with Microsoft's Fabric visual components (`VegaVisual` and `DataGrid`), where the user also asks for charts without the card frame:

| Task | Round 3: with / without |
|---|---|
| Build a product performance page with Fabric visual components | 13/13 vs 5/13 |

Without the skill, the agent guessed the components' settings and hid both charts from screen readers, which removes their built-in keyboard navigation and table view. With the skill, it kept those features and still gave the user the plain look they asked for. Full numbers are in [docs/benchmark-round-3.md](docs/benchmark-round-3.md).

The tests haven't been run in GitHub Copilot yet. The skill uses no Claude-specific features, but results may differ with other agents and models. These are code-level checks from a single run per task, not a substitute for testing with real assistive technology users. Nothing here is a WCAG conformance claim.

## Background

Fabric Apps and the data app template are in preview, so details may change. The guidance draws on the WCAG 2.2 Understanding documents, the Microsoft Learn documentation for Fabric Apps and the public npm documentation for Microsoft's Fabric visual components.

## License

[MIT](LICENSE)
