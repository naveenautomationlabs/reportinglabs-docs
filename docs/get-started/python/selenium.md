---
title: Selenium + Python
sidebar_label: Selenium + Python
---

# Selenium + Python

**Zero code.** Install `selenium` and write tests as usual. Every command the driver sends — open, find,
click, type, run script, perform actions, switch window or frame — becomes a step, with the element named by
the locator that found it, and a screenshot of the browser is attached when a test fails. No wrapper, no
`@after` screenshot code, no listener of your own. Appium drivers go through the same path, so taps and
swipes are steps too.

## Step 1. Install

```bash
pip install reporting-labs selenium
```

Selenium 4's Selenium Manager downloads the matching driver for you. Nothing to register with pytest.

## Step 2. Run

```bash
pytest
open reporting-labs/index.html
```

## What lands in the report

- **Every driver command as a step**: `open https://…`, `find id: user`, `type "demo" into id: user`,
  `click id: login`, `run script …`, `switch to frame …`. A child find reads as
  `find body -> css selector: #next`, so the step names the real element.
- **A screenshot of every live driver** attached when a test fails, with the page URL logged.
- **Plain-language failures** for the common Selenium exceptions: not found, click intercepted, not
  interactable, stale element, timed out, no such window — above the raw exception.
- **Values typed into password fields are masked** in step titles.

```python
import pytest
from selenium.webdriver.common.by import By
from reporting_labs import meta, step, test_data

@pytest.mark.meta(priority="P1", owner="ravi", feature="login")
def test_login(driver):
    test_data({"username": "demo", "password": "S3cretPw!"}, "Login")   # masked
    driver.get("https://demo.shop.test/")
    with step("Log in"):
        driver.find_element(By.ID, "user").send_keys("demo")
        driver.find_element(By.ID, "password").send_keys("S3cretPw!")
        driver.find_element(By.ID, "login").click()
    assert driver.find_element(By.ID, "msg").text == "Welcome demo"
```

A full runnable project is in
[`examples/pytest-selenium`](https://github.com/naveenautomationlabs/reporting-labs-python/tree/main/examples/pytest-selenium).

## Appium

Appium's Python client is a Selenium `WebDriver`, so it works the same way: `driver.get`, taps, `send_keys`
and `perform` show as steps, and a screenshot is attached on failure. Install `Appium-Python-Client` and run
your tests as usual.
