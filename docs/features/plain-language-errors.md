---
title: Plain-language errors
sidebar_position: 7
---

# Plain-language errors

Raw test errors are accurate but noisy. reportingLabs classifies each failure into one of 19 kinds and shows a one-line reason above the raw error, with what to check first. It works the same for Playwright, Cypress, WebdriverIO, Java and Python; rule based, no AI, no network.

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

**Cypress** errors get their own readings: an element Cypress never found (`cy.get`, `cy.contains`), an element covered, hidden, disabled or detached, a `cy.request` that answered 4xx / 5xx or timed out, a `cy.visit` that could not load the page, a `cy.wait('@alias')` that saw no request, an uncaught error thrown by the application, and a spec that could not be loaded (a broken import or a syntax error).

**Cucumber** (Cypress + Cucumber, playwright-bdd):

- **Step not defined** — a step in the feature file has no step definition (`Step implementation missing`, `Missing step`). The error points at the step in the `.feature` file.
- **Step defined twice** — more than one step definition matches the step (`Multiple matching step definitions`, `Multiple definitions matched`).
- A step whose definition returns `"pending"` (Cypress + Cucumber) marks the scenario as skipped, with the step as the reason.

The original error stays right below the plain-language reason. Nothing is hidden — just re-ranked.
