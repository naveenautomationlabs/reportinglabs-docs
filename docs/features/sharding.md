---
title: Sharding and merge
sidebar_position: 6
---

# Sharding and merge

Big suite? Split it into shards so they run in parallel, then join every shard's report into one HTML at the end.

## How it works

Each shard runs the reporter and writes its own `reporting-labs/` folder with `index.html` plus a small `report.json` next to it. The `merge` CLI reads every shard's `report.json`, combines them into one dataset, copies attachments into per-shard subfolders so nothing overwrites, and renders one HTML with all tests, one Trend chart, one Failure Clusters view, and a Shards row in the Environment card.

No config change needed. The reporter writes `report.json` on every run out of the box.

## Try it on your laptop

```bash
rm -rf all-shards merged
mkdir -p all-shards

# ; not && : a shard with a failing test exits 1, and && would skip its mv
npx playwright test --shard=1/3; mv reporting-labs all-shards/s1
npx playwright test --shard=2/3; mv reporting-labs all-shards/s2
npx playwright test --shard=3/3; mv reporting-labs all-shards/s3

npx reporting-labs merge all-shards -o merged
open merged/index.html
```

For a real parallel run on one machine, give each shard its own folders, or shards running at the same time overwrite each other. `REPORTING_LABS_OUTPUT_FOLDER` sets the report folder and `--output` the Playwright `test-results` folder:
```bash
rm -rf all-shards merged && mkdir -p all-shards
REPORTING_LABS_OUTPUT_FOLDER=all-shards/s1 npx playwright test --shard=1/3 --output=test-results/s1 &
REPORTING_LABS_OUTPUT_FOLDER=all-shards/s2 npx playwright test --shard=2/3 --output=test-results/s2 &
REPORTING_LABS_OUTPUT_FOLDER=all-shards/s3 npx playwright test --shard=3/3 --output=test-results/s3 &
wait
npx reporting-labs merge all-shards -o merged
```

The same variable works in Jenkins `parallel` stages: `withEnv(['REPORTING_LABS_OUTPUT_FOLDER=rl-shards/shard-1']) { bat 'npx playwright test --shard=1/4 --output=test-results/shard-1' }`, then `npx reporting-labs merge rl-shards -o merged`.

## What the merged report shows

- **One row per test** from every shard, with failures, clusters, owners and the trend as in a single run.
- **Timeline:** each shard's workers get their own rows, `S1·w0`, `S1·w1`, `S2·w0` …, so you can see when each shard ran and which worker ran what. Shards that ran one after another form a staircase; shards that ran in parallel line up.
- **Workers:** `4 shards × 4 workers = 16 workers`, how busy they were, and the wall clock from the first shard's start to the last shard's end.
- **Environment:** a **Shards** row listing the merged shards, and **Workers** as `4 per shard · 16 in total`.
- **PDF:** each shard folder keeps its own `report.pdf`; for the merged report use **Export PDF** in the HTML.

See [CI recipes](/ci/github-actions) for the full GitHub Actions and Jenkins matrix examples.
