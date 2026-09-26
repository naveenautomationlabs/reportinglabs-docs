---
title: Java / TestNG
sidebar_position: 3
---

# Get started: Java / TestNG

reportingLabs for Java also ships a TestNG listener. Same annotations, same `Rl.*` helpers, same HTML report — the only difference is the wiring.

## Install

```xml
<dependency>
    <groupId>io.github.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Or with Gradle:

```gradle
testImplementation 'io.github.reportinglabs:reporting-labs-testng:0.1.0'
```

## Wire it up

Nothing. TestNG's `ServiceLoader` picks up the listener from `META-INF/services/org.testng.ITestNGListener`. Run `mvn test`, open `reporting-labs/index.html`.

If you prefer to be explicit — or you already have a `<listeners>` block — you can add it there:

```xml
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

## A first tagged test

```java
import io.github.reportinglabs.core.Rl;
import io.github.reportinglabs.core.annotations.*;
import org.testng.annotations.Test;

import java.util.Map;

@Owner("naveen")
@Feature("cart")
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

Run `mvn test`. The test shows up ranked P0, owned by `naveen`, tagged `smoke`.

![Overview tab of the report](/img/screenshots/01-overview-light.png)

## What TestNG gives you for free

- **Groups become tags.** Any `groups = {...}` on `@Test` shows up as tag chips on the row, and the Breakdown card automatically gets a Tags subtab.
- **Description becomes the title.** `@Test(description = "adds a saved item…")` overrides the method name in the report — useful for BDD-style names.
- **Retries are respected.** `IRetryAnalyzer` results show up as flaky, with each attempt visible in the test detail.
- **Data providers.** Every row from a `@DataProvider` gets its own test entry with the parameter values in the title.

## Annotations

All annotations live in `io.github.reportinglabs.core.annotations` — identical to the JUnit 5 flavour. See [Java / JUnit 5 → Annotations](/get-started/java-junit5#annotations) for the full table.

Put them on a `@Test` method (per-test) or on the class (applies to every test in the class; method-level wins).

## Runtime helpers (`Rl.*`)

Same helpers as JUnit 5 — see [Java / JUnit 5 → Runtime helpers](/get-started/java-junit5#runtime-helpers-rl).

```java
Rl.meta("region", "apac");
Rl.log("submitting order");
Rl.testData(payload, "Request body");
Rl.api("POST", "/v1/orders", 201);
Rl.attach("screenshot", "image/png", bytes);
```

## What you get out of the box

The exact same six tabs as the JavaScript reporter: Overview, Tests, Failures, API, Graphs, Timeline. Byte-for-byte the same HTML. See [Report tour](/features/report-tour) for a full walkthrough.

![Tests tab](/img/screenshots/02-tests-light.png)

![Graphs tab](/img/screenshots/06-graphs-light.png)

## Configure the report

Pass options as system properties on the Maven command line, or once in `src/test/resources/reporting-labs.properties` — see [Java / JUnit 5 → Configure the report](/get-started/java-junit5#configure-the-report) for both forms.

## Requirements

- JDK 11+
- Maven 3.9+ or Gradle 8+
- TestNG 7.10+
