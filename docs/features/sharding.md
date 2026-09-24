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

npx playwright test --shard=1/3 && mv reporting-labs all-shards/s1
npx playwright test --shard=2/3 && mv reporting-labs all-shards/s2
npx playwright test --shard=3/3 && mv reporting-labs all-shards/s3

npx reporting-labs merge all-shards -o merged
open merged/index.html
```

For a real parallel run on one machine:
```bash
mkdir -p all-shards
(npx playwright test --shard=1/3 && mv reporting-labs all-shards/s1) &
(npx playwright test --shard=2/3 && mv reporting-labs all-shards/s2) &
(npx playwright test --shard=3/3 && mv reporting-labs all-shards/s3) &
wait
npx reporting-labs merge all-shards -o merged
```

See [CI recipes](/ci/github-actions) for the full GitHub Actions and Jenkins matrix examples.
