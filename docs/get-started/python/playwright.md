---
title: Playwright + Python
sidebar_label: Playwright + Python
---

# Playwright + Python

**Zero code.** Install `pytest-playwright` and write tests as usual. Every action (goto, click, fill, press,
check, select…), every `expect()` and a screenshot of the failing page land in the report with no wrapper
and no screenshot code. pytest-playwright's trace and video are attached too. The sync and async APIs both
work. Your fixtures and page objects stay exactly as they are.

![Python test detail — Playwright steps, screenshot, logs](/img/screenshots/py-pytest-detail-light.png)

## Step 1. Install

```bash
pip install reporting-labs pytest-playwright
playwright install chromium
```

Both plugins are found through pytest's entry points. Nothing to register.

## Step 2. Run

```bash
pytest --tracing retain-on-failure --video retain-on-failure
open reporting-labs/index.html
```

`--tracing` and `--video` are pytest-playwright's own flags. reportingLabs attaches whatever they leave for
each test, so the failing test carries its trace.zip and video.webm next to the screenshot.

## What lands in the report

- **Every action as a step**, with the locator it ran on and the timing: `page.goto`, `locator("#user").fill`,
  `page.get_by_role(...).click`, and so on. Steps you add with `with step(...)` nest around them.
- **Every `expect()` as a step**, passing or failing, with the matcher.
- **A screenshot of every open page** attached when a test fails.
- **The trace and the video** from pytest-playwright, attached to the test.
- **Plain-language failures**: "locator("#nope") was not on the page within 5s", "the element stayed
  disabled", "the page URL was …, expected …" — above Playwright's own message.
- **Values typed into password fields are masked** in step titles.

```python
import pytest
from playwright.sync_api import Page, expect
from reporting_labs import meta, step, test_data

@pytest.mark.meta(priority="P1", owner="asha", feature="login", story="SHOP-231")
def test_login(page: Page):
    test_data({"username": "demo", "password": "S3cretPw!"}, "Login")   # masked
    page.goto("https://demo.shop.test/")
    with step("Log in"):
        page.fill("#user", "demo")
        page.fill("#password", "S3cretPw!")
        page.click("#login")
    expect(page.locator("#msg")).to_have_text("Welcome demo")
```

## API testing from the browser project

Calls made through Playwright's `APIRequestContext` (`request.get`, `request.post`, …) land in the API tab,
and so do any `requests` / `httpx` calls. See the [pytest guide](/get-started/python/pytest#api-tests).

## Async

The async API is wrapped the same way; `async with step(...)` works. Use your usual async runner
(`pytest-asyncio` or `pytest-playwright`'s async fixtures).
