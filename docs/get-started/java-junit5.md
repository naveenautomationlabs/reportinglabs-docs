---
title: Java / JUnit 5
sidebar_position: 2
---

# Get started: Java / JUnit 5

reportingLabs for Java is a JUnit 5 Extension that writes the same self-contained HTML report you get on the JavaScript side. Everything renders from a shared template — a Java team's report is byte-for-byte the report a JavaScript team opens.

## Install

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>io.github.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Or with Gradle:

```gradle
testImplementation 'io.github.reportinglabs:reporting-labs-junit5:0.1.0'
```

## Wire it up

Turn on JUnit 5 extension auto-detection — create `src/test/resources/junit-platform.properties`:

```properties
junit.jupiter.extensions.autodetection.enabled=true
```

That is the whole setup. Run `mvn test`. Open `reporting-labs/index.html`.

The extension is loaded automatically via JUnit's `ServiceLoader`, so you do not need `@ExtendWith` on any class.

## A first tagged test

```java
import io.github.reportinglabs.core.Rl;
import io.github.reportinglabs.core.annotations.*;
import org.junit.jupiter.api.Test;

import java.util.Map;

@Owner("naveen") @Feature("checkout")
class CheckoutTest {

    @Test
    @Priority("P0")
    @Severity("blocker")
    @Story("SHOP-231")
    void places_an_order_with_saved_card() {
        Rl.testData(Map.of(
            "user", "demo@shop.io",
            "card", "4242 4242 4242 4242",
            "total", 99.90
        ), "Cart snapshot");

        Rl.log("opening checkout");
        Rl.log("filling saved card");
        Rl.log("submitting order");

        // your existing Selenium / Playwright / plain Java code — no wrappers
    }
}
```

Run `mvn test` and open `reporting-labs/index.html`. The test shows up ranked P0 with owner `naveen` and feature `checkout`.

![Overview tab of the report](/img/screenshots/01-overview-light.png)

## Annotations

All annotations live in `io.github.reportinglabs.core.annotations`. Put them on a method (per-test) or on a class (applies to every test in the class; method-level wins).

| Annotation | Example | What it does |
|---|---|---|
| `@Priority` | `@Priority("P0")` | Sort order in **Needs attention** and charts |
| `@Severity` | `@Severity("blocker")` | Secondary sort, shown as a chip |
| `@Owner` | `@Owner("naveen")` | Owner rollup + Owner leaderboard chart |
| `@Feature` | `@Feature("checkout")` | Feature rollup + Feature × project heatmap |
| `@Story` | `@Story("SHOP-231")` | Linkable chip (see `links` option) |
| `@Epic` | `@Epic("EPIC-18")` | Linkable chip |
| `@Issue` | `@Issue("BUG-901")` | Linkable chip |
| `@Component` | `@Component("cart-svc")` | Free-form chip |
| `@Team` | `@Team("qa-platform")` | Free-form chip |
| `@Meta` | `@Meta(key="region", value="apac")` | Any custom key. Repeatable. |

Class-level example:

```java
@Owner("naveen")
@Feature("payment")
class PaymentTest {

    @Test @Priority("P0") void accepts_visa() { /* ... */ }
    @Test @Priority("P1") void rejects_invalid_cvv() { /* ... */ }

    @Test
    @Priority("P0")
    @Owner("rahul")   // method-level wins, this test is owned by rahul
    void handles_gateway_timeout() { /* ... */ }
}
```

## Runtime helpers (`Rl.*`)

For values you only know at runtime, use `Rl` from `io.github.reportinglabs.core`:

```java
import io.github.reportinglabs.core.Rl;

Rl.meta("region", "apac");              // add a chip
Rl.log("submitting order");             // step message
Rl.testData(payload, "Request body");   // pinned JSON block, masked
Rl.api("POST", "/v1/orders", 201);      // record an API call manually
Rl.attach("screenshot", "image/png", bytes);  // any binary attachment
```

Sensitive keys (`password`, `token`, `authorization`, `cookie`, `apiKey`, …) are masked automatically inside `Rl.testData()`.

## Attach a Playwright screenshot

Any binary attachment works. Here is a Playwright example:

```java
import com.microsoft.playwright.*;
import io.github.reportinglabs.core.Rl;

@Test
void takes_home_page_screenshot() {
    try (Playwright p = Playwright.create()) {
        Browser browser = p.chromium().launch();
        Page page = browser.newPage();
        page.navigate("https://example.com");
        byte[] png = page.screenshot();
        Rl.attach("home.png", "image/png", png);
    }
}
```

The screenshot appears inline in the **Attachments** panel of the test detail.

![Test detail with attachments](/img/screenshots/03-test-detail-light.png)

## Configure the report

Pass options as system properties on the Maven command line:

```bash
mvn test \
  -Dreporting-labs.title="Nightly regression" \
  -Dreporting-labs.outputFolder=target/reporting-labs \
  -Dreporting-labs.project.name="ShopLite Web" \
  -Dreporting-labs.project.version=2.4.0 \
  -Dreporting-labs.metadata.env=staging \
  -Dreporting-labs.metadata.build=ci-4287
```

Or once, via a `reporting-labs.properties` in `src/test/resources`:

```properties
reporting-labs.title=Nightly regression
reporting-labs.outputFolder=target/reporting-labs
reporting-labs.project.name=ShopLite Web
reporting-labs.project.version=2.4.0
reporting-labs.metadata.env=staging
```

Full list at [All options](/reference/options).

## Requirements

- JDK 11+
- Maven 3.9+ or Gradle 8+
- JUnit 5 Jupiter 5.10+
