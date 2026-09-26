---
title: Python (coming soon)
sidebar_label: Python (coming)
sidebar_position: 4
---

# Get started: Python

Python support is on the near-term roadmap. The plan is a pytest plugin (`pytest-reporting-labs`) that mirrors the Node.js and Java surface — same annotations-as-markers, same `Rl.log() / Rl.testData() / Rl.attach()` runtime helpers, same self-contained HTML report.

## Sneak peek — what the pytest side will look like

```python
import pytest
from reporting_labs import Rl

pytestmark = [pytest.mark.owner("naveen"), pytest.mark.feature("checkout")]

@pytest.mark.priority("P0")
@pytest.mark.severity("blocker")
@pytest.mark.story("SHOP-231")
def test_places_an_order_with_saved_card(page):
    Rl.test_data({"user": "demo@shop.io", "card": "4242…", "total": 99}, name="Cart")
    Rl.log("opening checkout")
    page.goto("/checkout")
    page.get_by_role("button", name="Place order").click()
    assert page.get_by_text("Thank you").is_visible()
```

The generated `reporting-labs/index.html` will be **byte-for-byte the same report** a Node.js or Java team gets — every port renders from one shared HTML template.

## Use it today from Python

If you need reportingLabs from a Python project right now, you can emit the shared `report.json` yourself and hand it to the merge CLI:

```bash
# after your Python test run writes reporting-labs-shards/*.json
npx reporting-labs merge reporting-labs-shards --out reporting-labs
```

`report.json` is a well-defined shape any language can produce. The merge CLI takes one or more shards and renders the HTML report from them — no Node code in your test process, just a JSON file on disk.

## Follow along

- Track progress on [GitHub issues](https://github.com/naveenautomationlabs/reporting-labs/issues)
- Watch the [npm changelog](https://www.npmjs.com/package/reporting-labs) for the pytest release note
- Have a specific Python framework you want first (pytest, unittest, robot)? File an issue and vote.
