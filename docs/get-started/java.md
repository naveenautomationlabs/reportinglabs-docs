---
title: Java — JUnit 5 & TestNG (+ Playwright)
sidebar_label: Java (JUnit 5 & TestNG)
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get started: Java — JUnit 5 & TestNG

reportingLabs for Java ships four Maven artifacts, all under the `dev.reportinglabs` groupId. Every port renders from the same shared HTML template — a Java team's report is byte-for-byte the report a JavaScript team opens.

| Artifact | Purpose |
|---|---|
| `dev.reportinglabs:reporting-labs-core` | Engine, annotations, `Rl.*` runtime helpers. Framework-agnostic. |
| `dev.reportinglabs:reporting-labs-junit5` | JUnit 5 Extension, auto-registered via ServiceLoader. |
| `dev.reportinglabs:reporting-labs-testng` | TestNG listener, auto-registered via ServiceLoader. |
| `dev.reportinglabs:reporting-labs-playwright` | One-line auto-capture for Playwright for Java. |

## Install

Pick your framework tab.

<Tabs groupId="java-framework">
<TabItem value="junit5" label="JUnit 5" default>

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Or with Gradle:

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-junit5:0.1.0'
```

</TabItem>
<TabItem value="testng" label="TestNG">

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Or with Gradle:

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-testng:0.1.0'
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
    <listener class-name="dev.reportinglabs.testng.ReportingLabsListener"/>
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
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.junit.jupiter.api.Test;

import java.util.Map;

@Owner("naveen") @Feature("checkout")
class CheckoutTest {

    @Test
    @Priority("P0")
    @Severity("blocker")
    @Story("SHOP-231")
    void places_an_order_with_saved_card() {
        Rl.testData("Cart snapshot", Map.of(
            "user",  "demo@shop.io",
            "card",  "4242 4242 4242 4242",
            "total", 99.90
        ));

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
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.testng.annotations.Test;

import java.util.Map;

@Owner("naveen") @Feature("cart")
public class CartTest {

    @Test(description = "adds a saved item to the cart", groups = {"smoke"})
    @Priority("P0")
    @Severity("blocker")
    @Story("SHOP-401")
    public void adds_item_to_cart() {
        Rl.testData("Cart line", Map.of("sku", "JEAN-BLUE-32", "qty", 1));
        Rl.log("clicking add-to-cart");
        // your existing Selenium / Playwright / plain Java code — no wrappers
    }
}
```

</TabItem>
</Tabs>

Run `mvn test` and open `reporting-labs/index.html`. The test shows up ranked P0 with owner `naveen`.

## The report

Same six tabs as the Node.js reporter — Overview, Tests, Failures, API, Graphs, Timeline. Same look, same interactions.

![Java-generated report — Overview tab](/img/screenshots/08-java-overview-light.png)

*Screenshot above is a real run of the JUnit 5 example that ships with the [reporting-labs-java repo](https://github.com/naveenautomationlabs/reporting-labs-java/tree/main/examples/example-junit5), not a mock-up.*

For a full walkthrough of every tab, see the [Report tour](/features/report-tour).

## Playwright for Java — auto-capture

The `reporting-labs-playwright` artifact adds one-line auto-capture. Pull it in alongside the JUnit 5 (or TestNG) artifact:

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-playwright</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Then call `RlPlaywright.attach(page)` once per test — usually from `@BeforeEach`:

```java
import com.microsoft.playwright.*;
import dev.reportinglabs.playwright.RlPlaywright;
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.junit.jupiter.api.*;

@Owner("naveen") @Feature("home")
class HomeTest {

    Playwright playwright;
    Browser browser;
    Page page;

    @BeforeEach
    void setup() {
        playwright = Playwright.create();
        browser    = playwright.chromium().launch();
        page       = browser.newPage();
        RlPlaywright.attach(page);   // <-- one line, auto-captures everything
    }

    @AfterEach
    void tearDown() {
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }

    @Test @Priority("P0") @Severity("blocker")
    void loads_the_home_page() {
        Rl.log("navigating to example.com");
        page.navigate("https://example.com");
        Assertions.assertTrue(page.title().contains("Example"));
    }
}
```

With that one line, reportingLabs automatically:

- **Records every request** the page makes — method, URL, status, timing — as an API call in the report.
- **Starts a Playwright trace** and attaches the `.zip` on test finish (drop it into `trace.playwright.dev` for the full timeline).
- **Screenshots on failure** — a full-page PNG lands under the test's Attachments panel.

Nothing else in your test code changes. Same `page.click()`, `page.fill()`, `page.request()` calls work exactly as they did.

### Attach a whole context (multi-tab flows)

`RlPlaywright.attach(BrowserContext)` wires every current AND future page in that context:

```java
RlPlaywright.attach(browser.newContext());   // pages opened later get auto-wired too
```

## Annotations

All annotations live in `dev.reportinglabs.core.annotations`. Method-level wins over class-level. Same set for JUnit 5 and TestNG.

| Annotation | Example | What it does |
|---|---|---|
| `@Priority` | `@Priority("P0")` | Sort order in **Needs attention** and charts |
| `@Severity` | `@Severity("blocker")` | Secondary sort, shown as a chip |
| `@Owner` | `@Owner("naveen")` | Owner rollup + Owner leaderboard chart |
| `@Feature` | `@Feature("checkout")` | Feature rollup + Feature × project heatmap |
| `@Story` | `@Story("SHOP-231")` | Linkable chip |
| `@Epic` | `@Epic("EPIC-18")` | Linkable chip |
| `@Issue` | `@Issue("BUG-901")` | Linkable chip |
| `@Component` | `@Component("cart-svc")` | Free-form chip |
| `@Team` | `@Team("qa-platform")` | Free-form chip |
| `@Meta` | `@Meta(key="region", value="apac")` | Any custom key. Repeatable. |

## Runtime helpers (`Rl.*`)

Same signatures across every framework binding.

```java
import dev.reportinglabs.core.Rl;

Rl.meta("region", "apac");                       // add a chip
Rl.log("submitting order");                      // step message
Rl.testData("Request body", payload);            // pinned block, sensitive keys masked
Rl.api("POST", "/v1/orders", 201);               // record an API call manually
Rl.attach("screenshot", "image/png", bytes);     // any binary attachment
```

Sensitive keys (`password`, `token`, `authorization`, `cookie`, `apiKey`, `secret`, `pan`, `cvv`, and more) are masked automatically inside `Rl.testData()` and inside recorded API headers.

## Works with what you already use

`Rl.*` doesn't care what happens inside the test body — only the framework's `@Test` lifecycle. Same package works for:

- **Playwright for Java** — auto-capture with `reporting-labs-playwright` (see above)
- **Selenium Java** — `Rl.attach("failure.png", "image/png", ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES))`
- **REST Assured** — `Rl.api("POST", "/v1/orders", resp.statusCode())`
- **Karate**, **Cucumber JVM** — run under JUnit 5 or TestNG; annotations and `Rl.*` work the same
- **Plain code**, `HttpClient`, JDBC, whatever

## Configuration

Pass options as system properties:

```bash
mvn test \
  -Dreporting-labs.title="Nightly regression" \
  -Dreporting-labs.outputFolder=target/reporting-labs \
  -Dreporting-labs.project.name="ShopLite Web" \
  -Dreporting-labs.project.version=2.4.0 \
  -Dreporting-labs.metadata.env=staging \
  -Dreporting-labs.metadata.build=ci-4287 \
  -Dreporting-labs.links.story=https://shoplite.atlassian.net/browse/{id}
```

Or once, in `src/test/resources/reporting-labs.properties`:

```properties
reporting-labs.title=Nightly regression
reporting-labs.outputFolder=target/reporting-labs
reporting-labs.project.name=ShopLite Web
reporting-labs.project.version=2.4.0
reporting-labs.metadata.env=staging
reporting-labs.metadata.build=ci-4287
reporting-labs.links.story=https://shoplite.atlassian.net/browse/{id}
```

Full list at [All options](/reference/options).

## Requirements

- JDK 11+
- Maven 3.9+ or Gradle 8+
- JUnit Jupiter 5.10+ (for the JUnit 5 artifact)
- TestNG 7.10+ (for the TestNG artifact)
- Playwright for Java 1.47+ (for the Playwright artifact)

## Source + release notes

- Source: [github.com/naveenautomationlabs/reporting-labs-java](https://github.com/naveenautomationlabs/reporting-labs-java)
- Runnable examples: [`examples/`](https://github.com/naveenautomationlabs/reporting-labs-java/tree/main/examples)
- Maven Central: [central.sonatype.com/namespace/dev.reportinglabs](https://central.sonatype.com/namespace/dev.reportinglabs)
