---
title: WebdriverIO
sidebar_position: 2
---

# WebdriverIO

The same reportingLabs report — one row per test, WebDriver commands as steps, failure clusters, the environment card, history/trend, charts and the [PDF export](../features/pdf-export.md) — for a **WebdriverIO** suite (Mocha, Jasmine or Cucumber).

## Install

```bash
npm i -D reporting-labs
```

`reporting-labs` is already in your project for the Playwright reporter; the WebdriverIO entry is the same package, under `reporting-labs/wdio`.

## Wire it into `wdio.conf`

WebdriverIO runs a reporter once per spec/worker, so reportingLabs writes a part per runner and then stitches them into one report in `onComplete`:

```ts title="wdio.conf.ts"
import ReportingLabsReporter, { reportingLabsComplete } from 'reporting-labs/wdio';

export const config = {
  // ...
  reporters: [
    'spec',
    [ReportingLabsReporter, { outputFolder: 'reporting-labs' }],
  ],

  async onComplete() {
    await reportingLabsComplete({
      outputFolder: 'reporting-labs',
      title: 'Web E2E',
      // metadata: { env: 'staging', build: process.env.BUILD_NUMBER },
    });
  },
};
```

That's it. Run your suite and open `reporting-labs/index.html`. A print-ready `report.pdf` is written next to it (see [PDF export](../features/pdf-export.md)).

:::note
Both the reporter and `onComplete` take the same `outputFolder` — keep them in sync. The reporter alone only writes the per-runner parts; `reportingLabsComplete` builds the HTML, JSON and PDF.
:::

## What you get

- **Steps from WebDriver commands** — `open`, `click`, `set value`, `find`, `switch to frame`, alerts, actions and more, nested and timed. Secret-looking values typed into fields are masked.
- **Screenshots on failure** — captured automatically from the live session when a test fails.
- **Plain-language failures** and **failure clusters** — thirty tests that broke the same way read as one problem.
- **Metadata from tags** — put `@P1`, `@critical`, `@owner:asha` (or `@feature:checkout`) in a test or describe title and they become the priority / severity / owner / feature dimensions the dashboard filters and ranks by.

```js title="login.e2e.js"
describe('Checkout @feature:checkout', () => {
  it('pays with a saved card @P1 @owner:asha', async () => {
    await browser.url('/checkout');
    await $('#pay').click();
    await expect($('#done')).toBeDisplayed();
  });
});
```

## Options

The reporter and `reportingLabsComplete` accept the usual reportingLabs options — `title`, `metadata`, `logo`, `theme`, `palette`, `dimensions`, `links`, `maskKeys` / `maskValues`, `history`, `pdf` and more. See the [options reference](../reference/options.md).

| Where | Option | Notes |
| --- | --- | --- |
| reporter | `outputFolder` | Where parts are written (match it in `onComplete`) |
| reporter | `screenshot` | `on-failure` (default) · `off` |
| reporter | `maskKeys` / `maskValues` | Extra things to mask in command values |
| onComplete | `title`, `metadata`, `logo`, … | Everything that shapes the report |
| onComplete | `pdf` | `true` (default) · `false` · `{ file }` |

## CI

Upload the output folder as a build artifact — it holds `index.html`, `report.pdf` and any assets:

```yaml title="GitHub Actions"
- uses: actions/upload-artifact@v4
  with:
    name: e2e-report
    path: reporting-labs/
```
