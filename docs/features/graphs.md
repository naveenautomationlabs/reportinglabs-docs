---
title: Graphs
sidebar_position: 7
---

# Graphs

The Graphs tab bundles up to six charts on one screen so you can see the shape of a run at a glance. Every chart has a **Download PNG** button (top-right of the card) so you can drop it into a Jira ticket or Slack message without a screenshot tool.

![Graphs tab with all five charts](/img/screenshots/06-graphs-light.png)

## 1. Outcomes by priority

Stacked bars, one per priority tier (P0, P1, P2, P3, plus "No priority"). Each bar shows how many tests passed, failed, flaked or were skipped. This is the first place to look after a red run — if P0 is on fire while P2 is green, that is the sentence.

Empty priorities are hidden. If nothing has a `priority` meta yet, only the "No priority" bar shows.

## 2. Outcomes by project

Shown when the run has more than one Playwright project — usually one per browser (chromium, firefox, webkit, Microsoft Edge, Google Chrome) or device. One stacked bar per project with its pass rate, so a browser that fails more than the others stands out.

## 3. Failure categories

Horizontal bars grouped by the kind of failure the test hit — Assertion, Selector, Timeout, Network, Browser crashed, Browser closed early, and so on. Categories come from the built-in error explainer, so you get the same label whether the error came from `expect`, a broken locator or a Playwright timeout.

Categories with zero failures are hidden.

## 4. Duration distribution

Histogram of the durations of the tests that ran (skipped tests are left out), bucketed by common thresholds (`< 1s`, `1-3s`, `3-10s`, `10-30s`, `30s+`). A count sits above each non-empty bar. Use it to spot suites that would benefit from splitting a slow test out.

## 5. Pass rate trend by priority

A line per priority, one dot per historical run (small debug runs are left out, see [History and trend](./history-trend.md)). Shows how each priority tier is trending — a P0 line dipping toward zero says the last few builds got worse. Needs history: run the suite at least twice.

If a priority has no data across any historical run, its line is hidden entirely so the chart stays readable.

## 6. Owner leaderboard

Horizontal stacked bars, one per owner, sorted by failure count → flakes → total tests. People at the top of the list are the ones whose tests are red or flaky right now.

If no test carries an `owner` meta, the card shows a hint: *"Add `meta({ owner: '…' })` to see this."*

## Dark mode

Every chart re-themes cleanly in dark mode.

![Graphs tab in dark](/img/screenshots/06-graphs-dark.png)
