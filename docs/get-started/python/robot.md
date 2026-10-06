---
title: Robot Framework
sidebar_label: Robot Framework
---

# Robot Framework

**One flag.** Add `--listener reporting_labs.RobotListener` and your suite is in the report: one row per test
case, suites as the path, every keyword a step, setup and teardown as hooks, tags as filters, and the
screenshots SeleniumLibrary or the Browser library embed in the log attached to the test. SeleniumLibrary
commands and RequestsLibrary calls are captured through the same Selenium and HTTP integrations the pytest
plugin uses.

## Step 1. Install

```bash
pip install reporting-labs robotframework
# plus your libraries, e.g.
pip install robotframework-seleniumlibrary
```

## Step 2. Run with the listener

```bash
robot --listener reporting_labs.RobotListener tests/
open reporting-labs/index.html
```

Options go after a colon:

```bash
robot --listener reporting_labs.RobotListener:title=Checkout:output=reports/rl:project=Web tests/
```

| Option | Meaning |
|---|---|
| `title` | report title |
| `output` | output folder (default `reporting-labs`) |
| `project` | project name shown in the header and the heatmap |
| `config` | path to a `reporting-labs.config.json` |

## What lands in the report

- **A row per test case**, with the suite tree as its path.
- **Every keyword as a step**, user keywords and library keywords, nested, with arguments. `FOR`, `IF`,
  `WHILE` and `TRY` show as steps too; a keyword the run skipped (after a failure) is marked skipped.
- **Setup and teardown as hooks** on the test.
- **Tags** become filters and meta. `priority:P1`, `owner:asha`, `feature:login` fill the charts; a plain
  tag like `smoke` shows as a chip. `P1` / `critical` on their own are understood too.
- **Log messages** become the test's log lines; embedded screenshots (`Capture Page Screenshot`, the
  Browser library's auto-screenshots) are attached.
- **Plain-language failures** for SeleniumLibrary and the Browser library ("element 'id:x' not found",
  "should have contained …").
- **Secrets masked**: arguments to keywords whose name looks like a password, and values after a password
  argument, are blanked in step titles.

The same `@key value` meta can go in the test's documentation, as with a pytest docstring:

```robot
*** Test Cases ***
Cart Total Is Correct
    [Documentation]    Checks the cart total.    @owner naveen    @priority P0    @story SHOP-12
    [Tags]    smoke
    ...
```

```robot
*** Settings ***
Library           SeleniumLibrary
Test Setup        Open Browser    ${BASE}    chrome
Test Teardown     Close Browser

*** Test Cases ***
Login shows the greeting
    [Tags]    smoke    priority:P1    owner:asha    feature:login
    Input Text        id:user        demo
    Input Password    id:password    S3cretPw!
    Click Element     id:login
    Element Text Should Be    id:msg    Welcome demo
```

A full runnable suite is in
[`examples/robot-selenium`](https://github.com/naveenautomationlabs/reporting-labs-python/tree/main/examples/robot-selenium).

## Alongside Robot's own log

The listener does not touch Robot's `output.xml`, `log.html` or `report.html`. You get those as usual plus
the one-file reportingLabs report, which carries the trend across runs, the Needs-attention ranking and the
charts.
