---
title: JavaScript / Playwright
sidebar_position: 1
---

# Get started: JavaScript / Playwright

Two commands to install, one line in your Playwright config, done. This page walks the whole flow with real screenshots.

## Install

```bash
npm i -D reporting-labs
npx reporting-labs init
```

`init` writes `reporting-labs.config.ts` with every option commented out.

## Wire it up

Open `playwright.config.ts` and add the reporter:

```ts
import { defineConfig } from '@playwright/test';
import reportingLabs from './reporting-labs.config';

export default defineConfig({
  reporter: [
    ['list'],
    ['reporting-labs', reportingLabs],
  ],
});
```

That is the whole setup. Run your tests and open the report:

```bash
npx playwright test
open reporting-labs/index.html    # macOS
# xdg-open reporting-labs/index.html   # Linux
# start   reporting-labs\index.html    # Windows
```

The report is one self-contained HTML file. No server, no login, no expiry. You can email it, attach it to a Jira ticket, or drop it in Slack.

![Overview tab of the report](/img/screenshots/01-overview-light.png)

## Tag your tests

Three tiny helpers add the details the report needs. Import them from `reporting-labs`.

```ts
import { test, expect } from '@playwright/test';
import { meta, log, testData } from 'reporting-labs';

test('places an order with a saved card', async ({ page }) => {
  meta({
    priority: 'P0',
    owner: 'naveen',
    feature: 'checkout',
    story: 'SHOP-231',
  });

  await testData({ user: 'demo@shop.io', card: '4242…', total: 99 }, 'Cart');
  await log('opening checkout');

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByText('Thank you')).toBeVisible();
});
```

- **`meta({ ... })`** — sets priority, owner, feature and any custom keys. The report uses these for filters, the Owner leaderboard and the Failure by owner chart.
- **`log('opening checkout')`** — a step message shown inline in the test detail view.
- **`testData({ user, card, total }, 'Cart')`** — pinned JSON block, sensitive values masked automatically.

All three are optional. A test with no `meta()` still shows up — the report just cannot rank it by priority.

## Auto-capture API calls

Add one import to the top of your Playwright config:

```ts
import 'reporting-labs/auto';
```

Every `request.get / post / put / delete / ...` call your tests make is recorded automatically — method, URL, status, response body, timing. Nothing else to change.

![API tab with captured requests](/img/screenshots/05-api-light.png)

## What you get out of the box

Open the report and click through the top tabs.

### Overview

Header shows the run: build, environment, worker count, wall-clock time, plus a **Needs attention** list ranked by priority.

![Overview tab](/img/screenshots/01-overview-light.png)

### Tests

Every test as a row. Filter by outcome, priority, owner, feature or free text. Click any row to open the full detail.

![Tests list with filters](/img/screenshots/02-tests-light.png)

### Test detail

Click a row and you see the whole story — logs, pinned data, API calls, steps with timings, screenshots, video and trace attachments.

![Test detail with logs, data and API calls](/img/screenshots/03-test-detail-light.png)

### Failures

Similar errors are clustered. Thirty red tests that share one selector read as one problem.

![Failures grouped by root cause](/img/screenshots/04-failures-light.png)

### Graphs

Five charts on one tab: outcomes by priority, failure categories, duration distribution, pass-rate trend, and the owner leaderboard.

![Graphs tab with five charts](/img/screenshots/06-graphs-light.png)

### Timeline

A Gantt-style view of what every worker was doing when. Great for spotting slow tests and idle workers.

![Timeline of workers](/img/screenshots/07-timeline-light.png)

## Dark mode

The whole report reads in dark mode too. Viewers switch it from the header — the choice is remembered per browser.

![Overview tab in dark mode](/img/screenshots/01-overview-dark.png)

## Common next steps

- **Add history** — run the suite twice. reportingLabs writes `reporting-labs.history.json` next to your config; the trend chart and "new vs known" markers use it automatically.
- **Shard across CI machines** — split your run across N shards, then `npx reporting-labs merge` joins the JSON shards into one HTML report. See [Sharding + merge](/features/sharding).
- **Customize the header** — logo, accent color, project block, custom sections. See [All options](/reference/options).

Full reference: [All options](/reference/options) · [Runtime API](/reference/api).
