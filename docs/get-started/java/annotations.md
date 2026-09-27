---
title: Annotations & Rl.* helpers
sidebar_label: Annotations & Rl.* helpers
---

# Annotations & `Rl.*` helpers

Two ways to add detail to a test: **annotations** on the class or method
(static — priority, owner, feature), and **`Rl.*` calls** inside the body
(dynamic — steps, data, attachments). Same set for TestNG and JUnit 5, and the
same for Playwright, Selenium, REST Assured or plain Java.

## Annotations

All live in `dev.reportinglabs.core.annotations`. Put them on the class for a
default, on the method to override.

```java
import dev.reportinglabs.core.annotations.*;

@Owner("naveen") @Feature("checkout")           // class-level defaults
public class CheckoutTest extends BaseTest {

    @Test
    @Priority("P0") @Severity("blocker") @Story("SHOP-231")
    public void places_an_order() { /* ... */ }

    @Test
    @Priority("P2") @Owner("priya")             // overrides the class-level owner
    public void shows_empty_cart_message() { /* ... */ }
}
```

| Annotation | Example | Where it shows in the report |
|---|---|---|
| `@Priority` | `@Priority("P0")` | Sort order in **Needs attention**; Priority chart |
| `@Severity` | `@Severity("blocker")` | Secondary sort; chip on the test |
| `@Owner` | `@Owner("naveen")` | Owner rollup + **Owner leaderboard** chart |
| `@Feature` | `@Feature("checkout")` | Feature rollup + Feature × project heatmap |
| `@Story` | `@Story("SHOP-231")` | Chip — becomes a link with `reporting-labs.links.story` |
| `@Epic` | `@Epic("EPIC-18")` | Chip — linkable the same way |
| `@Issue` | `@Issue("BUG-901")` | Chip — linkable the same way |
| `@Component` | `@Component("cart-svc")` | Free-form chip |
| `@Team` | `@Team("qa-platform")` | Free-form chip |
| `@Meta` | `@Meta(key="region", value="apac")` | Any custom key. Repeatable. |

**TestNG groups** become tags automatically, and `@Test(description = "…")`
becomes the test title.

![Graphs tab — priority, owner and feature rollups built from annotations](/img/screenshots/06-graphs-light.png)

Make `@Story` / `@Epic` / `@Issue` clickable with one property each:

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.links.story=https://yourcompany.atlassian.net/browse/{id}
reporting-labs.links.issue=https://yourcompany.atlassian.net/browse/{id}
```

## `Rl.*` runtime helpers

`import dev.reportinglabs.core.Rl;` — every method is safe to call anywhere.
Outside a running test they do nothing (they never throw), so they're fine in
shared utilities and page objects.

```java
Rl.log("submitting order");                          // step in the test's log
Rl.meta("region", "apac");                           // chip, same as @Meta but at runtime
Rl.testData("Request body", payload);                // pinned data block, secrets masked
Rl.api("POST", "/v1/orders", 201, 340);              // API row (see REST Assured guide)
Rl.attach("screen.png", "image/png", bytes);         // any file — image, video, zip, text
```

![Test detail — steps, data block, attachments](/img/screenshots/03-test-detail-light.png)

### `Rl.log(String)`

One line per step. Shows in order with a timestamp. This is the cheapest way
to make a failure readable — you see exactly how far the test got.

### `Rl.testData(name, value)`

Pins a labelled block on the test. Pass a `Map` for a key/value table, or any
object for text (it's JSON-serialised). Sensitive keys are masked as `****`.

```java
Rl.testData("Login", Map.of("user", "demo@shop.io", "password", "Secret@123"));
// report shows:  user  demo@shop.io      password  ****
```

Masked by default (case-insensitive; `-` and `_` are ignored, so `X-Api-Key`,
`api_key` and `apiKey` all match): `password`, `passwd`, `pwd`, `secret`,
`token`, `apikey`, `authorization`, `auth`, `cookie`, `session`, `csrf`,
`xsrf`, `privatekey`, `clientsecret`, `accesstoken`, `refreshtoken`,
`cardnumber`, `card`, `cvv`, `cvc`, `pan`, `ssn`. Add more with
`reporting-labs.maskKeys`.

TestNG `@DataProvider` parameters are captured as a **Parameters** block
automatically — see [Data-driven tests](/get-started/java/data-driven).

### `Rl.attach(name, contentType, bytes)`

Any binary — a PNG, an MP4, a trace zip, a text log. Images preview inline in
the report; everything else is a download link. The content type drives the
preview, so use the real one (`image/png`, `video/mp4`, `application/zip`,
`text/plain`).

### `Rl.api(...)`

Adds a row to the test's API list and the suite-wide **API** tab. Three
overloads, from a bare status up to full headers and bodies — see
[REST Assured + Java](/get-started/java/rest-assured#no-filter-record-one-call-by-hand).

### Capture-policy helpers

For Selenium / Appium base classes that take their own screenshots:

```java
Rl.shouldCaptureScreenshot()   // reads reporting-labs.screenshot + the outcome of the current/just-finished test
Rl.shouldCaptureVideo()        // reads reporting-labs.video
Rl.shouldCaptureTrace()        // reads reporting-labs.trace
```

Each also has a `(boolean failed)` overload if you already hold the outcome.
Full walkthrough in [Selenium + Java](/get-started/java/selenium).

## Calling helpers from `@AfterMethod` / `@AfterEach`

Works. Both frameworks tell reportingLabs a test finished *before* the
after-hook runs, so reportingLabs remembers the test that just ended on the
current thread. `Rl.attach()` / `Rl.log()` from a teardown land on that test.
This is what makes the Selenium screenshot pattern possible.

Calling them from `@BeforeMethod` / `@BeforeEach` works too — the test is
already open by then. That's why `RlPlaywright.attach(page)` can live in a
setup hook.

## Skipped tests show why

The **Skipped** card and the test detail show the reason, whichever way the
test was skipped:

| Framework | Skip mechanism | Reason shown |
|---|---|---|
| TestNG | `throw new SkipException("payment sandbox is down")` | the exception message |
| TestNG | `@Test(enabled = false)` | — (never runs, not reported) |
| JUnit 5 | `@Disabled("waiting on SHOP-77")` | the annotation value |
| JUnit 5 | `Assumptions.assumeTrue(cond, "needs staging seed")` | `Assumption failed: needs staging seed` |

An assumption failure is reported as **skipped**, not failed — no screenshot
or trace is captured for it.
