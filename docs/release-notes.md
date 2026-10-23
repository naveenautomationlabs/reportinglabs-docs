---
title: Release notes
---

# Release notes

What changed in recent releases. The report is the same across the three packages: a release of the npm package that changes the report is followed by PyPI and Maven releases with the same template. Every version, with its full notes: [Node.js](https://github.com/naveenautomationlabs/reporting-labs/releases) · [Java](https://github.com/naveenautomationlabs/reporting-labs-java/releases) · [Python](https://github.com/naveenautomationlabs/reporting-labs-python/releases).

## October 2026 · npm 0.6.22 · PyPI 0.1.12 · Maven 0.1.33

- **Reports read well on a phone.** A long URL, path or token with no spaces (an OAuth redirect in a step error, a long spec path, an annotation value, a console line) now wraps inside the test detail. Before, one such line made the whole page several times wider than the screen, so a phone showed the report zoomed out to a fraction of its width.
- **Star on GitHub** link in the report footer.
- After a local run, at most once a week and never in CI, one line asking for a GitHub star. `REPORTING_LABS_NO_STAR=1` turns it off. See [options](./reference/options.md). In Java it prints when the JUnit 5, TestNG or Cucumber run finishes.

## October 17–18, 2026 · npm 0.6.21 · PyPI 0.1.11 · Maven 0.1.32

- **[Since last run](./features/history-trend.md#since-last-run):** one line under the tiles with new failures, fixed, still failing, got slower and new tests against the previous run. Click a number to see those tests.
- **[Run again](./features/run-again.md):** every test shows the command that runs just that test (`npx playwright test file:line`, `pytest "node id"`, `mvn test -Dtest=…`, `robot --test …`), and **Copy re-run command** gives one command for every failed test.
- Masking: format placeholders (`password={password}`, `password={}`) and type names (`password: string`) are code, not secrets.

## October 16, 2026 · npm 0.6.20 · PyPI 0.1.10 · Maven 0.1.31

- **Playwright BDD (playwright-bdd):** scenarios at their `.feature` file line, under their Feature and Rule, with Background steps, unrun steps greyed out, Outline rows named after their values, data tables and doc strings. See [Get started: Node.js](./get-started/nodejs.md#playwright-bdd).
- **Playwright 1.63 and 1.64:** steps show their target again (`Click getByRole('button')`, `Navigate /login`), plus a `test.step`'s own subtitle and params. The Browsers row lists only the projects that ran.
- Masking: a secret key followed by code (`token = await login()`, `password: user.password`) is code, not a secret, and `PWD` is no longer learned as a password, so code snippets and stack traces stay readable. See [Security & privacy](./security-privacy.md).

## October 13, 2026 · npm 0.6.18

- **Cypress + Cucumber** (`@badeball/cypress-cucumber-preprocessor`): each scenario at its line in the `.feature` file, with Given / When / Then steps and the Cypress commands each ran, hooks, Outline rows with an Examples table, tags as meta and plain-language "Step not defined" errors. See [Get started: Cypress](./get-started/cypress.md).
