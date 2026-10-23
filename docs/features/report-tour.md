---
title: Report tour
sidebar_position: 2
---

# Report tour

The report is one HTML file with six tabs across the top. This page walks through what each one shows.

## Overview

Everything that matters about the run, above the fold. Header carries the title, project, environment and build chips, plus wall-clock time and worker count. Below that: outcome tiles (passed / failed / flaky / skipped), the [**Since last run**](./history-trend.md#since-last-run) line (new failures, fixed, still failing, got slower, new tests, and a button that copies the command to re-run the failed tests), a **Needs attention** list ranked by priority, and cards for owner rollup, feature rollup and project × feature heatmap.

![Overview tab](/img/screenshots/01-overview-light.png)

## Tests

Every test as a searchable row. Filter by status (the Any status dropdown: Passed, Failed, Flaky, Skipped, with counts; the `f` key toggles failed-only), priority, owner, feature, tag or free text. Sort by duration, name or file. Click a row to open the full detail.

![Tests list](/img/screenshots/02-tests-light.png)

## Test detail

Click any row and the report pushes it into a modal with its full story:

- **Logs** — every `log()` call in order.
- **Data** — pinned JSON blocks from `testData()`, sensitive keys masked.
- **API** — every request the test made, auto-captured when `import 'reporting-labs/auto'` is on.
- **Steps** — the Playwright step tree with timing per step. A step with sub-steps starts collapsed; click it to open it, or use **Expand all / Collapse all** above the steps. On a failed test the steps that lead to the failure start open (set [`expandFailedSteps: false`](../reference/options.md) to keep them collapsed too).
- **Attachments** — screenshots, videos and traces, inline where possible.
- **Run again** — the command that runs just this test again, with a Copy button. See [Run again](./run-again.md).

![Test detail](/img/screenshots/03-test-detail-light.png)

## Failures

Similar errors are clustered. The report reads the error message, the stack top and the affected selector, groups tests that share those, and shows the cluster as a single card. Thirty red tests that share one broken selector read as one problem.

![Failures grouped](/img/screenshots/04-failures-light.png)

Each cluster shows the shared error, the tests inside it, and a **Copy bug report** button that produces a ready-to-paste ticket in Jira, Markdown or plain text.

## API

Every request auto-captured across the run, with method, URL, status, request headers, response body and timing. Filter by status code or search by URL.

A 4xx or 5xx response counts as **failed** only when the test that made the call failed. In a passing test it is the answer the test asked for — a 404 after a DELETE, a 401 for a bad token — so it is shown grey and marked **expected**, and counted separately.

![API tab](/img/screenshots/05-api-light.png)

This tab only appears when `import 'reporting-labs/auto'` is set in your Playwright config. Without it, requests inside individual tests are still shown on the Test detail's **API** subtab.

## Graphs

Up to six charts on one tab:

1. **Outcomes by priority** — stacked pass / fail / flaky / skipped for each priority tier.
2. **Outcomes by project** — the same per Playwright project (browser or device) with its pass rate; shown when the run has more than one project.
3. **Failure categories** — what kinds of failures are hurting the suite (assertions vs timeouts vs network vs browser crashed).
4. **Duration distribution** — how the durations of the tests that ran are spread.
5. **Pass rate trend by priority** — how each priority tier trends over the last runs (needs history).
6. **Owner leaderboard** — failures and flakes ranked by owner.

![Graphs tab](/img/screenshots/06-graphs-light.png)

Every chart has a **Download PNG** button.

## Timeline

A Gantt-style view of what every worker was doing when. Bars are colored by outcome. Useful for spotting slow tests, idle workers, or a bottleneck that keeps only one worker busy.

![Timeline of workers](/img/screenshots/07-timeline-light.png)

## On a phone

The report is a single HTML file, so it opens on a phone straight from a CI artifact, a Slack link or an email attachment. On a narrow screen the tiles, cards and tests stack in one column, and long URLs and paths in errors wrap to the screen width.

<img src="/img/screenshots/phone-overview-light.png" alt="The report's Overview on a phone" width="320" />
