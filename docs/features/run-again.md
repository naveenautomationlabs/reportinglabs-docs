---
title: Run again
sidebar_position: 6
---

# Run again

Every test in the report shows the command that runs just that test again, with a **Copy** button. Paste it in a terminal in the folder you ran the suite from.

![Run again row on a failed test](/img/screenshots/run-again-light.png)

**Copy re-run command** copies one command for every failed test at once. It is on the [Since last run](./history-trend.md#since-last-run) line of the Overview and at the top of the Failures tab. A spec that failed twice is listed once.

![Copy re-run command on the Failures tab](/img/screenshots/rerun-failed-light.png)

## The command for each tool

| Tool | One test | All failed tests |
|---|---|---|
| Playwright | `npx playwright test tests/checkout.spec.ts:12 --project=chromium` | `npx playwright test tests/checkout.spec.ts:12 tests/login.spec.ts:13 --project=chromium --project=mobile` |
| playwright-bdd | `npx bddgen && npx playwright test .features-gen/features/login.feature.spec.js:15` | the same, one target per scenario |
| Cypress, Cypress + Cucumber | `npx cypress run --spec "cypress/e2e/login.cy.js"` | `npx cypress run --spec "cypress/e2e/login.cy.js,cypress/e2e/orders.feature"` |
| WebdriverIO | `npx wdio run wdio.conf.js --spec test/specs/login.e2e.js` | one `--spec` per spec file |
| pytest (also Playwright, Selenium, pytest-bdd) | `pytest "tests/test_login.py::test_login[guest]"` | `pytest tests/test_login.py::test_locked "tests/test_login.py::test_login[guest]"` |
| Robot Framework | `robot --test "Locked Account Shows Message" tests/login.robot` | one `--test` per test, then their files |
| JUnit 5, TestNG (Maven) | `mvn test -Dtest="com.shop.LoginTest#locksAccount"` | `mvn test -Dtest="com.shop.LoginTest#locksAccount,com.shop.CartTest#total"` |
| JUnit 5, TestNG (Gradle) | `./gradlew test --tests com.shop.LoginTest.locksAccount` | one `--tests` per test |
| Cucumber JVM (Maven) | `mvn test -Dcucumber.features="src/test/resources/features/login.feature:13"` | the scenarios comma-separated |

- **Playwright** picks the test by file and line. `--project` is added when the config has more than one project, and `-c` when your config is not the one Playwright finds on its own.
- **playwright-bdd** runs the generated spec, after `npx bddgen` rebuilds it from the feature files. The report itself shows the scenario at its line in the `.feature` file.
- **Cypress** and **WebdriverIO** run a spec file, not one test of it, so the command re-runs the whole spec. Cypress adds `--browser` when the run was not on the default Electron, and `--config-file` when the config is not the default one.
- **Java** uses `./mvnw` or `./gradlew` when the project has one. In a module of a multi-module Maven build it adds `-Dsurefire.failIfNoSpecifiedTests=false`, so the modules without the test do not fail the run. Cucumber scenarios are picked by feature file and line (Maven only: Gradle does not pass `-D` on to the tests).
- **pytest** gets the test's node id, quoted when it has spaces or brackets, with the path relative to the folder pytest was started from.

Nothing to set up. Needs npm `reporting-labs` 0.6.21+, PyPI `reporting-labs` 0.1.11+ or Maven `dev.reportinglabs` 0.1.32+.
