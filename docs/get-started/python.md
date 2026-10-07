---
title: Python — pick your stack
sidebar_label: Python overview
sidebar_position: 4
---

# Get started: Python

One report, any Python stack. reportingLabs ships a single package,
[`reporting-labs`](https://pypi.org/project/reporting-labs/), that plugs into **pytest** and
**Robot Framework** and adds zero-code support for **Playwright**, **Selenium** and **Appium** on top.

Pick the guide for your stack; each one is complete on its own, from `pip install` to the open report:

| Your stack | Guide |
|---|---|
| pytest (API tests, unit tests, anything) | [pytest](/get-started/python/pytest): install and go. Outcomes, meta, logs, `requests` / `httpx` in the API tab. |
| Playwright + pytest | [Playwright + Python](/get-started/python/playwright): add `pytest-playwright`, nothing else. Every action a step, screenshots, trace and video. |
| Selenium + pytest | [Selenium + Python](/get-started/python/selenium): add `selenium`, nothing else. Every command a step, a screenshot on failure. |
| Robot Framework | [Robot Framework](/get-started/python/robot): one `--listener` flag. A row per test, keywords as steps, tags as filters. |
| pytest-bdd (Gherkin) | [pytest → pytest-bdd](/get-started/python/pytest#pytest-bdd-gherkin): nothing to set up. A row per scenario at its `.feature` line, Given / When / Then as steps, like a Cucumber report (0.1.7+). |

Every language port renders the same HTML template, so a Python report looks exactly like a Node.js or
Java one and a whole company triages the same way.

![Python-generated report — Overview tab](/img/screenshots/py-overview-light.png#light)
![Python-generated report — Overview tab, dark](/img/screenshots/py-overview-dark.png#dark)

## Install

```bash
pip install reporting-labs
```

That is the whole setup for pytest: the plugin turns on the moment the package is installed. For Robot
Framework, add one listener flag (see its guide).

## Run and open the report

```bash
pytest
open reporting-labs/index.html    # macOS
# xdg-open reporting-labs/index.html   # Linux
# start   reporting-labs\index.html    # Windows
```

The report is one self-contained HTML file. No server, no login, no Node at run time. Run the suite twice
to see the trend, new-vs-known failures and flaky detection.

## Add detail (optional)

Mark a test and call a few helpers. Everything is optional; a bare run still produces a full report.

```python
import pytest
from reporting_labs import meta, log, test_data, step

@pytest.mark.meta(priority="P1", owner="asha", feature="checkout", story="SHOP-231")
def test_checkout(page):
    test_data({"username": "demo", "password": "S3cret"}, "Login")   # sensitive keys masked
    log("cart total before coupons: 99.00")
    with step("Apply coupon"):
        ...
```

`meta` drives the Needs-attention ranking, the Breakdown charts and the per-test chips; `log`,
`test_data`, `step`, `api` and `attach` add a timeline, data blocks, nested steps, API calls and files.

## Turn it off

For one run: `pytest -p no:reporting_labs` or `pytest --no-rl`.
