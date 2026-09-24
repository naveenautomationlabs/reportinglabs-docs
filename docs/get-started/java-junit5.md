---
title: Java / JUnit 5
sidebar_position: 2
---

# Get started: Java / JUnit 5

## Install

```xml
<dependency>
    <groupId>io.github.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

Turn on JUnit 5 auto-detection in one line — create `src/test/resources/junit-platform.properties`:

```properties
junit.jupiter.extensions.autodetection.enabled=true
```

That is the whole setup. Run `mvn test`. Open `reporting-labs/index.html`.

## Tag your tests

Same annotations for JUnit 5 and TestNG — imported from `io.github.reportinglabs.core.annotations`:

```java
import io.github.reportinglabs.core.Rl;
import io.github.reportinglabs.core.annotations.*;
import org.junit.jupiter.api.Test;
import java.util.Map;

@Owner("naveen") @Feature("checkout")
class CheckoutTest {

    @Test
    @Priority("P0") @Severity("blocker") @Story("SHOP-231")
    void places_an_order_with_saved_card() {
        Rl.testData(Map.of("user", "demo@shop.io", "card", "4242…"), "Cart");
        Rl.log("opening checkout");
        // your existing Selenium / Playwright / plain code — no wrappers
    }
}
```

**Annotations:** `@Priority`, `@Severity`, `@Owner`, `@Feature`, `@Story`, `@Epic`, `@Issue`, `@Component`, `@Team`, and free-form `@Meta(key=..., value=...)` (repeatable).

**Runtime helpers:** `Rl.meta(key, value)`, `Rl.log(msg)`, `Rl.testData(obj, name?)`, `Rl.api(method, url, status)`, `Rl.attach(name, contentType, bytes)`.

## Configuration

Pass as system properties:

- `-Dreporting-labs.outputFolder=my-report` — default `reporting-labs`
- `-Dreporting-labs.title="Nightly"` — default `Test report`

## Requirements

- JDK 11+
- Maven 3.9+ or Gradle 8+
- JUnit 5 Jupiter 5.10+
