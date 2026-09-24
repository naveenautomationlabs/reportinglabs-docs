---
title: Java / TestNG
sidebar_position: 3
---

# Get started: Java / TestNG

## Install

```xml
<dependency>
    <groupId>io.github.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.0</version>
    <scope>test</scope>
</dependency>
```

TestNG loads the listener automatically via `META-INF/services`. No `<listeners>` block needed in your `testng.xml`, though you can add one for clarity:

```xml
<suite name="my-suite">
  <listeners>
    <listener class-name="io.github.reportinglabs.testng.ReportingLabsListener"/>
  </listeners>
  <test name="...">
    <classes>...</classes>
  </test>
</suite>
```

Run `mvn test`. Open `reporting-labs/index.html`.

## Tag your tests

Same annotations and helpers as the JUnit 5 flavour — see [Java / JUnit 5](/get-started/java-junit5#tag-your-tests). Additionally, TestNG **groups** are picked up as tags on the test row, so the Breakdown card automatically shows a Tags tab.

```java
import io.github.reportinglabs.core.Rl;
import io.github.reportinglabs.core.annotations.*;
import org.testng.annotations.Test;

@Owner("naveen") @Feature("cart")
public class CartTest {

    @Test(description = "adds a saved item to the cart", groups = {"smoke"})
    @Priority("P0") @Severity("blocker") @Story("SHOP-401")
    public void adds_item_to_cart() {
        Rl.log("clicking add-to-cart");
    }
}
```

## Requirements

- JDK 11+
- Maven 3.9+ or Gradle 8+
- TestNG 7.10+
