---
title: GitHub Actions
sidebar_position: 1
---

# GitHub Actions

Simple case first, sharded case second.

## One job, one report

```yaml
name: Playwright tests
on:
  push: { branches: [main] }
  pull_request:

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps

      # History cache so trend and new-vs-known work across runs
      - uses: actions/cache@v4
        with:
          path: reporting-labs.history.json
          key: reporting-labs-history-${{ github.ref_name }}-${{ github.run_id }}
          restore-keys: reporting-labs-history-${{ github.ref_name }}-

      - run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: test-report, path: reporting-labs/, retention-days: 30 }
```

Download the **test-report** artifact from the run summary and open `index.html`.

## Four shards + merge

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix: { shard: [1, 2, 3, 4] }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-shard-${{ matrix.shard }}
          path: reporting-labs/
          retention-days: 30

  merge:
    if: always()
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - uses: actions/download-artifact@v4
        with: { path: all-shards, pattern: 'report-shard-*' }
      - run: npx reporting-labs merge all-shards -o merged
      - uses: actions/upload-artifact@v4
        with: { name: merged-report, path: merged/, retention-days: 30 }
```

Download the **merged-report** artifact — one HTML covers every shard.

## Slack notification on failure (optional)

```yaml
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          payload: '{"text":"Playwright failed on ${{ github.ref_name }}. Run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
