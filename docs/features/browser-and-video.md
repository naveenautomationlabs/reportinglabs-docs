---
title: What the browser saw, and video in step
sidebar_position: 6
---

# What the browser saw, and video in step

Two things on a Playwright test that help you find why a UI test failed without running it again. They work the same in Node.js, Java and Python.

## What the browser saw

While a test runs, reportingLabs listens to the browser and records:

- uncaught JavaScript errors from the app, with their stack,
- `console.error` messages,
- requests that got no response, or got a 4xx or 5xx.

On a failed test they show under **What the browser saw**, each one timed against the failure. A line above the section says how many happened in the 5 seconds before it:

![What the browser saw on a failed test](/img/screenshots/browser-saw-light.png)

Here the test failed on `expect(#total).toHaveText('$89.91')`. The section shows why: the coupon API returned HTTP 500 and the page then crashed reading `cart.total`. Without it, the failure reads as a wrong number on the screen.

A few things are left out on purpose:

- Chrome's own `Failed to load resource` console lines. The request is already listed.
- Requests cancelled because the page navigated away.
- `favicon.ico`.

At most 50 events are kept per test. URLs, messages and stacks are [masked](../security-privacy.md) like everything else. On a passed test, the same section shows below the steps if anything was recorded.

## Video in step with the test

With video on, a test's video sits above its steps:

- Click **▶** on any step to watch that moment.
- Click **Watch the failure** to see the 5 seconds before it.
- The step that is playing lights up as the video runs.

![Video in step with the steps](/img/screenshots/video-sync-light.png)

A ▶ shows only on steps the video covers. Browser launch and set-up before the page opened get none.

## Turning it on

| | What the browser saw | Video |
|---|---|---|
| **Playwright (Node.js)** | `import 'reporting-labs/auto'` at the top of `playwright.config.ts` (the config from `npx reporting-labs init` has it) | `use: { video: 'on' }` or `'retain-on-failure'` |
| **Playwright (Java)** | Nothing to add. Every page reportingLabs finds or attaches is watched. | `browser.newContext(RlPlaywright.contextOptions())` and `reporting-labs.playwright.video=on-failure` |
| **pytest-playwright** | Nothing to add | `pytest --video retain-on-failure` |

Versions: npm 0.6.23, Maven 0.1.34 and PyPI 0.1.13 or later.

Java and Python learn when the video started from the recording itself: the moment the page closed minus the video's length. If a test never closes its page and only the browser is closed, that moment is unknown. The report then uses the first step's time instead, as Node.js does.
