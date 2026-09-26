---
title: Java — JUnit 5 & TestNG
sidebar_label: Java (JUnit 5 & TestNG)
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get started: Java — JUnit 5 & TestNG

reportingLabs for Java ships two artifacts on Maven Central — a **JUnit 5 Extension** and a **TestNG listener** — that both produce the same self-contained HTML report. Same annotations, same `Rl.*` runtime helpers, same output. The only difference is which artifact you add and how the framework picks it up.

Pick your framework tab throughout this page.

## Install

<Tabs groupId="java-framework">
<TabItem value="junit5" label="JUnit 5" default>

```xml title="pom.xml"
<dependency>
    <groupId>io.github.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Or with Gradle:

```gradle title="build.gradle"
testImplementation 'io.github.reportinglabs:reporting-labs-junit5:0.1.0'
```

</TabItem>
<TabItem value="testng" label="TestNG">

```xml title="pom.xml"
<dependency>
    <groupId>io.github.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Or with Gradle:

```gradle title="build.gradle"
testImplementation 'io.github.reportinglabs:reporting-labs-testng:0.1.0'
```

</TabItem>
</Tabs>

## Wire it up

<Tabs groupId="java-framework">
<TabItem value="junit5" label="JUnit 5" default>

Turn on JUnit 5 extension auto-detection — create `src/test/resources/junit-platform.properties`:

```properties
junit.jupiter.extensions.autodetection.enabled=true
```

That is the whole setup. The extension is loaded automatically via JUnit's `ServiceLoader`, so you do not need `@ExtendWith` on any class.

Run `mvn test`. Open `reporting-labs/index.html`.

</TabItem>
<TabItem value="testng" label="TestNG">

Nothing. TestNG's `ServiceLoader` picks up the listener from `META-INF/services/org.testng.ITestNGListener`. Run `mvn test`, open `reporting-labs/index.html`.

If you prefer to be explicit — or you already have a `<listeners>` block — you can add it there:

```xml title="testng.xml"
<suite name="my-suite">
  <listeners>
    <listener class-name="io.github.reportinglabs.testng.ReportingLabsListener"/>
  </listeners>
  <test name="checkout">
    <classes>
      <class name="com.shoplite.CheckoutTest"/>
    </classes>
  </test>
</suite>
```

</TabItem>
</Tabs>

## A first tagged test

<Tabs groupId="java-framework">
<TabItem value="junit5" label="JUnit 5" default>

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

</TabItem>
<TabItem value="testng" label="TestNG">

```java
import io.github.reportinglabs.core.Rl;
import io.github.reportinglabs.core.annotations.*;
import org.testng.annotations.Test;

import java.util.Map;

@Owner("naveen") @Feature("cart")
public class CartTest {

    @Test(description = "adds a saved item to the cart", groups = {"smoke"})
    @Priority("P0")
    @Severity("blocker")
    @Story("SHOP-401")
    public void adds_item_to_cart() {
        Rl.testData(Map.of("sku", "JEAN-BLUE-32", "qty", 1), "Cart line");
        Rl.log("clicking add-to-cart");
        // your existing Selenium / Playwright / plain Java code — no wrappers
    }
}
```

</TabItem>
</Tabs>

Run `mvn test` and open `reporting-labs/index.html`. The test shows up ranked P0 with owner `naveen`.

![Overview tab of the report](/img/screenshots/01-overview-light.png)

## What TestNG gives you for free

TestNG carries extra metadata that reportingLabs picks up automatically. These do not apply to JUnit 5, so this section is TestNG-only.

- **Groups become tags.** Any `groups = {...}` on `@Test` shows up as tag chips on the row, and the Breakdown card automatically gets a Tags subtab.
- **Description becomes the title.** `@Test(description = "adds a saved item…")` overrides the method name in the report — useful for BDD-style names.
- **Retries are respected.** `IRetryAnalyzer` results show up as flaky, with each attempt visible in the test detail.
- **Data providers.** Every row from a `@DataProvider` gets its own test entry with the parameter values in the title.

## Annotations

All annotations live in `io.github.reportinglabs.core.annotations`. Put them on a method (per-test) or on a class (applies to every test in the class; method-level wins). Same set for JUnit 5 and TestNG.

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

Class-level example (works with both frameworks):

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

For values you only know at runtime, use `Rl` from `io.github.reportinglabs.core`. Identical surface for JUnit 5 and TestNG.

```java
import io.github.reportinglabs.core.Rl;

Rl.meta("region", "apac");                       // add a chip
Rl.log("submitting order");                      // step message
Rl.testData(payload, "Request body");            // pinned JSON block, masked
Rl.api("POST", "/v1/orders", 201);               // record an API call manually
Rl.attach("screenshot", "image/png", bytes);     // any binary attachment
```

Sensitive keys (`password`, `token`, `authorization`, `cookie`, `apiKey`, …) are masked automatically inside `Rl.testData()`.

## Attach a Playwright screenshot

Any binary attachment works. Here is a Playwright for Java example:

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

## What you get out of the box

Same six tabs as the Node.js reporter: Overview, Tests, Failures, API, Graphs, Timeline. Byte-for-byte the same HTML. See [Report tour](/features/report-tour) for a full walkthrough.

![Tests tab](/img/screenshots/02-tests-light.png)

![Graphs tab](/img/screenshots/06-graphs-light.png)

## Requirements

- JDK 11+
- Maven 3.9+ or Gradle 8+
- JUnit 5 Jupiter 5.10+ (for the JUnit 5 artifact)
- TestNG 7.10+ (for the TestNG artifact)
