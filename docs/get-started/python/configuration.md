---
title: Configuration (Python)
sidebar_label: Configuration
description: Every reportingLabs option for pytest, pytest-bdd and Robot Framework, where to put it, and which setting wins.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configuration

Everything is optional: the report works with no config at all. When you want to change something, put the options in **one file**, the Python equivalent of `reporting-labs.config.ts` in Node.js. The options are the same in every language; only the file is different.

## Where to put the options

<Tabs groupId="py-config">
<TabItem value="json" label="reporting-labs.config.json" default>

```json title="reporting-labs.config.json (next to where you run pytest)"
{
  "title": "Checkout regression",
  "project": { "name": "ShopLite", "version": "2.4.0", "team": "QA Platform" },
  "metadata": { "env": "qa", "build": "#1842" },
  "links": { "story": "https://acme.atlassian.net/browse/{id}" },
  "maskKeys": ["otp", "pan"],
  "history": { "enabled": true, "keep": 30 },
  "pdf": true
}
```

</TabItem>
<TabItem value="toml" label="pyproject.toml">

```toml title="pyproject.toml"
[tool.reporting-labs]
title = "Checkout regression"
links = { story = "https://acme.atlassian.net/browse/{id}" }
mask_keys = ["otp", "pan"]          # snake_case works too
warn_missing_meta = false

[tool.reporting-labs.project]
name = "ShopLite"
version = "2.4.0"
```

</TabItem>
</Tabs>

- Keys can be written `camelCase` (as in Node.js) or `snake_case`.
- The files are read from pytest's root folder (where `pytest.ini` / `pyproject.toml` is), or from the folder you run `robot` in. Paths inside them (a `logo` file, `history.file`) are relative to the config file.
- Another file? Use `--rl-config path.json`, `reporting_labs_config = path.json` in `pytest.ini`, or `REPORTING_LABS_CONFIG=path.json`.

### Which setting wins

From weakest to strongest:

1. The defaults
2. `[tool.reporting-labs]` in `pyproject.toml`
3. `reporting-labs.config.json`
4. pytest options in `pytest.ini` / `pyproject.toml` `[tool.pytest.ini_options]`, then `--rl-*` flags on the command line (or the Robot listener arguments)
5. Environment variables: `REPORTING_LABS_TITLE`, `_THEME`, `_PALETTE`, `_ACCENT`, `_LOGO`, `_OUTPUT_FOLDER`, `_OPEN`, and `REPORTING_LABS_METADATA_<KEY>` for a header chip

So CI can label a run without touching any file: `REPORTING_LABS_METADATA_ENV=qa REPORTING_LABS_TITLE="Nightly" pytest`.

## pytest command line and ini options

| Flag | ini option | What it does |
|---|---|---|
| `--rl-title "Nightly"` | `reporting_labs_title` | Report title |
| `--rl-output reports/rl` | `reporting_labs_output` | Output folder |
| `--rl-project web` | `reporting_labs_project` | Project name on every row (header and heatmap) |
| `--rl-config path.json` | `reporting_labs_config` | Another config file |
| `--no-rl` | `reporting_labs = false` | Turn the report off for this run (`-p no:reporting_labs` works too) |
| `--rl` | | Turn it back on when the ini turns it off |

```ini title="pytest.ini"
[pytest]
reporting_labs_title = Checkout regression
reporting_labs_output = reports/reporting-labs
```

## Robot Framework listener options

Options go after the listener name, separated by colons:

```bash
robot --listener reporting_labs.RobotListener:title=Checkout:output=reports/rl:project=Web:palette=ocean tests/
```

`title`, `output` (or `outputFolder`), `project` and `config` (a config file) are the usual ones. Any other option whose value is text works the same way (`palette=ocean`, `theme=dark`). Put lists, objects and true/false options in `reporting-labs.config.json`, which the listener reads too.

## All options

| Option | Default | What it does |
|---|---|---|
| **Look** | | |
| `title` | `"Test report"` | Title in the header |
| `logo` | – | Your logo next to the title: a file next to the config (embedded) or an `https://` URL |
| `palette` | `"lab"` | `"lab"` (blue), `"ocean"`, `"ember"`, `"mono"`; viewers can switch |
| `accent` | palette accent | Your brand color, e.g. `"#7C3AED"` |
| `theme` | `"auto"` | `"auto"` (follows the OS), `"light"`, `"dark"` |
| `customCss` | `""` | CSS appended to the report |
| `embedFonts` | `true` | Bundle the fonts (~140 KB) so the report looks the same offline |
| **Header** | | |
| `project` | – | `{ "name", "version", "team", "url" }` under the title |
| `metadata` | `{}` | Header chips, e.g. `{ "env": "qa", "build": "#1842" }`. `build` labels the run in the trend |
| `envVar` | – | Variable that holds the environment name, when it is not `ENV`, `TEST_ENV`, `APP_ENV` or `*_ENV` |
| `env` | `{}` | Extra rows on the Environment card |
| `sections` | `[]` | Extra HTML blocks below the summary: `[{ "title": "...", "html": "..." }]` |
| **Meta and filters** | | |
| `dimensions` | `["priority", "severity", "feature", "owner"]` | Meta keys with a Breakdown chart and a filter. Add your own, e.g. `"team"` |
| `dimensionOrder` | P0…P4, blocker…trivial | Order of values in charts and filters, e.g. `{ "severity": ["high", "medium", "low"] }` |
| `links` | `{}` | Turn meta values into links: `{ "story": "https://acme.atlassian.net/browse/{id}" }` |
| `commentMeta` | `true` | Read meta from docstrings and `#` comments (`@priority P0 @owner asha`) |
| `warnMissingMeta` | `true` | After the run, list the tests that have no meta |
| **Secrets** | | |
| `maskKeys` | `[]` | Extra key names to mask, e.g. `["otp", "pan"]` |
| `maskValues` | `[]` | Exact values to mask wherever they appear |
| `maskFromEnv` | `true` | Learn the values of `PASSWORD`, `*_TOKEN`, `*_SECRET` environment variables and mask them everywhere |
| **What is recorded** | | |
| `captureApi` | `true` | Record every `requests` / `httpx` call in the API tab |
| `apiMaxBody` | 64 KB | Bytes of a request or response body kept |
| `stepsFromTools` | `true` | Playwright and Selenium actions as steps (with pytest-bdd: nested under the Gherkin step) |
| `bdd` | auto | Style Given / When / Then steps as Gherkin. On by itself for pytest-bdd |
| `widgets` | all on | Hide cards: `{ "timeline": false, "tags": false }` |
| `editorLinks` | on locally, off in CI | "Open in VS Code" links |
| `expandFailedSteps` | `true` | When a failed test is opened, the steps that lead to the failure are open. `false`: every step with sub-steps starts collapsed, also on failures. **Expand all / Collapse all** above the steps works either way. Needs npm 0.6.15+, Maven 0.1.29+ or PyPI 0.1.8+ |
| **Output** | | |
| `outputFolder` | `"reporting-labs"` | Where the report goes |
| `outputFile` | `"index.html"` | Report file name |
| `emitJson` | `true` | Also write `report.json` |
| `jsonFile` | `"report.json"` | Its file name |
| `embedAttachments` | `true` | Screenshots inside the HTML (one file) |
| `embedLimit` | 2 MB | Bigger attachments are copied to `assets/` |
| `embedVideos` | `false` | Videos inside the HTML too |
| `pdf` | `true` | Also write a print-ready `report.pdf` |
| `pdfFile` | `"report.pdf"` | Its file name |
| `chromePath` | – | The Chrome / Edge / Chromium that prints the PDF, when it is not found on its own (or `CHROME_PATH`) |
| `history` | `{ "enabled": true, "keep": 30 }` | Run history for the trend and flaky detection; `file` sets the path (default `reporting-labs.history.json`) |
| `announce` | `true` | Print the report path after the run |
| `open` | `"on-failure"` | Open the report after the run: `"on-failure"`, `"always"`, `"never"`. Never in CI |

## With pytest-bdd

Every option above works the same for pytest-bdd scenarios. A few that matter most there:

- `stepsFromTools: false` keeps the Given / When / Then steps but drops the Playwright actions under them.
- `maskKeys` also masks the matching column of a Scenario Outline's **Examples** block; `maskValues` and `maskFromEnv` mask the values in step titles too.
- `links` turns a tag like `@story:SHOP-12` into a link.
- `--rl-project` overrides the browser that would otherwise be the project.

## Related

- [pytest](./pytest.md), [pytest-bdd](./pytest.md#pytest-bdd-gherkin), [Robot Framework](./robot.md)
- The same options for [Node.js](../../reference/options.md) and [Java](../java/configuration.md)
