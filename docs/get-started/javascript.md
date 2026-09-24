---
title: JavaScript / Playwright
sidebar_position: 1
---

# Get started: JavaScript / Playwright

Two commands to install, one line in your Playwright config, done.

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

Run your tests: `npx playwright test`. Open `reporting-labs/index.html` in your browser.

## Tag your tests

Three tiny helpers add the details the report needs. Import them from `reporting-labs`.

```ts
import { test } from '@playwright/test';
import { meta, log, testData } from 'reporting-labs';

test('places an order with a saved card', async ({ page }) => {
  meta({ priority: 'P0', owner: 'naveen', feature: 'checkout', story: 'SHOP-231' });
  await testData({ user: 'demo@shop.io', card: '4242…', total: 99 }, 'Cart');
  await log('opening checkout');
  // your existing Playwright code — no wrappers
});
```

Full details in the [reference](/reference/options).

## Auto-capture API calls

Add one import at the top of your Playwright config file:

```ts
import 'reporting-labs/auto';
```

Every `request.get/post/put/delete/...` call your tests make is recorded automatically, with headers, body, response and timing. Nothing else to change.
