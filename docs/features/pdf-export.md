---
title: PDF export
sidebar_position: 8
---

# PDF export

Every report can become a clean, **client-shareable PDF** — the same theme, charts, clusters and screenshots you see in the browser, laid out for paper. Two ways to get it, and both produce the same document:

- **Export PDF button** — top-right of the report, next to the theme switch. Click it, then *Save as PDF* in the print dialog. Zero setup, works in any browser.
- **Auto-generated `report.pdf`** — written next to `index.html` at the end of every run, so CI can attach it or email it without anyone opening the report.

## What's in it

The PDF is an **executive summary**, not a dump of every step — so it stays small and readable whether the suite has 20 tests or 2,000:

1. **Cover** — title, project, run metadata, a verdict line and the pass / fail / flaky / skipped counts.
2. **Overview** — the pass-rate donut and the environment.
3. **Test analytics** — the charts (outcomes by priority, failure categories, duration spread, trend, owner leaderboard).
4. **Failure analysis** — the failure clusters, "needs attention" and a table of every failed or flaky test.
5. **All test cases** — a compact table of every test with its status, spec, priority, owner and duration.
6. **Failure evidence** — for each failed or flaky test: the error, the plain-language explanation and the screenshots. No steps, logs or API calls — those stay in the HTML report.

The PDF is always in the **light theme** (clean on paper and in print), and videos are skipped — everything else is included. Text is never truncated with an ellipsis: on paper there is nothing to click, so every message, path and name is shown in full.

## Auto-generated report.pdf

`report.pdf` is on by default. It is rendered by a headless **Chromium / Chrome**:

- **Node.js** uses the Chromium that Playwright already ships — nothing extra to install.
- **Python** uses Playwright's Chromium if it is installed (`playwright install chromium`), otherwise a Chrome / Chromium found on the machine.
- **Java** uses a Chrome / Chromium found on the machine (set `reporting-labs.chromePath` to point at a specific one).

Generating the PDF is **best-effort**: if no browser is available it is skipped with a short note, and the HTML report — with its **Export PDF** button — is always written regardless.

### Turn it off or rename it

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="lang">
<TabItem value="node" label="Node.js">

```ts title="playwright.config.ts"
reporter: [['reporting-labs', {
  pdf: false,                 // skip report.pdf (the Export PDF button stays)
  // pdf: { file: 'summary.pdf' },   // or rename it
}]],
```

</TabItem>
<TabItem value="python" label="Python">

```ini title="pytest.ini / reporting-labs.toml"
# reporting-labs.toml
pdf = false          # skip report.pdf
# pdfFile = "summary.pdf"
```

</TabItem>
<TabItem value="java" label="Java">

```properties title="reporting-labs.properties"
reporting-labs.pdf=false
# reporting-labs.pdfFile=summary.pdf
# reporting-labs.chromePath=/usr/bin/google-chrome
```

</TabItem>
</Tabs>

## In CI

The auto-generated `report.pdf` is an ordinary file in the output folder — upload it as a build artifact, or attach it to an email or a chat message, so people who never open the HTML still get the whole picture.

```yaml title="GitHub Actions"
- uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: reporting-labs/   # index.html + report.pdf + assets
```
