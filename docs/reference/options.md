---
title: All options
sidebar_position: 1
---

# All options

Every option, defaults inline. Everything is optional.

## Look

| Option | Default | What it does |
|---|---|---|
| `title` | `'Test report'` | Header title |
| `logo` | – | Path to a local PNG/SVG/JPG (embedded), an `https://` URL, or a data URI |
| `accent` | palette accent | Brand accent color, e.g. `'#7C3AED'` |
| `theme` | `'auto'` | `'auto' | 'light' | 'dark'` — viewers can also switch in the header |
| `palette` | `'lab'` | `'lab' | 'ocean' | 'ember' | 'mono'` |
| `customCss` | `''` | Extra CSS appended to the report |
| `embedFonts` | `true` | Inline IBM Plex woff2 (~140 KB, offline-safe) |

## Header details

| Option | Default | What it does |
|---|---|---|
| `metadata` | – | `Record<string, string>` shown as chips in the header; `build` labels the run in the history. The environment name is also read from the process environment and wins over `env` here: `ENV`, `TEST_ENV`, `APP_ENV`, `TARGET_ENV`, `CI_ENVIRONMENT_NAME` and friends, or any variable whose name ends in `_ENV` / `_ENVIRONMENT` (`OPENCART_ENV`, `app_env`). A config that says `local` still labels a pipeline's reports `dev`, `qa`, `stage` with no config change |
| `envVar` | – | Name of the variable that holds the environment name, for a project whose name the detection cannot guess (`envVar: 'TARGET'`) |
| `project` | – | `{ name, version, team, url, description }` block under the title |
| `sections` | – | Extra `{ title, html }[]` sections rendered below the summary |

## Runtime overrides

Variables the reporter owns, read at run time and winning over the config, so a pipeline can label a run without touching `playwright.config.ts`:

| Variable | Sets |
|---|---|
| `REPORTING_LABS_METADATA_<KEY>` | The header chip `<key>`: `REPORTING_LABS_METADATA_ENV=qa`, `REPORTING_LABS_METADATA_RELEASE=2.3` |
| `REPORTING_LABS_TITLE`, `REPORTING_LABS_THEME`, `REPORTING_LABS_PALETTE`, `REPORTING_LABS_ACCENT`, `REPORTING_LABS_LOGO` | The option of the same name |
| `REPORTING_LABS_OUTPUT_FOLDER` | `outputFolder`: one report folder per shard when several shards run at once in the same checkout (Node.js from 0.6.14, Python reads it too; in Java use `-Dreporting-labs.outputFolder=...`) |

The env chip resolves in this order, first match wins:

1. `REPORTING_LABS_METADATA_ENV`
2. The variable named by `envVar`
3. `ENV`, `TEST_ENV`, `ENVIRONMENT`, `APP_ENV`, `TARGET_ENV`, `RUN_ENV`, `DEPLOY_ENV`, `ENV_NAME`, `TEST_ENVIRONMENT`, `TARGET_ENVIRONMENT`, `CI_ENVIRONMENT_NAME`, `DEPLOYMENT_ENVIRONMENT`, `STAGE`, then any variable whose name ends in `_ENV` or `_ENVIRONMENT`. `GITHUB_ENV`, `NODE_ENV`, `VIRTUAL_ENV` and other system variables are never used, and a value only counts when it looks like an environment name (a short token such as `dev`, `app_qa`, `stage-2`)
4. `metadata.env` in the config

## Output

| Option | Default | What it does |
|---|---|---|
| `outputFolder` | `'reporting-labs'` | Where index.html and copied attachments go |
| `outputFile` | `'index.html'` | Report file name |
| `emitJson` | `true` | Also write `report.json` (used by `merge` for sharded runs) |
| `jsonFile` | `'report.json'` | File name of the JSON blob |
| `pdf` | `true` | Also write a print-ready [`report.pdf`](../features/pdf-export.md), printed by Playwright's Chromium or an installed Chrome / Edge, whatever browser the tests ran on. `false` to skip, `{ file }` to rename, `{ chromePath }` to name the browser |
| `embedAttachments` | `true` | Screenshots inside the HTML (single file) |
| `embedLimit` | `2 * 1024 * 1024` | Bigger attachments are copied as files |
| `embedVideos` | `false` | Videos inside the HTML too (bigger file, no folder issues) |

## Test details

| Option | Default | What it does |
|---|---|---|
| `dimensions` | `['priority','severity','feature','owner']` | Meta keys treated as chart/filter dimensions |
| `dimensionOrder` | `{}` | Custom value ordering per dimension |
| `links` | `{}` | Turns meta values into links, e.g. `{ story: 'https://acme.atlassian.net/browse/{id}' }`. An object `{ url: '...{p}...{id}', display: '{id}' }` builds the URL from the fields of an object passed to `meta()` and shows only `display` |
| `maskKeys` | – | Extra key names whose values are masked, in data blocks, API panels and free text alike (passwords, tokens, API keys, cookies, JWTs, Bearer values are always masked) |
| `maskValues` | – | Literal values to blank wherever they appear, keyed or not: `[process.env.PASSWORD]` |
| `maskFromEnv` | `true` | Learn the values of environment variables whose names look sensitive (`PASSWORD`, `API_TOKEN`, `OAUTH_CLIENT_SECRET`) and blank them everywhere. The masker also remembers every value it masks, so a secret seen once as `password=x` is blanked later in `Logging in as admin / x` |
| `env` | – | Extra rows on the Environment card |
| `editorLinks` | on locally, off in CI | "Open in VS Code" links |
| `bdd` | auto | Style Given/When/Then steps as Gherkin |
| `announce` | `true` | Print the report path to the console after the run |
| `warnMissingMeta` | `true` | Console list of tests without `meta()` |
| `commentMeta` | `true` | Read meta from a comment right above a test or describe (`/** @owner naveen @priority P0 */`; a docstring in Python). `meta()` wins over it |
| `open` | `'on-failure'` | Open report in browser: `'on-failure' | 'always' | 'never'` |

## History

| Option | Default | What it does |
|---|---|---|
| `history` | `{ enabled: true, keep: 30 }` | Rolling history file. `file` sets a custom path |

## Widgets

| Option | Default | What it does |
|---|---|---|
| `widgets.runStrip` | `true` | Every test as one small cell in run order |
| `widgets.outcome` | `true` | Donut ring |
| `widgets.attention` | `true` | Needs attention list |
| `widgets.dimensions` | `true` | Breakdown bars |
| `widgets.timeline` | `true` | Timeline view |
| `widgets.durations` | `true` | Duration histogram |
| `widgets.tags` | `true` | Tags tab in Breakdown |
| `widgets.slowest` | `true` | Slowest tests card |
| `widgets.projects` | `true` | Per-project rollup |
| `widgets.flaky` | `true` | Flakiest tests over history |
| `widgets.environment` | `true` | Environment card |
| `widgets.skipped` | `true` | Skipped tests with reasons |
