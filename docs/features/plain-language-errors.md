---
title: Plain-language errors
sidebar_position: 7
---

# Plain-language errors

Playwright's raw errors are accurate but noisy. reportingLabs classifies each failure into one of 19 kinds and shows a one-line reason above the raw error:

- **Locator not found** — the selector matched zero elements.
- **Element not visible** — matched, but hidden/off-screen.
- **Blocked by another element** — click intercepted by an overlay.
- **Detached from DOM** — matched, then re-rendered before the action.
- **Wrong element type** — clicked something that is not clickable, filled something that is not an input.
- **Assertion mismatch** — an `expect(...)` failed; the expected vs actual is called out.
- **URL did not match** — `expect(page).toHaveURL(...)` failed with the URL you actually got.
- **Visual mismatch** — `expect(page).toHaveScreenshot(...)` failed; a comparison viewer is attached.
- **Network error** — the request failed or timed out.
- **API assertion** — an `expect(response)` failed.
- **Navigation** — page navigation failed or timed out.
- **Test / hook / action timeout** — with the applicable timeout value called out.
- **Closed / detached** — the target page/context was already closed.
- **Browser crashed** — the browser process died mid-test (`Target crashed`, `Page crashed`, Selenium's "session deleted because of page crash"). An infrastructure problem, usually memory or too many workers, not a bug in the app or the test.
- **Script / File / Thrown** — for spec-level failures.

The original Playwright error stays right below the plain-language reason. Nothing is hidden — just re-ranked.
