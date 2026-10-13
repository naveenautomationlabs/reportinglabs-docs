---
title: Cypress
sidebar_position: 3
description: The reportingLabs report for Cypress — tests, retries, commands as steps, API calls, screenshots, video, plain-language errors and PDF. With Cucumber, scenarios with their Given / When / Then steps.
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
- **Cucumber:** with `@badeball/cypress-cucumber-preprocessor`, one row per scenario with its Given / When / Then steps. See [Cucumber](#cucumber).

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

## Cucumber

With [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) (Cypress 13 to 16, esbuild or webpack), each scenario is a report row. Needs npm `reporting-labs` 0.6.18+.

- **Where it is:** under its Feature and Rule, at its line in the `.feature` file, with a Scenario badge.
- **Steps:** Given / When / Then with the Cypress commands each one ran, `Before` / `After` hooks, the failing step marked, and the steps it left unrun greyed out ("not run").
- **Scenario Outline:** each row named after its values, e.g. `Sign in as ravi (ravi, ****, Hello)`, with the row as an **Examples** table. Data tables and doc strings show as test data.
- **Tags:** `@P0` to `@P4` set the priority, `@blocker` / `@critical` / `@major` / `@minor` / `@trivial` the severity, `@owner:asha`, `@story:SHOP-12`, `@feature:checkout` (any meta key) the meta. Any other tag is a tag you can filter on. Feature and Rule tags count for every scenario under them.
- **Errors:** the line in your step definition (webpack) or the step in the feature file (esbuild), plus "Step not defined", "Step defined twice", and a step that returned `"pending"` as the reason the scenario was skipped.
- **Secrets:** a password column in Examples or in a data table is masked, in the table and wherever the value shows up.

![A failed Cucumber scenario: Gherkin steps, the failing step and the step it left unrun](/img/screenshots/cy-cucumber-light.png)

Same two steps as above (plugin and support file), with one rule: **call `reportingLabs()` after `addCucumberPreprocessorPlugin()`**.

<Tabs groupId="js-ts">
<TabItem value="js" label="cypress.config.js" default>

```js title="cypress.config.js"
const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const { reportingLabs } = require('reporting-labs/cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      reportingLabs(on, config, { title: 'Checkout regression' });   // last
      return config;
    },
  },
});
```

</TabItem>
<TabItem value="ts" label="cypress.config.ts">

```ts title="cypress.config.ts"
import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { reportingLabs } from 'reporting-labs/cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      reportingLabs(on, config, { title: 'Checkout regression' });   // last
      return config;
    },
  },
});
```

</TabItem>
</Tabs>

```js title="cypress/support/e2e.js"
import 'reporting-labs/cypress/support';
```

**Why last:** both plugins listen to `before:run`, `after:spec` and `after:run`, and Cypress keeps only the handler registered last. Ours runs the preprocessor's handlers too, so its own messages, JSON and HTML reports keep working. If `reportingLabs()` comes first, the run prints that the report could not be written.

Tags in the feature file:

```gherkin title="cypress/e2e/login.feature"
@feature:auth @owner:asha
Feature: Login

  @smoke @P1
  Scenario: Sign in with a valid user
    Given I open the login page
    When I sign in as "asha" with password "Demo-Pass-123"
    Then I see the heading "Welcome"
```

`meta()` works in a step definition too, and wins over tags:

```js
import { When } from '@badeball/cypress-cucumber-preprocessor';
import { meta } from 'reporting-labs/cypress/support';

When('I place an order', () => {
  meta({ owner: 'ravi', priority: 'P0' });
  cy.request('POST', '/api/orders', { item: 'book' });
});
```

![A Scenario Outline row with its Examples table, the password masked](/img/screenshots/cy-cucumber-outline-light.png)

A runnable example (feature files, Rules, an Outline, a data table, a doc string, a pending step, a step with no definition): [`examples-cypress-cucumber/`](https://github.com/naveenautomationlabs/reporting-labs/tree/main/examples-cypress-cucumber).

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

- **Your config already uses `before:run`, `after:spec` or `after:run`?** Cypress keeps one handler per event: the one registered last wins. Call `reportingLabs()` last, or call ours from yours, with the handlers `reportingLabs()` returns:
  ```js
  const rl = reportingLabs(on, config, { title: 'Checkout regression' });
  on('after:spec', (spec, results) => {
    rl.afterSpec(spec, results);
    // your own after:spec code
  });
  ```
  `rl.beforeRun` and `rl.afterRun` work the same way. If ours was replaced and no report is written, the run says so.
- **Your own tasks** (`on('task', …)`) are not affected: Cypress merges tasks.
- **`cypress open`:** Cypress sends the run events in `cypress run`. In `cypress open` it sends them only with `experimentalInteractiveRunEvents: true` in the Cypress config.
- **Videos** are H.264 MP4 files: they play in Chrome, Edge, Safari and Firefox.
- **Secrets:** a value typed into a password field is masked in the steps; passwords, tokens and auth headers in `cy.request` and app calls are masked like everywhere else. Screenshots and videos are not masked.
- **Split runs** (Cypress Cloud parallel, cypress-split, several CI machines): each machine writes its `reporting-labs` folder, then `npx reporting-labs merge` makes one report. See [Sharding](../features/sharding.md).
