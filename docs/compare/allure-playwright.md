---
title: vs Allure & Playwright HTML
sidebar_position: 1
---

# How reportingLabs compares

✅ built in · 🟡 possible with extra setup · ❌ not in the official docs

| | Playwright HTML | Allure | **reportingLabs** |
|---|:---:|:---:|:---:|
| **Getting started** | | | |
| Single HTML file, opens without a server | ❌<br/><sub>a folder, served by `show-report`</sub> | 🟡<br/><sub>single-file mode (2.24+, Allure 3)</sub> | ✅ |
| Nothing extra to install | ✅ | ❌<br/><sub>Allure CLI; Allure 2 needs Java</sub> | ✅<br/><sub>one package</sub> |
| Setup | ✅<br/><sub>built in</sub> | 🟡<br/><sub>reporter + generate step</sub> | ✅<br/><sub>one line</sub> |
| Frameworks | ❌<br/><sub>Playwright only</sub> | ✅<br/><sub>many languages</sub> | ✅<br/><sub>Playwright, WebdriverIO, pytest, Robot, JUnit 5, TestNG, Cucumber</sub> |
| **Each test** | | | |
| Steps, screenshots, videos, traces | ✅ | ✅ | ✅ |
| Logs and test data | 🟡<br/><sub>as attachments</sub> | 🟡<br/><sub>attachments, parameters</sub> | ✅<br/><sub>`log()`, `testData()`</sub> |
| API calls with request and response | ❌ | 🟡<br/><sub>manual attachments</sub> | ✅<br/><sub>automatic, Copy as cURL</sub> |
| Environment info | ❌ | 🟡<br/><sub>`environment.properties`</sub> | ✅<br/><sub>automatic</sub> |
| Secrets masked | ❌ | 🟡<br/><sub>parameters only</sub> | ✅<br/><sub>automatic</sub> |
| **Failures** | | | |
| Ranked by priority and severity | ❌ | ❌ | ✅<br/><sub>Needs attention</sub> |
| Grouped by root cause | ❌ | 🟡<br/><sub>regex in `categories.json`</sub> | ✅<br/><sub>automatic clusters</sub> |
| Explained in plain words | ❌ | ❌ | ✅<br/><sub>19 kinds</sub> |
| New vs already failing | ❌ | ❌ | ✅<br/><sub>"failing since #1840"</sub> |
| Grouped by owner | ❌ | 🟡<br/><sub>owner label, no rollup</sub> | ✅ |
| Bug report in one click | ❌ | ❌ | ✅<br/><sub>Markdown, Jira, text</sub> |
| **Across runs** | | | |
| History and trend chart | ❌ | 🟡<br/><sub>when history is carried over</sub> | ✅<br/><sub>zero setup</sub> |
| Flaky tests | ✅<br/><sub>per run</sub> | 🟡<br/><sub>`@Flaky` (Java)</sub> | ✅<br/><sub>plus flakiest over runs</sub> |
| Got slower than last run | ❌ | ❌ | ✅ |
| Timeline by worker | ❌ | ✅ | ✅ |
| **Organise and share** | | | |
| Priority, owner, feature, story | 🟡<br/><sub>custom annotations</sub> | ✅<br/><sub>labels</sub> | ✅<br/><sub>`meta()` or a comment</sub> |
| Links to Jira or a TMS | 🟡<br/><sub>URL in an annotation</sub> | ✅<br/><sub>`issue()`, `tms()`</sub> | ✅<br/><sub>`links` templates</sub> |
| Merge shards or several runs | ✅<br/><sub>`merge-reports`</sub> | ✅<br/><sub>launches</sub> | ✅<br/><sub>`reporting-labs merge`</sub> |
| PDF of the report | ❌ | ❌ | ✅<br/><sub>`report.pdf`</sub> |
| CSV / JSON export, Slack summary | ❌ | 🟡<br/><sub>Allure 3 plugins</sub> | ✅ |
| Free and open source | ✅ | ✅<br/><sub>TestOps is paid</sub> | ✅<br/><sub>MIT</sub> |

Based on each tool's official documentation as of September 2026. ❌ means the feature is not described there, not that it is impossible. Sources: Playwright [reporters](https://playwright.dev/docs/test-reporters), [annotations](https://playwright.dev/docs/test-annotations), [retries](https://playwright.dev/docs/test-retries), [sharding](https://playwright.dev/docs/test-sharding); Allure [allure-playwright](https://github.com/allure-framework/allure-js/blob/main/packages/allure-playwright/README.md), [Allure 3](https://github.com/allure-framework/allure3), [Allure 2.24.0 release](https://github.com/allure-framework/allure2/releases/tag/2.24.0), [Allure Report docs](https://allurereport.org/docs/). Something out of date? [Open an issue](https://github.com/naveenautomationlabs/reporting-labs/issues) and it will be fixed.

## When to pick which

**Playwright HTML** — you run only Playwright, want what ships with it, and do not need triage help (priorities, owners, history).

**Allure** — you need a language reportingLabs does not cover yet (Kotlin, Ruby, .NET, PHP) and you have someone to maintain the Allure generate step in CI.

**reportingLabs** — you want a single HTML file for triage: priority-ranked failures, owner filters, failure clusters, bug-report button, no server, works from an email. The same report for Playwright, WebdriverIO, pytest, Robot Framework, JUnit 5, TestNG and Cucumber.
