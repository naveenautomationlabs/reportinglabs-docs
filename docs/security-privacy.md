---
title: Security & privacy
sidebar_label: Security & privacy
sidebar_position: 2
description: What reportingLabs reads, what it writes, what it sends over the network (nothing), how secrets are masked, and what to tell a client.
---

# Security & privacy

reportingLabs is an **open-source library that runs inside your own test run**. There is no reportingLabs server, no account, no API key, no telemetry and no licence check. **Your test results, logs and screenshots are never sent to reportingLabs or to anyone else** — the report is a set of files written to a folder on the machine that ran the tests.

This page is written for security reviewers, QA leads and anyone who has to answer "where does our test data go?". Every statement below can be checked in the public source code.

<small>Applies to: npm `reporting-labs` 0.6.x, PyPI `reporting-labs` 0.1.x, Maven Central `dev.reportinglabs` 0.1.x · Last reviewed: October 2026</small>

## At a glance

| Question | Answer |
| --- | --- |
| Where does it run? | Inside your test process — your laptop or your CI runner. |
| What does it send over the network? | **Nothing.** No telemetry, analytics, crash reporting, update checks or licence checks. |
| Where is the data stored? | In files in your project's output folder (see [What it writes](#what-it-writes)). |
| Who can access it? | Whoever can access those files: your file system, your CI artifact permissions, wherever you choose to share the report. |
| Runtime dependencies | **None** for Node.js, Python and the Java core. |
| Install / post-install scripts | **None.** |
| Licence and cost | **MIT**, free for commercial use. No paid tier, no usage limits. |
| Source | Public on GitHub: [Node.js](https://github.com/naveenautomationlabs/reporting-labs) · [Java](https://github.com/naveenautomationlabs/reporting-labs-java) · [Python](https://github.com/naveenautomationlabs/reporting-labs-python) |

## What it reads

During a run the reporter collects, in memory:

- **Test results** from your framework: names, files and lines, describe/class hierarchy, outcome, duration, retries, steps and hooks.
- **Failures:** error messages, stack traces and, where available, the failing source lines.
- **Console output** written by each test (stdout / stderr).
- **What you add yourself** with the optional helpers: `meta()`, `log()`, `step()`, `testData()` / `test_data()`, `api()`.
- **API calls your tests already make** through supported clients (Playwright `APIRequestContext`, REST Assured, `requests`, `httpx`): method, URL, status, timing, headers and bodies. The reporter **records** these calls; it does not make any calls of its own.
- **Attachments** your framework produces or that are captured on failure: screenshots, traces, videos.
- **Environment:** OS, runtime and tool versions; the CI provider and run link (from the standard CI environment variables); and the current commit and branch, read with local `git` commands (`git log -1`, `git rev-parse --abbrev-ref HEAD`, `git config --get remote.origin.url`).

## What it writes

Everything is written to a local folder — `reporting-labs/` by default, `target/reporting-labs/` in Maven projects:

| File | Contents | Turn off / change |
| --- | --- | --- |
| `index.html` | The report — one self-contained file | — |
| `report.json` | The same data, machine-readable (used by `merge` for shards) | `emitJson: false` |
| `report.pdf` | A print-ready copy of the report | `pdf: false` |
| `assets/` | Attachments too large to embed in the HTML | `embedAttachments`, `embedLimit` |
| `reporting-labs.history.json` | For each recent run: totals, and each test's outcome and duration — used for the trend, flaky and "new vs known" views | `history: { enabled: false }` |

Nothing is written anywhere else, and nothing is uploaded. (Option names are the Node.js / Python ones; Java uses the same names as `reporting-labs.*` properties where supported — see the Java configuration page.)

## Network

**The library makes no outbound network requests.** Its only traffic is the traffic your tests already generate.

**Opening a report makes no external requests by default.** Fonts, styles, scripts and the logo are embedded in the HTML, so the report works offline and behind a firewall. We verify this by opening a generated report in Chromium, clicking through every tab and recording requests: none leave the file.

The exceptions are all opt-in or require a click:

- `embedFonts: false` makes the report load its fonts (IBM Plex) from Google Fonts when it is opened.
- A `logo` given as an `https://` URL is loaded from that URL by whoever opens the report. A logo file path is embedded instead.
- Links in the report — the CI run, the commit on GitHub/GitLab, issue-tracker links you configure, "open in VS Code", trace.playwright.dev — open only when someone clicks them. The report never uploads a trace or any other file.

Processes the reporter starts on the local machine: `git` (commit info), the default browser to open the report when `open` is set (never in CI), and a headless Chromium / Chrome to render `report.pdf` from the local HTML file.

## Secrets masking

Before anything is written, sensitive values are replaced with `****` in request and response headers and bodies, logs, test data, error messages, step titles and console output:

- **Sensitive field names:** `password`, `passwd`, `pwd`, `secret`, `token`, `apikey` / `api_key` / `api-key`, `authorization`, `auth`, `cookie`, `set-cookie`, `session`, `credential`, `private`, `ssn`, `cvv`, `card` — plus any you add with `maskKeys`.
- **Secret-looking values anywhere in the text:** `Bearer` / `Basic` / `Digest` / `Token` credentials, JWTs, Stripe-style keys, GitHub, GitLab, npm, Slack and SendGrid tokens, AWS access key IDs, Google API keys and OAuth tokens, and card numbers that pass the Luhn check.
- **Known values:** anything you list in `maskValues`, secret-looking environment variables (on by default; `maskFromEnv: false` to disable), and any value once it has been seen in a sensitive field — so a password masked in a request body is also masked where it reappears in a log.
- Values typed into password fields are shown as `****` in step titles by the Selenium add-ons (Java and Python), the Python Playwright integration and the WebdriverIO reporter. With Playwright on Node.js or Java, a value passed to `fill()` appears in the step title unless it is a known secret — read test passwords from environment variables (masked by default) or list them in `maskValues`.

:::caution Screenshots, videos and traces are not masked
Masking works on text. Screenshots, videos and traces are pictures and recordings of the application, and contain whatever was on screen. If your tests display real personal or customer data, run them against test data, or turn screenshots, video and traces off for those suites.
:::

## Using reportingLabs on client projects

Points you can share with a client or a security team:

- reportingLabs is a **test-reporting library**, in the same category as Playwright's built-in HTML reporter or Allure — **not a hosted service**. It runs inside your existing pipeline.
- **No third party receives the client's data.** Reports stay wherever your test artifacts already live, under the same access controls.
- The reportingLabs project **never receives your data**, so it does not act as a data processor for it.
- It is **MIT-licensed open source with no runtime dependencies**, published to npm, PyPI and Maven Central from public source code.
- **Report files should be handled like any other test artifact**: they can contain screenshots, URLs, error messages and console output from the system under test.

Whether you need the client's approval depends on your contract and your client's policy on open-source dependencies, not on anything specific to reportingLabs. Most organisations cover it with their standard open-source approval; this page, the licence and the source code are what that process usually asks for.

## Dependencies and supply chain

- **Node.js** (`reporting-labs`): no runtime dependencies. `@playwright/test` is an optional peer dependency — the one your project already has.
- **Python** (`reporting-labs`): no required dependencies. It works with the pytest, Playwright, Selenium, requests, httpx or Robot Framework your project already installs.
- **Java** (`dev.reportinglabs`): `reporting-labs-core` has no runtime dependencies. The add-ons (Selenium, Playwright, REST Assured, Cucumber) declare those tools as `provided`, so they use the versions already in your build.
- No package runs install or post-install scripts.

## Maintenance, support and exit

- **Maintained by** Naveen AutomationLabs. First release: September 2026. Releases are frequent, and every change is public on GitHub.
- **Support** is through GitHub issues on each repository. There is no paid support tier.
- **Continuity:** the project currently has a single maintainer. Because it is MIT-licensed, you can pin a version, vendor it or fork it at any time.
- **Lock-in is low.** Using the reporter needs no change to your tests, so removing it means removing one dependency and one line of configuration. The optional helper calls (`meta()`, `log()`, `step()`, `Rl.*` in Java) are the only test code you would update. Reports you have already produced are static files and keep working forever, and `report.json` is plain JSON you can convert or archive.

## Reporting a security issue

Please don't put details of a vulnerability in a public issue. Open an issue saying you have a security report, and the maintainer will arrange a private channel.
