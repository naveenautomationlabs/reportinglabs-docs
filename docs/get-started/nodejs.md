---
title: Node.js — JavaScript & TypeScript
sidebar_label: Node.js (JS & TS)
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get started: Node.js — JavaScript & TypeScript

reportingLabs ships one npm package that works with **both plain JavaScript and TypeScript Playwright projects** on Node.js. Same install, same reporter entry, same helpers. Every code snippet on this page shows the TypeScript form and the JavaScript form side by side — pick the tab that matches your project.

Two commands to install, one line in your Playwright config, done.

## Install

```bash
npm i -D reporting-labs
npx reporting-labs init
```

`init` writes a `reporting-labs.config.ts` (or `reporting-labs.config.js` if your project is plain JS) with every option commented out.

## Wire it up

Open your Playwright config and add the reporter.

<Tabs groupId="js-ts">
<TabItem value="ts" label="TypeScript" default>

```ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test';
import reportingLabs from './reporting-labs.config';

export default defineConfig({
  reporter: [
    ['list'],
    ['reporting-labs', reportingLabs],
  ],
});
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js title="playwright.config.js"
const { defineConfig } = require('@playwright/test');
const reportingLabs = require('./reporting-labs.config');

module.exports = defineConfig({
  reporter: [
    ['list'],
    ['reporting-labs', reportingLabs],
  ],
});
```

</TabItem>
</Tabs>

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

<Tabs groupId="js-ts">
<TabItem value="ts" label="TypeScript" default>

```ts title="tests/checkout.spec.ts"
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

</TabItem>
<TabItem value="js" label="JavaScript">

```js title="tests/checkout.spec.js"
const { test, expect } = require('@playwright/test');
const { meta, log, testData } = require('reporting-labs');

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

</TabItem>
</Tabs>

- **`meta({ ... })`** — sets priority, owner, feature and any custom keys. The report uses these for filters, the Owner leaderboard and the Failure by owner chart.
- **`log('opening checkout')`** — a step message shown inline in the test detail view.
- **`testData({ user, card, total }, 'Cart')`** — pinned JSON block, sensitive values masked automatically.

All three are optional. A test with no `meta()` still shows up — the report just cannot rank it by priority.

## Auto-capture API calls

Add one import (or `require`) to the top of your Playwright config:

<Tabs groupId="js-ts">
<TabItem value="ts" label="TypeScript" default>

```ts title="playwright.config.ts"
import 'reporting-labs/auto';
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js title="playwright.config.js"
require('reporting-labs/auto');
```

</TabItem>
</Tabs>

Every `request.get / post / put / delete / ...` call your tests make is recorded automatically — method, URL, status, response body, timing. Nothing else to change.

![API tab with captured requests](/img/screenshots/05-api-light.png)

## JavaScript vs TypeScript — anything different?

Nothing that changes what you write against the reporter.

|  | TypeScript | JavaScript |
|---|---|---|
| Install command | `npm i -D reporting-labs` | `npm i -D reporting-labs` |
| Config filename | `playwright.config.ts` | `playwright.config.js` |
| Reporter config | `reporting-labs.config.ts` | `reporting-labs.config.js` |
| Import style | `import { meta } from 'reporting-labs'` | `const { meta } = require('reporting-labs')` |
| Auto-capture | `import 'reporting-labs/auto'` | `require('reporting-labs/auto')` |
| Type hints for options | ✅ shipped as `.d.ts` | – (still works, just no autocomplete) |
| ESM projects (`"type": "module"`) | ✅ | ✅ (use `import` in `.mjs` too) |
| Runtime helpers (`meta`, `log`, `testData`, `api`) | Same signature | Same signature |
| Report output | Identical HTML | Identical HTML |

The package ships both compiled JavaScript (`dist/*.js`, CommonJS) and TypeScript declarations (`dist/*.d.ts`). Node picks the JavaScript at runtime; your editor uses the declarations when writing TypeScript.

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
