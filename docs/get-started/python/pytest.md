---
title: pytest + Python
sidebar_label: pytest
---

# pytest + Python

**Install and go.** `reporting-labs` is a pytest plugin that turns on the moment it is installed. Run your
suite as you always do and get a single self-contained HTML report: a row per test, failures explained in
plain words, every `requests` / `httpx` call in the API tab, and a trend across runs.

![Python report — Overview](/img/screenshots/py-overview-light.png#light)
![Python report — Overview, dark](/img/screenshots/py-overview-dark.png#dark)

## Step 1. Install

```bash
pip install reporting-labs
```

Nothing to register, no `conftest.py` change. The plugin is found through pytest's entry points.

## Step 2. Run

```bash
pytest
open reporting-labs/index.html        # run again to see the trend and flaky history
```

Every pytest outcome becomes a row of its own:

| pytest | In the report |
|---|---|
| pass / fail | Passed / Failed, with the failing line and a plain-language reason |
| `pytest.skip` / `skipif` | Skipped, with the reason |
| `xfail` / `xpass` | expected failure (counted as passed) / a failure with a note |
| `pytest-rerunfailures` | Flaky, every attempt kept |
| `pytest-timeout` | Timed out |
| `pytest-xdist` (`-n auto`) | workers merged into one report |
| captured stdout / stderr | on the test, with secrets masked |

## Step 3. Tag your tests (optional)

Use the `meta` marker, or call `meta()` inside the test. Known keys (`priority`, `severity`, `owner`,
`feature`, `epic`, `story`, `issue`, …) get charts, filters and links; any other key shows as a chip.

```python
import pytest
from reporting_labs import meta

@pytest.mark.meta(priority="P1", owner="asha", feature="checkout", story="SHOP-231")
def test_places_order():
    ...

# or from inside the test (handy for parametrized values):
def test_login(username):
    meta(owner="asha", feature="login")
```

### Or write meta in the docstring

Full rules, every framework and the editor snippets: [Meta from comments](../../features/meta-comments.md).

The marker and `meta()` stay the main way. If your team prefers not to add them, put the same values in the
test's docstring, or in `#` comments right above the `def` (and its decorators):

```python
def test_places_order(page):
    """Places an order with a saved card.

    @priority P0  @owner asha  @feature checkout  @story SHOP-231
    @smoke
    """
    ...
```

A docstring on the test class or the module applies to every test inside it, and the test's own wins. `@key value`
pairs become meta (known keys, plus keys in `dimensions` or `links`, so a stray `# TODO @naveen` is ignored); a bare
`@word` becomes a tag. If a test also has the marker or `meta()`, those win. Turn it off with `"commentMeta": false`.

**Type it once, not every time.** `python -m reporting_labs snippets` adds VS Code snippets to `.vscode/`: type `rlmeta`
inside a test and press Tab for the docstring meta (priority as a dropdown), or `rltest` for a whole test with it. Commit
the file and the whole team gets them. Step-by-step for VS Code and PyCharm: [Install the editor snippets](../../features/meta-comments.md#install-the-editor-snippets).

## pytest-bdd (Gherkin)

When pytest-bdd is installed, every scenario reads like a Cucumber report, with nothing to set up (reporting-labs **0.1.7+**, `pip install -U reporting-labs`):

```gherkin title="features/login.feature"
@smoke @owner:asha
Feature: Login

  Background:
    Given the login page is open

  @P1 @critical
  Scenario: Successful login
    When I log in as "admin" with "secret"
    Then I see the dashboard
```

| In the report | From |
|---|---|
| The row **Successful login** at `features/login.feature:8`, grouped under **login** | the scenario's name, file and line |
| Steps **Given the login page is open**, **When I log in as …**, **Then I see the dashboard** | every Gherkin step, Background included; Playwright actions nest under their step |
| The failing step in red, the steps after it as *not run* | the step that raised; `pytest.skip()` in a step skips the scenario the same way |
| An undefined step fails at its `.feature` line, with the step definition to write | pytest-bdd's "step definition not found" |
| **Login with users (admin, secret)** and an **Examples** data block | a Scenario Outline example |
| Data blocks named after the step | a step's data table or doc string (pytest-bdd 8+) |
| priority **P1**, severity **critical**, owner **asha**; tag **smoke** | `@P1`, `@critical`, `@owner:asha`, `@smoke`. `meta()` in a step wins over a tag |
| Project **chromium** | the browser the steps used (pytest-playwright) |

Works with pytest-bdd 6 to 9.

A failed scenario: the failing step is red with the Playwright action that failed under it, the step after it is *not run*, and the screenshot of the page is attached:

![A pytest-bdd scenario in the report: Given / When / Then steps, the failing step in red, the next step not run, and the failure screenshot](/img/screenshots/py-bdd-detail-light.png)

A step's data table becomes a table in the report:

![A pytest-bdd scenario with a data table shown as a table under the steps](/img/screenshots/py-bdd-table-light.png)

## The helpers

Import them from `reporting_labs`. All are no-ops outside a test, so they are safe in shared code.

```python
from reporting_labs import log, test_data, step, api, attach

log("cart total before coupons: 99.00")          # a timestamped line; error/warn are coloured
test_data({"user": "demo", "password": "x"}, "Login")   # a table or key/value block; secrets masked
with step("Apply coupon"):                        # a named step; steps nest, and @step works too
    ...
api(method="POST", url="/v1/orders", status=201, duration=120, response_body=body)   # a manual API row
attach("invoice.pdf", pdf_bytes, "application/pdf")   # any file; images show inline
```

## API tests

Every `requests` and `httpx` call made during a test is recorded automatically — method, URL, status,
timing, headers and bodies — and shows in the test detail and the API tab. Secrets in headers and bodies
are masked. Nothing to wrap.

```python
import requests

@pytest.mark.meta(priority="P1", feature="orders")
def test_create_order():
    r = requests.post("https://api.shop.test/v1/orders", json={"sku": "A1"})
    assert r.status_code == 201
```

![API tab](/img/screenshots/py-api-light.png)

## Parallel runs

```bash
pytest -n auto        # pytest-xdist
```

Workers hand their results to the main process, which writes one merged report. Nothing else to configure.

## Configuration

Drop a `reporting-labs.config.json` next to where you run, or a `[tool.reporting-labs]` table in
`pyproject.toml`. Every key, the `--rl-*` flags and the `pytest.ini` options: [Python configuration](/get-started/python/configuration). A quick one:

```json
{
  "title": "Checkout regression",
  "project": { "name": "ShopLite", "version": "2.4.0", "team": "QA Platform" },
  "metadata": { "env": "local" }
}
```

The environment chip is found for you from `ENV`, `TEST_ENV`, `APP_ENV` or any `*_ENV` variable, so a
config that says `local` still labels the pipeline's reports `dev`, `qa`, `stage`.
