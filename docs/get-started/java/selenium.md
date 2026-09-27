---
title: Selenium + Java
sidebar_label: Selenium + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Selenium + Java

With Selenium **your** base class owns the `WebDriver`, so reportingLabs
can't grab a screenshot on its own. The split is simple:

> **You take the screenshot bytes. reportingLabs decides whether to attach
> them — based on one config line.**

That decision is `Rl.shouldCaptureScreenshot()`. It reads
`reporting-labs.screenshot` (`on-failure` by default) and already knows
whether the test that just finished passed or failed — no `ITestResult`
juggling, no `TestWatcher`.

Finish [Step 1 on the Java overview](/get-started/java) first (install the
TestNG or JUnit 5 artifact). Nothing extra to install for Selenium.

## The BaseTest

Put this in your base class once. Every test class that extends it inherits
the behaviour.

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
import dev.reportinglabs.core.Rl;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public class BaseTest {

    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        driver = new ChromeDriver();
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver == null) return;

        // Policy check: true when reporting-labs.screenshot says "capture this one".
        if (Rl.shouldCaptureScreenshot()) {
            byte[] png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            Rl.attach("screen.png", "image/png", png);
        }

        driver.quit();
    }
}
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```java
import dev.reportinglabs.core.Rl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class BaseTest {

    protected WebDriver driver;

    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
    }

    @AfterEach
    void tearDown() {
        if (driver == null) return;

        // Policy check: true when reporting-labs.screenshot says "capture this one".
        if (Rl.shouldCaptureScreenshot()) {
            byte[] png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            Rl.attach("screen.png", "image/png", png);
        }

        driver.quit();
    }
}
```

</TabItem>
</Tabs>

**Why does this work from an after-hook?** Both TestNG and JUnit tell
reportingLabs "test finished" *before* your `@AfterMethod` / `@AfterEach`
runs. reportingLabs remembers the test that just ended on the current thread,
so `Rl.attach()`, `Rl.log()` and friends called from a teardown still land on
the right test. Parallel runs are safe — the memory is per thread.

## A test on top of it

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Map;

@Owner("naveen") @Feature("login")
public class LoginTest extends BaseTest {

    @Test(description = "logs in with a valid user")
    @Priority("P0") @Severity("blocker") @Story("SHOP-101")
    public void valid_login() {
        Rl.testData("Credentials", Map.of("user", "demo@shop.io", "password", "Secret@123"));

        Rl.log("opening login page");
        driver.get("https://shoplite.example.com/login");

        Rl.log("submitting form");
        driver.findElement(By.id("email")).sendKeys("demo@shop.io");
        driver.findElement(By.id("password")).sendKeys("Secret@123");
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

import java.util.Map;

@Owner("naveen") @Feature("login")
class LoginTest extends BaseTest {

    @Test
    @Priority("P0") @Severity("blocker") @Story("SHOP-101")
    void valid_login() {
        Rl.testData("Credentials", Map.of("user", "demo@shop.io", "password", "Secret@123"));

        Rl.log("opening login page");
        driver.get("https://shoplite.example.com/login");

        Rl.log("submitting form");
        driver.findElement(By.id("email")).sendKeys("demo@shop.io");
        driver.findElement(By.id("password")).sendKeys("Secret@123");
        driver.findElement(By.id("submit")).click();

        Assertions.assertEquals("My account", driver.getTitle());
    }
}
```

</TabItem>
</Tabs>

`password` is masked as `****` in the report automatically. The `Rl.log()`
lines become the step list; the screenshot shows under **Attachments** when
the test fails:

![Test detail — steps, data block and the attached screenshot](/img/screenshots/03-test-detail-light.png)

## Flip capture behaviour — one config line

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.screenshot=on-failure
```

| Value | You get a screenshot… |
|---|---|
| `never` | never — `Rl.shouldCaptureScreenshot()` always returns `false` |
| `on-failure` *(default)* | only when the test fails — the usual CI setting |
| `always` | on every test — useful while hunting flaky tests |
| `only-on-pass` | only on passing tests — proves a green run visually |

Override for one run without touching the file:

```bash
mvn test -Dreporting-labs.screenshot=always
```

```bash
export REPORTING_LABS_SCREENSHOT=on-failure   # env var form, handy in CI
```

## Parallel TestNG

The usual `ThreadLocal<WebDriver>` pattern works unchanged — reportingLabs
tracks the current test per thread as well, so `parallel="methods"` in
`testng.xml` keeps screenshots on the right rows. The report header shows the
real number of worker threads it saw.

## Recording video?

If you record with a tool like Monte Screen Recorder or a Selenium Grid video
sidecar, gate it the same way:

```java
if (Rl.shouldCaptureVideo()) {
    Rl.attach("run.mp4", "video/mp4", Files.readAllBytes(videoPath));
}
```

…and set `reporting-labs.video=on-failure` (default is `never`).

## Next

- Run the same test for many rows from CSV / Excel / JSON → [Data-driven tests](/get-started/java/data-driven)
- Tag tests with priority, owner, feature → [Annotations](/get-started/java/annotations)
- Header chips, trend history, CI auto-detection → [Configuration](/get-started/java/configuration)
