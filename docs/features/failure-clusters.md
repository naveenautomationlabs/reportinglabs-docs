---
title: Failure clusters
sidebar_position: 3
---

# Failure clusters

The report groups every failing test by its **error message** (and, when available, by the failing locator, matcher and rule from the plain-language failure classifier). Thirty red tests that share `locator not found` read as **one** problem: probably a shifted DOM or a renamed test id, not thirty separate bugs.

The cluster row shows:

- The one-line summary of the shared cause (`URL did not match`, `Element not visible`, `expected 100 got 90`).
- How many tests are in the cluster.
- The first few test names, click any to open its detail.

When there is truly one broken thing, one fix closes the whole cluster. This is the fastest signal reportingLabs gives you.
