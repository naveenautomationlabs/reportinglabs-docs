---
title: Configuration
sidebar_label: Configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configuration

Everything is optional — the report works with zero config. When you want to
tune it, set values in any of **three** places; the highest wins:

1. **System property** on the command line — `-Dreporting-labs.title="Nightly"`
2. **`src/test/resources/reporting-labs.properties`** — the file most teams use
3. **Environment variable** — `REPORTING_LABS_TITLE=Nightly` (dots → underscores, uppercased)

## Where the report lands

One HTML file. The folder is picked to match your build tool, so it's already
gitignored:

| Build tool | Default output | Wiped by |
|---|---|---|
| **Maven** | `target/reporting-labs/index.html` | `mvn clean` |
| **Gradle** | `build/reporting-labs/index.html` | `gradle clean` |
| Neither | `reporting-labs/index.html` (working directory) | — |

Override with `reporting-labs.outputFolder`:

<Tabs groupId="build-tool">
<TabItem value="maven" label="Maven" default>

```bash
mvn test -Dreporting-labs.outputFolder=target/reports/qa
```

</TabItem>
<TabItem value="gradle" label="Gradle">

```gradle title="build.gradle"
test {
  useTestNG()   // or useJUnitPlatform()
  systemProperty 'reporting-labs.outputFolder', "$buildDir/reports/qa"
  systemProperty 'reporting-labs.title', 'Nightly'
}
```

</TabItem>
</Tabs>

Want it to pop open after the run? `reporting-labs.open=on-failure` (or
`always`). Auto-skipped in CI and headless environments.

## Full reference — `reporting-labs.properties`

Copy this as-is; every line is optional.

:::caution Comments go on their own line
`java.util.Properties` has no inline comments — in
`reporting-labs.screenshot=always   # only on pass` the value becomes
`always   # only on pass` and silently matches nothing. From 0.1.21 the
option-style keys tolerate a trailing `# …`, but keep comments on separate
lines anyway; older versions and free-text keys (`title`, `accent`,
`customCss`, `links.*`, …) read the `#` literally.
:::

```properties title="src/test/resources/reporting-labs.properties"
# Look and feel
reporting-labs.title=Nightly regression
# auto: target/ (Maven) or build/ (Gradle)
# reporting-labs.outputFolder=target/reporting-labs
# reporting-labs.outputFile=index.html
# auto | light | dark
reporting-labs.theme=auto
# lab | ocean | ember | mono
reporting-labs.palette=lab
# your logo in the header: a png/jpg/svg file next to this properties file
# (src/test/resources/logo.png), an https URL, or a data URI. Files are
# embedded, so the report stays one self-contained HTML file.
# reporting-labs.logo=logo.png
# brand color, overrides the palette accent
# reporting-labs.accent=#7C3AED
# reporting-labs.customCss=.hdr .title{letter-spacing:.02em}
# inline IBM Plex woff2 (offline-safe)
reporting-labs.embedFonts=true
# "Open in IDE" link per test
reporting-labs.editorLinks=false
# open the report in the browser after the run: never | on-failure | always
reporting-labs.open=never
# copy System.out / System.err lines into each test's Console output
reporting-labs.captureStdout=true

# Selenium (reporting-labs-selenium)
# find the WebDriver on the test instance and record every action as a step
reporting-labs.selenium.autoAttach=true
# screenshot at the end of each test: never | on-failure | always | only-on-pass
reporting-labs.selenium.screenshot=on-failure

# Playwright (reporting-labs-playwright)
# find the Page / BrowserContext / Browser / APIRequestContext on the test instance
reporting-labs.playwright.autoAttach=true
# every action (click, fill, navigate, expect) as a step, read from the trace
reporting-labs.playwright.steps=true
# never | on-failure | always | only-on-pass
reporting-labs.playwright.screenshot=on-failure
# trace.zip, opens in trace.playwright.dev. Off by default: recording snapshots
# costs about 70 ms per short test (a 240-test suite took 54 s instead of 37 s)
reporting-labs.playwright.trace=never
# video needs the context created with RlPlaywright.contextOptions()
reporting-labs.playwright.video=never

# REST Assured (reporting-labs-rest-assured)
# register the recording filter in RestAssured.filters()
reporting-labs.restassured.autoRecord=true

# Cucumber (reporting-labs-cucumber)
# style Given / When / Then as Gherkin in the step list
reporting-labs.bdd=false

# Default capture policy: used by a tool that has no setting above and by
# Rl.shouldCaptureScreenshot() in your own base classes
# reporting-labs.screenshot=on-failure
# reporting-labs.trace=never
# reporting-labs.video=never

# Header
reporting-labs.project.name=ShopLite Web
reporting-labs.project.version=2.4.0
reporting-labs.project.team=QA Platform
reporting-labs.project.url=https://shoplite.example.com
reporting-labs.project.description=Frontend regression suite

# metadata.<name> becomes a header chip; build labels the trend x-axis.
# build / branch / commit / ci are auto-detected in CI, set them only to override.
reporting-labs.metadata.env=staging
reporting-labs.metadata.region=apac
# reporting-labs.metadata.build=ci-4287
# reporting-labs.metadata.branch=release/2.4.0
# reporting-labs.metadata.commit=abc123f

# Make @Story("SHOP-231") etc. clickable. {id} = the annotation value.
reporting-labs.links.story=https://shoplite.atlassian.net/browse/{id}
reporting-labs.links.epic=https://shoplite.atlassian.net/browse/{id}
reporting-labs.links.issue=https://shoplite.atlassian.net/browse/{id}

# Environment card: extra rows, URLs become links. A label with a space needs "\ ".
reporting-labs.env.App\ version=2.4.0
reporting-labs.env.Test\ data=staging-seed-12
reporting-labs.env.Docs=https://reportinglabs.dev

# History and trend
reporting-labs.history.enabled=true
reporting-labs.history.file=reporting-labs.history.json
reporting-labs.history.keep=30

# Data masking: extra case-insensitive substrings to mask in test data, API
# headers and bodies, log lines, console output and error messages, on top of
# the defaults (password, token, authorization, cookie, card, cvv, ...)
# reporting-labs.maskKeys=internalCustomerId,phone
# literal values to blank wherever they appear (pass the real ones from CI: -Dreporting-labs.maskValues=$PASSWORD)
# reporting-labs.maskValues=secret_sauce
# values of PASSWORD / API_TOKEN / *_SECRET environment variables and -D properties are learned automatically
reporting-labs.maskFromEnv=true

# Charts
reporting-labs.dimensions=priority,severity,owner,feature
reporting-labs.dimensionOrder.severity=blocker,critical,major,minor,trivial
reporting-labs.dimensionOrder.priority=P0,P1,P2,P3,P4

# Widgets (all default true)
# reporting-labs.widgets.trend=false
# reporting-labs.widgets.timeline=false
# reporting-labs.widgets.flaky=false

# Extra HTML sections below the summary
# reporting-labs.sections.release.title=Release notes
# reporting-labs.sections.release.html=<p>See <a href="https://example.com/changelog">changelog</a></p>
```

## Option cheat sheet

| Key | Default | What it does |
|---|---|---|
| `title` | `Test report` | Header title |
| `outputFolder` | `target/reporting-labs` (Maven) / `build/reporting-labs` (Gradle) | Where the HTML lands |
| `outputFile` | `index.html` | Report file name |
| `open` | `never` | `never` \| `on-failure` \| `always` — open in browser; skipped in CI/headless |
| `theme` | `auto` | `auto` \| `light` \| `dark` |
| `palette` | `lab` | `lab` \| `ocean` \| `ember` \| `mono` |
| `logo` | reportingLabs mark | Your logo in the header: a png/jpg/svg/gif/webp file (path or test-classpath resource, embedded), an `https://` URL, or a data URI |
| `accent` | palette's | Brand accent hex |
| `customCss` | – | Extra CSS appended to the report |
| `embedFonts` | `true` | Inline IBM Plex woff2 (~140 KB) |
| `editorLinks` | `false` | "Open in IDE" link per test |
| `bdd` | `false` | Gherkin-style Given/When/Then |
| `selenium.screenshot` | `on-failure` | Selenium add-on: screenshot at the end of each test. `never` / `on-failure` / `always` / `only-on-pass` |
| `playwright.steps` | `true` | Playwright add-on: every action as a timed step, read from the trace at the end of the test |
| `playwright.screenshot` | `on-failure` | Playwright add-on: full-page screenshot at the end of each test |
| `playwright.trace` | `never` | Playwright add-on: trace zip. `on-failure` records every test with snapshots and screenshots, which costs about 70 ms per short test; the step list does not need it |
| `playwright.video` | `never` | Playwright add-on: video, when the context was created with `RlPlaywright.contextOptions()` |
| `screenshot`, `trace`, `video` | `on-failure`, `never`, `never` | Defaults for a tool without its own setting, and what `Rl.shouldCaptureScreenshot()` / `Trace()` / `Video()` read in your own base classes |
| `captureStdout` | `true` | Copy `System.out` / `System.err` lines into each test's Console output |
| `selenium.autoAttach` | `true` | Selenium add-on: discover the WebDriver on the test instance (fields, `ThreadLocal`, page objects) and record its actions |
| `restassured.autoRecord` | `true` | REST Assured add-on: add the recording filter to `RestAssured.filters()` |
| `playwright.autoAttach` | `true` | Playwright add-on: discover `Page`, `BrowserContext`, `Browser` and `APIRequestContext` on the test instance (fields, base classes, page objects, factories, `ThreadLocal`) and record them |
| `project.*` | – | `name`, `version`, `team`, `url`, `description` |
| `metadata.<key>` | – | Header chip; `build` labels the trend x-axis |
| `links.<key>` | – | Turn a chip value into a link; `{id}` placeholder |
| `env.<label>` | – | Extra row in the Environment card. A label with a space needs `\ ` in a properties file: `reporting-labs.env.App\ version=2.4.0`. Values that are URLs become links |
| `history.enabled` | `true` | Read/write `reporting-labs.history.json` for the trend |
| `history.file` | `reporting-labs.history.json` | Path, relative to CWD |
| `history.keep` | `30` | Max runs kept |
| `maskKeys` | – | Extra sensitive-key substrings (comma-separated) |
| `maskValues` | – | Literal values to blank wherever they appear, keyed or not (comma-separated) |
| `maskFromEnv` | `true` | Learn the values of environment variables and `-D` properties whose names look sensitive (`PASSWORD`, `API_TOKEN`, `OAUTH_CLIENT_SECRET`) and blank them everywhere |
| `dimensions` | `priority,severity,owner,feature` | Meta keys used in charts + filters |
| `dimensionOrder.<key>` | – | Custom sort order for that dimension |
| `widgets.<name>` | `true` | Turn a card off |
| `sections.<name>.title` / `.html` | – | Custom HTML block below the summary |
| `workers` | *auto* | Real thread count observed; set to force a number |
| `projects` | `java` | Header + heatmap column |

## Auto-detected — you don't set these

**Worker count.** The header shows the number of threads that actually ran
tests. Configure parallelism in Surefire, `testng.xml` or Gradle as usual;
nothing to tell reportingLabs.

**CI metadata.** On a supported CI the `build`, `branch`, `commit` and `ci`
chips fill themselves. Anything you set explicitly still wins.

| Provider | Detected from |
|---|---|
| GitHub Actions | `GITHUB_ACTIONS`, `GITHUB_RUN_NUMBER`, `GITHUB_REF_NAME`, `GITHUB_SHA` |
| Jenkins | `JENKINS_URL`, `BUILD_NUMBER`, `GIT_BRANCH`, `GIT_COMMIT` |
| GitLab CI | `GITLAB_CI`, `CI_PIPELINE_IID`, `CI_COMMIT_REF_NAME`, `CI_COMMIT_SHA` |
| CircleCI | `CIRCLECI`, `CIRCLE_BUILD_NUM`, `CIRCLE_BRANCH`, `CIRCLE_SHA1` |
| Travis CI | `TRAVIS`, `TRAVIS_BUILD_NUMBER`, `TRAVIS_BRANCH`, `TRAVIS_COMMIT` |
| Buildkite | `BUILDKITE`, `BUILDKITE_BUILD_NUMBER`, `BUILDKITE_BRANCH`, `BUILDKITE_COMMIT` |
| TeamCity | `TEAMCITY_VERSION`, `BUILD_NUMBER`, `BUILD_VCS_NUMBER` |
| Azure Pipelines | `TF_BUILD`, `BUILD_BUILDNUMBER`, `BUILD_SOURCEBRANCHNAME`, `BUILD_SOURCEVERSION` |

## Per-run overrides

Command line — wins over the file:

```bash
mvn test \
  -Dreporting-labs.title="Nightly regression" \
  -Dreporting-labs.metadata.env=staging \
  -Dreporting-labs.screenshot=always
```

Environment variables — replace `.` with `_`, uppercase, prefix `REPORTING_LABS_`.
They win over the file and lose to `-D`, so CI can set them without touching the project:

```bash
export REPORTING_LABS_TITLE="Nightly"
export REPORTING_LABS_METADATA_ENV="staging"
export REPORTING_LABS_SCREENSHOT="on-failure"
mvn test
```

## Trend across runs

`reporting-labs.history.json` is written next to your working directory after
every run and read at the start of the next one — that's what draws the
**Trend** card. In CI, cache or persist that file between jobs (an artifact or
a workspace path) so the trend survives fresh checkouts. Recipes:
[GitHub Actions](/ci/github-actions), [Jenkins](/ci/jenkins), [GitLab](/ci/gitlab).

## Source and issues

The Java port lives in its own repository, separate from the Node.js reporter:

- Source and examples: [github.com/naveenautomationlabs/reporting-labs-java](https://github.com/naveenautomationlabs/reporting-labs-java)
- Bugs and requests: [reporting-labs-java/issues](https://github.com/naveenautomationlabs/reporting-labs-java/issues)
- Releases: [reporting-labs-java/releases](https://github.com/naveenautomationlabs/reporting-labs-java/releases) · Maven Central: [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs)
