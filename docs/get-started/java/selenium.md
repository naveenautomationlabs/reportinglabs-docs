---
title: Selenium + Java
sidebar_label: Selenium + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Selenium + Java

**One line.** Wrap your driver with `RlSelenium.attach(...)` and every test
that uses it gets a step-by-step trail (open, click, type, with timings),
the failing action highlighted, a screenshot per the capture policy, and the
console output of the test — no `@AfterMethod` screenshot code, no listener
of your own.

![Failed Selenium test — hooks, steps, the failing find in red, screenshot, console output](/img/screenshots/09-selenium-detail-light.png)

Finish [Step 1 on the Java overview](/get-started/java) first (install the
TestNG or JUnit 5 artifact). Then add the Selenium add-on:

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-selenium</artifactId>
    <version>0.1.9</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-selenium:0.1.9'
```

Works with Selenium 4.x (any 4.x — it uses the `EventFiringDecorator` that
ships with `selenium-java`).

## The one line

Wherever you create the driver — `@BeforeTest`, `@BeforeClass`,
`@BeforeMethod`, a `DriverFactory` — wrap it and **use the returned driver**:

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
import dev.reportinglabs.selenium.RlSelenium;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.*;

public class BaseTest {
    protected WebDriver driver;

    @BeforeTest
    public void setup() {
        driver = RlSelenium.attach(new ChromeDriver());   // <-- the one line
    }

    @AfterTest
    public void tearDown() {
        driver.quit();
    }
}
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```java
import dev.reportinglabs.selenium.RlSelenium;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class BaseTest {
    protected WebDriver driver;

    @BeforeEach
    void setUp() {
        driver = RlSelenium.attach(new ChromeDriver());   // <-- the one line
    }

    @AfterEach
    void tearDown() {
        driver.quit();
    }
}
```

</TabItem>
</Tabs>

Creating the driver once and reusing it across tests is fine — capture is
per **test**, not per `attach()`. A `ThreadLocal<WebDriver>` factory for
`parallel="methods"` works the same way: attach on each thread.

## What you get automatically

| Captured | Where it shows |
|---|---|
| **Steps** — `open <url>`, `click id: submit`, `type "…" into name: email`, `clear`, `submit`, `navigate back`, `accept alert`, `switch to frame` — each with its duration | **Steps** in the test detail; nested under your `Rl.step()` blocks and under the hook that ran them |
| **The failing action** — a `NoSuchElementException` on `findElement`, a stale click — marked red with the exception | Steps (and the error block above them) |
| **Before / After hooks** — `@BeforeTest setup`, `@BeforeClass regSetup`, `@AfterMethod …` with timings | Steps → *Before Hooks* / *After Hooks* |
| **Screenshot** per `reporting-labs.screenshot` (default `on-failure`) | Attachments |
| **Console output** — every `System.out` / `System.err` line printed during the test | Console output / Console errors |
| **Retries** — `IRetryAnalyzer` attempts grouped as *Attempt 1 · Failed / Retry 1 · Passed*, test marked **Flaky** | Attempt tabs in the detail; Flaky KPI on the Overview |

Text typed into anything that looks like a password field (`password`,
`pwd`, `pin`, `otp`, `token`, `cvv`, `card` in the locator) is shown as
`••••`.

## A test on top of it

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

@Owner("naveen") @Feature("login")
public class LoginTest extends BaseTest {

    @Test(description = "logs in with a valid user")
    @Priority("P0") @Severity("blocker") @Story("SHOP-101")
    public void valid_login() {
        driver.get("https://shoplite.example.com/login");

        Rl.step("fill credentials", () -> {                 // optional grouping
            driver.findElement(By.id("email")).sendKeys("demo@shop.io");
            driver.findElement(By.id("password")).sendKeys("Secret@123");
        });
        driver.findElement(By.id("submit")).click();

        Assert.assertEquals(driver.getTitle(), "My account");
    }
}
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```java
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;

@Owner("naveen") @Feature("login")
class LoginTest extends BaseTest {

    @Test
    @Priority("P0") @Severity("blocker") @Story("SHOP-101")
    void valid_login() {
        driver.get("https://shoplite.example.com/login");

        Rl.step("fill credentials", () -> {
            driver.findElement(By.id("email")).sendKeys("demo@shop.io");
            driver.findElement(By.id("password")).sendKeys("Secret@123");
        });
        driver.findElement(By.id("submit")).click();

        Assertions.assertEquals("My account", driver.getTitle());
    }
}
```

</TabItem>
</Tabs>

The report shows:

```
hook      Before Hooks                              2.3s
selenium  open https://shoplite.example.com/login   412ms
test.step fill credentials                          210ms
  selenium  type "demo@shop.io" into id: email      98ms
  selenium  type •••• into id: password             77ms
selenium  click id: submit                          116ms
hook      After Hooks                               14ms
```

## Screenshot policy — one config line

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.screenshot=on-failure
```

| Value | You get a screenshot… |
|---|---|
| `never` | never |
| `on-failure` *(default)* | only when the test fails — the usual CI setting |
| `always` | on every test — useful while hunting flaky tests |
| `only-on-pass` | only on passing tests |

A **skipped** test never gets one. Override per run with
`-Dreporting-labs.screenshot=always` or `REPORTING_LABS_SCREENSHOT=always`.

Want an extra screenshot mid-test? `RlSelenium.screenshot("after-login.png")`.

## Without the add-on — do it by hand

If you'd rather not wrap the driver, the manual pattern still works: take
the bytes yourself and let `Rl.shouldCaptureScreenshot()` apply the policy.

```java
@AfterMethod(alwaysRun = true)
public void tearDown() {
    if (Rl.shouldCaptureScreenshot()) {
        byte[] png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Rl.attach("screen.png", "image/png", png);
    }
    driver.quit();
}
```

Both frameworks tell reportingLabs a test finished *before* the after-hook
runs, so `Rl.attach()` from a teardown lands on the right test. You lose the
automatic steps, though.

## Appium

`AndroidDriver` / `IOSDriver` are WebDrivers — `RlSelenium.attach(driver)`
works unchanged, steps included.

## Next

- Run the same test for many rows from CSV / Excel / JSON → [Data-driven tests](/get-started/java/data-driven)
- Tag tests with priority, owner, feature → [Annotations](/get-started/java/annotations)
- Header chips, trend history, CI auto-detection → [Configuration](/get-started/java/configuration)
