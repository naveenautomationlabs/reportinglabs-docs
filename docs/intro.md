---
title: What is reportingLabs?
sidebar_position: 1
---

# What is reportingLabs?

reportingLabs turns a test run into **one HTML file** you can share. No server, no login, no expiry. Open it in a browser, attach it to a ticket, send it on Slack — it just works.

Today it ships for three ecosystems:

- **Node.js — JavaScript & TypeScript** — on npm as [`reporting-labs`](https://www.npmjs.com/package/reporting-labs). A **Playwright** reporter, a **Cypress** plugin (`reporting-labs/cypress`) and a **WebdriverIO** reporter (`reporting-labs/wdio`), same install whichever you use.
- **Java** — on Maven Central as [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs): reporters for **TestNG** and **JUnit 5**, with zero-code add-ons for **Selenium**, **REST Assured** and **Playwright for Java**, and a **Cucumber JVM** plugin.
- **Python** — on PyPI as [`reporting-labs`](https://pypi.org/project/reporting-labs/): a **pytest** plugin that turns on the moment it is installed, with zero-code support for **Playwright** and **Selenium**, and a **Robot Framework** listener.

Every port renders from the same shared HTML template, so a Java team's report is byte-for-byte the report a JavaScript or Python team opens.

## Why does it exist?

The default HTML report from most test frameworks tells you what passed and what failed. It does not tell you which failure to look at first, who owns it, whether it is new since the last run, or whether thirty red tests are actually one broken selector. That is the report reportingLabs replaces.

## Quick tour

- **Priority-ranked failures.** Add `meta({ priority: 'P0', owner: 'naveen' })` (or `@Priority("P0") @Owner("naveen")` in Java) and the report puts P0 breakages on top.
- **Failure clusters.** Thirty red tests that share one error read as one problem.
- **History and trend.** A small file next to your config powers the Trend chart, new-vs-known failures and flaky-dot history.
- **Bug report button.** One click copies a ready-to-paste ticket in Jira, Markdown or plain text.
- **Sharding + merge.** Split your run across N shards for speed, then `npx reporting-labs merge` joins them into one report.

Head to [Get started](/get-started/nodejs) to try it in five minutes.
