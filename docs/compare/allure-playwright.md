---
title: vs Allure & Playwright HTML
sidebar_position: 1
---

# How reportingLabs compares

**Legend:** ✅ built-in and free · 🟡 possible but needs setup or plugins · ❌ not available.

| Capability | Playwright HTML | Allure | reportingLabs |
|---|---|---|---|
| Single-file HTML | ✅ | ❌ (multi-file, needs `allure generate`) | ✅ |
| Priority / severity / owner / feature / epic / story on tests | 🟡 custom annotations | ✅ labels | ✅ |
| Failure clusters grouped by error | ❌ | ❌ | ✅ |
| Bug report button (Jira / Markdown / plain text) | ❌ | ❌ | ✅ |
| Plain-language failure reasons | ❌ | ❌ | ✅ |
| History across runs / Trend chart | ❌ | 🟡 "History Trend" when history is accumulated | ✅ history file, zero setup |
| Combine shards / several runs | ✅ blob + `merge-reports` | ✅ Launches | ✅ `reporting-labs merge` |
| Auto-captured API calls (Playwright) | ❌ | ❌ | ✅ (`import 'reporting-labs/auto'`) |
| Frameworks beyond Playwright | ❌ | ✅ many languages | 🟡 JS/Playwright + Java (JUnit 5, TestNG); Python coming |

Sources: [Playwright HTML reporter docs](https://playwright.dev/docs/test-reporters#html-reporter), [Playwright blob merge](https://playwright.dev/docs/test-sharding), [Allure Report site](https://allurereport.org/).

## When to pick which

**Playwright HTML** — you want one file, you have exactly one team, you do not need triage help.

**Allure** — you need broad multi-language support (Python, Kotlin, Ruby, .NET, PHP) and you have someone to maintain the Allure server / generator step in CI.

**reportingLabs** — you want a single HTML file for triage: priority-ranked failures, owner filters, failure clusters, bug-report button, no server, works from an email.
