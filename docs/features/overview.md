---
title: Features overview
sidebar_position: 1
---

# Features overview

Every card and tab is switched on by default. What you actually see in the report depends on what your tests give it.

| Feature | Enabled by |
|---|---|
| Priority ranking, owner and feature filters | Adding `meta({ priority, owner, feature, story })` to your tests |
| Trend chart, "new vs known" failures, flaky dots | Running the suite twice (a small history file next to the config) |
| Screenshots, videos and traces in the report | Turning them on in `playwright.config.ts` |
| Feature × project heatmap | Having more than one Playwright project |
| Auto-captured API calls | `import 'reporting-labs/auto'` once |

The report tells you about these itself — a card that has nothing to show yet explains what to do.
