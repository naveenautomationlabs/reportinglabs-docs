---
title: Cypress
sidebar_position: 3
description: The reportingLabs report for Cypress — tests, retries, commands as steps, API calls, screenshots, video, plain-language errors and PDF.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cypress

The same reportingLabs report, from `cypress run`:
- **Tests:** each test under its describe block, every retry as its own attempt (so flaky tests are found), passed / failed / skipped, and a spec that could not load.
- **Steps:** Cypress commands as steps, hooks grouped, chained commands and assertions nested, the failing command marked.
- **API tab:** `cy.request` calls with request and response, and the app's own fetch / XHR calls.
- **Proof:** failure screenshots on the attempt they belong to, and the spec video.
- **Errors in plain words:** element not found, covered / hidden / disabled element, `cy.request` / `cy.visit` / `cy.wait` failures, errors thrown by the app, a spec with a broken import.
- **Same as everywhere:** meta, failure clusters, history and trend, [PDF](../features/pdf-export.md), masking of secrets, [merge](../features/sharding.md) of split runs.

Works with Cypress 13, 14, 15 and 16. Needs npm `reporting-labs` 0.6.17+.

![A Cypress test in the report: hook, commands, assertions and API calls](/img/screenshots/cy-steps-api-light.png)

## Install

```bash
npm i -D reporting-labs@latest
```

The same package as the Playwright reporter; the Cypress parts are `reporting-labs/cypress` and `reporting-labs/cypress/support`.

## Step 1. Register the plugin

<Tabs groupId="js-ts">
<TabItem value="js" label="cypress.config.js" default>

```js title="cypress.config.js"
const { defineConfig } = require('cypress');
const { reportingLabs } = require('reporting-labs/cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      reportingLabs(on, config, { title: 'Checkout regression' });
      return config;
    },
  },
});
```

</TabItem>
<TabItem value="ts" label="cypress.config.ts">

```ts title="cypress.config.ts"
import { defineConfig } from 'cypress';
import { reportingLabs } from 'reporting-labs/cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      reportingLabs(on, config, { title: 'Checkout regression' });
      return config;
    },
  },
});
```

</TabItem>
</Tabs>

Keep `return config;`: it is how the plugin tells the support file (step 2) that it is switched on.

## Step 2. Import the support file

```js title="cypress/support/e2e.js (or e2e.ts)"
import 'reporting-labs/cypress/support';
```

This is what brings the steps, the API calls, the error of every attempt and `meta()`. Without it the report still works (tests, retries, the last error, screenshots, video), and the run tells you how to add it.

## Step 3. Run

```bash
npx cypress run
```

The report is in `reporting-labs/index.html` (and `report.json`, `report.pdf`). Open it in any browser.

![Overview of a Cypress run](/img/screenshots/cy-overview-light.png)

## Add meta: owner, priority, story

With `meta()` in the test:

```js
import { meta } from 'reporting-labs/cypress/support';

describe('Checkout', () => {
  it('places an order', () => {
    meta({ priority: 'P0', severity: 'critical', owner: 'asha', story: 'SHOP-12' });
    cy.visit('/cart');
  });
});
```

Or as a [comment](../features/meta-comments.md) above `it()` or `describe()`, no import needed:

```js
/** @feature checkout @owner asha */
describe('Checkout', () => {
  /** @priority P0 @severity critical @story SHOP-12 */
  it('places an order', () => { cy.visit('/cart'); });
});
```

`@smoke`-style words in a test title become tags. If a test has both, `meta()` wins.

## Errors in plain words

Every failure gets a short reason next to Cypress's own message, the line in your spec and the code around it. A failure in a `before` hook says so, and the tests Cypress skipped because of it are marked skipped with the reason.

![A cy.visit failure in a before hook, explained](/img/screenshots/cy-error-light.png)

## Options

Every option on [All options](../reference/options.md) works here, in the third argument of `reportingLabs()`. A few that matter for Cypress:

| Option | Default | What it does |
|---|---|---|
| `video` | `'failed'` | The spec video (Cypress records one per spec, with `video: true` in the Cypress config) is attached to failed and flaky tests. `'all'`: every test. |
| `embedAttachments` | `true` | Screenshots inside the HTML; bigger than `embedLimit` (2 MB): copied to `assets/` |
| `embedVideos` | `false` | The video inside the HTML too |
| `commentMeta` | `true` | Read meta from comments above `it()` / `describe()` |
| `pdf` | `true` | Also write `report.pdf`, printed by an installed Chrome or Edge. Cypress's own Electron cannot print it: if no Chrome is found, set `pdf: { chromePath }` or `CHROME_PATH`. |

The `REPORTING_LABS_*` [runtime overrides](../reference/options.md#runtime-overrides) work too, e.g. `REPORTING_LABS_METADATA_ENV=qa npx cypress run`.

## Good to know

- **Your config already uses `before:run`, `after:spec` or `after:run`?** Cypress keeps one handler per event: the one registered last wins. Call ours from yours, with the handlers `reportingLabs()` returns:
  ```js
  const rl = reportingLabs(on, config, { title: 'Checkout regression' });
  on('after:spec', (spec, results) => {
    rl.afterSpec(spec, results);
    // your own after:spec code
  });
  ```
  `rl.beforeRun` and `rl.afterRun` work the same way. If ours was replaced and no report is written, the run prints this hint.
- **Your own tasks** (`on('task', …)`) are not affected: Cypress merges tasks.
- **`cypress open`:** Cypress sends the run events in `cypress run`. In `cypress open` it sends them only with `experimentalInteractiveRunEvents: true` in the Cypress config.
- **Videos** are H.264 MP4 files: they play in Chrome, Edge, Safari and Firefox.
- **Secrets:** a value typed into a password field is masked in the steps; passwords, tokens and auth headers in `cy.request` and app calls are masked like everywhere else. Screenshots and videos are not masked.
- **Split runs** (Cypress Cloud parallel, cypress-split, several CI machines): each machine writes its `reporting-labs` folder, then `npx reporting-labs merge` makes one report. See [Sharding](../features/sharding.md).
