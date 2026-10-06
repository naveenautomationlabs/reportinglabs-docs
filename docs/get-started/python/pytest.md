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
`pyproject.toml`. See [Configuration](/reference/options) for every key. A quick one:

```json
{
  "title": "Checkout regression",
  "project": { "name": "ShopLite", "version": "2.4.0", "team": "QA Platform" },
  "metadata": { "env": "local" }
}
```

The environment chip is found for you from `ENV`, `TEST_ENV`, `APP_ENV` or any `*_ENV` variable, so a
config that says `local` still labels the pipeline's reports `dev`, `qa`, `stage`.
