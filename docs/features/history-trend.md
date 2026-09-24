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
