---
title: History and trend
sidebar_position: 5
---

# History and trend

reportingLabs keeps a small file, `reporting-labs.history.json`, next to your config. It remembers the last 30 runs. Commit it, or cache it in CI, and the report starts answering the questions triage actually cares about:

- **Trend chart** — pass rate over the last 30 runs at a glance.
- **New vs known failures** — every failure is labelled `new since <run>` or `failing since <run>`. New = probably a real regression on the latest change.
- **Flaky dots** — a small streak on each row showing the last outcomes; a test that has flaked twice in five runs is visibly different from a first-ever red.
- **Got slower** — tests that are more than 2× slower than the last run.
- **Since last run** — one line on the Overview with what changed since the previous run (see below).

## Since last run

Under the tiles, one line says what changed against the previous run: **new failures** (failing now, not failing last time), **fixed** (failing last time, passing now), **still failing**, **got slower** (2× slower, failures left out) and **new tests**. Parts with nothing in them are left out; when nothing changed it says so.

![Since last run line](/img/screenshots/since-last-run-light.png)

Click a number to see those tests, and click a test to open it:

![The new failures, opened](/img/screenshots/since-last-run-open-light.png)

**Copy re-run command** on the right copies one command that runs every failed test again. See [Run again](./run-again.md).

The line compares with the last run of a similar size, like the trend (a full run is not compared with a one-spec debug run). On the first run, with nothing to compare, it shows the number of failed tests and the re-run command. Turn it off with `widgets: { changes: false }`. Needs npm `reporting-labs` 0.6.21+, PyPI `reporting-labs` 0.1.11+ or Maven `dev.reportinglabs` 0.1.32+.

### Small debug runs don't skew the trend

Running one spec or a `--grep` while debugging writes to the same history file as the full suite. So that a failing one-test run does not show up as a 0% day, run-level views — the **Trend** chart, the KPI sparklines, "**from last run**" and **Pass rate trend by priority** — leave out *small runs*: runs with fewer than half the median number of tests in the history. The Trend card says how many it left out. A full run is compared with the last full run, and a small run with the last run of a similar size.

Per-test history is not affected: a debug run still counts for the tests it ran (their dots, flaky streak and new vs known).

## CI: keep the history

The history file lives next to your config. On stateless CI runners, cache it between runs.

**GitHub Actions:**
```yaml
- uses: actions/cache@v4
  with:
    path: reporting-labs.history.json
    key: reporting-labs-history-${{ github.ref_name }}-${{ github.run_id }}
    restore-keys: reporting-labs-history-${{ github.ref_name }}-
```

**Jenkins:** the workspace usually keeps it on its own. If you use ephemeral agents, stash and unstash it between builds.
