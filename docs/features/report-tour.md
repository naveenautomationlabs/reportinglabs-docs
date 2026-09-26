---
title: Report tour
sidebar_position: 2
---

# Report tour

The report is one HTML file with six tabs across the top. This page walks through what each one shows.

## Overview

Everything that matters about the run, above the fold. Header carries the title, project, environment and build chips, plus wall-clock time and worker count. Below that: outcome tiles (passed / failed / flaky / skipped), a **Needs attention** list ranked by priority, and cards for owner rollup, feature rollup and project × feature heatmap.

![Overview tab](/img/screenshots/01-overview-light.png)

## Tests

Every test as a searchable row. Filter by outcome, priority, owner, feature, tag or free text. Sort by duration, name or file. Click a row to open the full detail.

![Tests list](/img/screenshots/02-tests-light.png)

## Test detail

Click any row and the report pushes it into a modal with its full story:

- **Logs** — every `log()` call in order.
- **Data** — pinned JSON blocks from `testData()`, sensitive keys masked.
- **API** — every request the test made, auto-captured when `import 'reporting-labs/auto'` is on.
- **Steps** — the Playwright step tree with timing per step.
- **Attachments** — screenshots, videos and traces, inline where possible.

![Test detail](/img/screenshots/03-test-detail-light.png)

## Failures

Similar errors are clustered. The report reads the error message, the stack top and the affected selector, groups tests that share those, and shows the cluster as a single card. Thirty red tests that share one broken selector read as one problem.

![Failures grouped](/img/screenshots/04-failures-light.png)

Each cluster shows the shared error, the tests inside it, and a **Copy bug report** button that produces a ready-to-paste ticket in Jira, Markdown or plain text.

## API

Every request auto-captured across the run, with method, URL, status, request headers, response body and timing. Filter by status code or search by URL.

![API tab](/img/screenshots/05-api-light.png)

This tab only appears when `import 'reporting-labs/auto'` is set in your Playwright config. Without it, requests inside individual tests are still shown on the Test detail's **API** subtab.

## Graphs

Five charts on one tab:

1. **Outcomes by priority** — stacked pass / fail / flaky / skipped for each priority tier.
2. **Failure categories** — what kinds of failures are hurting the suite (assertions vs timeouts vs network vs browser closed).
3. **Duration distribution** — how test durations are spread across the run.
4. **Pass rate trend by priority** — how each priority tier trends over the last runs (needs history).
5. **Owner leaderboard** — failures and flakes ranked by owner.

![Graphs tab](/img/screenshots/06-graphs-light.png)

Every chart has a **Download PNG** button.

## Timeline

A Gantt-style view of what every worker was doing when. Bars are colored by outcome. Useful for spotting slow tests, idle workers, or a bottleneck that keeps only one worker busy.

![Timeline of workers](/img/screenshots/07-timeline-light.png)
