---
title: Selenium + Java
sidebar_label: Selenium + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Selenium + Java

**Zero code.** Add one dependency and every test that drives a WebDriver
gets a step-by-step trail (open, click, type, with timings), the failing
action highlighted, a screenshot per the capture policy, and the console
output of the test. No wrapper to call, no `@AfterMethod` screenshot code,
no listener of your own. Your `BaseTest`, `DriverFactory` and page objects
stay exactly as they are.

![Failed Selenium test — hooks, steps, the failing find in red, screenshot, console output](/img/screenshots/09-selenium-detail-light.png)

## Step 1. Add two dependencies

The reporter for your test framework, plus the Selenium add-on. Works with Selenium 4.x (it uses the
`EventFiringDecorator` that ships with `selenium-java`).

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```xml title="pom.xml"
<!-- the reporter for TestNG -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.29</version>
    <scope>test</scope>
</dependency>
<!-- zero-code Selenium steps and screenshots -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-selenium</artifactId>
    <version>0.1.29</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-testng:0.1.29'   // the reporter for TestNG
testImplementation 'dev.reportinglabs:reporting-labs-selenium:0.1.29'   // zero-code Selenium steps and screenshots
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```xml title="pom.xml"
<!-- the reporter for JUnit 5 -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.29</version>
    <scope>test</scope>
</dependency>
<!-- zero-code Selenium steps and screenshots -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-selenium</artifactId>
    <version>0.1.29</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-junit5:0.1.29'   // the reporter for JUnit 5
testImplementation 'dev.reportinglabs:reporting-labs-selenium:0.1.29'   // zero-code Selenium steps and screenshots
```

</TabItem>
</Tabs>

## Step 2. Register the reporter

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

Nothing to do. TestNG finds the listener on its own through `ServiceLoader`.

If your project already lists listeners in `testng.xml`, add this one there too. Both ways work:

```xml title="testng.xml (optional)"
<listeners>
    <listener class-name="dev.reportinglabs.testng.ReportingLabsListener"/>
</listeners>
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

One line in one file turns on JUnit's extension auto-detection. No `@ExtendWith` on any class.

```properties title="src/test/resources/junit-platform.properties"
junit.jupiter.extensions.autodetection.enabled=true
```

</TabItem>
</Tabs>

## Step 3. Run your tests as usual

Your `BaseTest`, `DriverFactory` and page objects stay exactly as they are. No `attach()`, no listener of your own.

```bash
mvn clean test        # or: ./gradlew clean test
```

| Build tool | Report |
|---|---|
| Maven | `target/reporting-labs/index.html` |
| Gradle | `build/reporting-labs/index.html` |

Open the file in a browser. It is self-contained: mail it, attach it to a ticket, drop it in Slack.

## Step 4. Open the report

![Overview of a Selenium run: pass rate, needs-attention list ranked by priority, failure clusters, flaky tests](/img/screenshots/10-selenium-overview-light.png)

Every test that drove the browser now shows:

- **Steps**: `open <url>`, `click id: submit`, `type "…" into name: email`, each with its duration, and the failing action in red.
- **Before Hooks / After Hooks**: `@BeforeTest setup`, `@BeforeClass regSetup`, `@AfterMethod …` with timings.
- **Attachments**: `screen.png` per the screenshot policy (default: on failure).
- **Console output**: every `System.out` / `System.err` line printed during the test, secrets masked.
- **Retries** grouped as attempts on one row, the test marked Flaky.

![A passing test: Selenium steps grouped under Rl.step(), the DataProvider row as Parameters, screenshot, console output](/img/screenshots/12-selenium-passed-light.png)

![A retried test: Attempt 1 failed, Retry 1 passed, marked Flaky](/img/screenshots/11-selenium-flaky-light.png)

## Step 5 (optional). Tags and config

Annotate tests so the report can rank and group them:

```java
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;

@Owner("naveen") @Feature("register")
public class RegisterPageTest extends BaseTest {

    @Test @Priority("P1") @Severity("critical") @Story("SHOP-811")
    public void userRegisterTest() {
        Rl.log("Registering a new user");                    // log line
        Rl.step("fill the form", () -> registerPage.fill(user));   // groups the Selenium steps under it
        RlSelenium.screenshot("after-register.png");         // extra screenshot mid-test
        Assert.assertTrue(registerPage.isRegistered());
    }
}
```

Everything else is optional and lives in one properties file:

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.title=OpenCart regression
reporting-labs.metadata.env=staging
# never | on-failure | always | only-on-pass
reporting-labs.selenium.screenshot=on-failure
# open the report in the browser when a test fails
reporting-labs.open=on-failure
```

Full list in [Configuration](/get-started/java/configuration).

## How it finds your driver

reportingLabs registers itself through `ServiceLoader`, so being on the test
classpath is enough. When a test starts (and again after every `@Before*`
hook) it looks at the test instance for a WebDriver and quietly swaps in a
step-recording decorator:

| Where your driver lives | Found? |
|---|---|
| A `WebDriver` field on the test class or any base class (`protected WebDriver driver;`) | Yes |
| A `ThreadLocal<WebDriver>` — instance or `static`, e.g. `DriverFactory.tlDriver` reached through a `df` field on your `BaseTest` | Yes — `getDriver()` returns the recording driver |
| A `WebDriver` held by a page object, `ElementUtil` or any helper object that hangs off the test instance (up to three levels deep) | Yes — page objects built before the test started record too |
| A static holder in a class the test only calls (`DriverManager.getDriver()`) | Yes — the classes your test refers to are looked at too, two hops out |
| A driver created *inside* the `@Test` body and stored in a field | Screenshot yes, steps no (it appears too late for the recorder) |
| A field typed as a concrete class (`ChromeDriver driver;`) | Screenshot yes; steps only for actions that go through page objects holding it as `WebDriver` |
| A driver made in a Cucumber `@Before` hook and kept in a static factory | Yes — see [Cucumber](/get-started/java/cucumber) |
| A local variable that never lands in a field, or a holder in a class outside your own packages | No — call `RlSelenium.attach(driver)` once after creating it (see below) |

A quit driver left behind in a `ThreadLocal` (a factory that never calls
`remove()`) does no harm: the screenshot goes to the driver the test actually
used, and a driver with no session left is skipped.

This is the typical shape and it needs nothing from you:

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
public class BaseTest {
    protected WebDriver driver;
    protected Properties prop;
    DriverFactory df;
    protected LoginPage loginPage;

    @BeforeTest
    public void setup() {
        df = new DriverFactory();
        prop = df.initProp();
        driver = df.initDriver(prop);          // your own factory, untouched
        loginPage = new LoginPage(driver);
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
public class BaseTest {
    protected WebDriver driver;
    protected LoginPage loginPage;

    @BeforeEach
    void setUp() {
        driver = new DriverFactory().initDriver();   // your own factory, untouched
        loginPage = new LoginPage(driver);
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
per **test**. A `ThreadLocal<WebDriver>` factory for `parallel="methods"`
works the same way, each thread gets its own recording driver.

Already taking your own screenshot in `@AfterMethod`? Keep it. If you attach
it as `screen.png` it replaces the automatic one, so you never get two.

To switch the auto-discovery off: `reporting-labs.selenium.autoAttach=false`.

### When the driver is out of sight — `RlSelenium.attach`

For a driver that lives only in a local variable, or in a static holder no
field of the test points to, wrap it yourself once and use the returned
driver:

```java
driver = RlSelenium.attach(new ChromeDriver());
```

`attach()` is idempotent — wrapping a driver twice, or wrapping one the
auto-discovery already found, returns the same recording driver.

## What you get automatically

| Captured | Where it shows |
|---|---|
| **Steps** — `open <url>`, `click id: submit`, `type "…" into name: email`, `clear`, `submit`, `navigate back`, `refresh`, `accept alert`, `switch to frame`, `switch to window`, `switch to default content`, `open new tab`, `run script "…"`, `perform actions: pointerMove, pointerDown` — each with its duration. An element found from another element reads `click css selector: .row -> tag name: button` | **Steps** in the test detail; nested under your `Rl.step()` blocks and under the hook that ran them |
| **The failing action** — a `NoSuchElementException` on `findElement`, a stale click — marked red with the exception | Steps (and the error block above them) |
| **Before / After hooks** — `@BeforeTest setup`, `@BeforeClass regSetup`, `@AfterMethod …` (TestNG) and `@BeforeAll`, `@BeforeEach`, `@AfterEach`, `@AfterAll` (JUnit 5, `@Nested` classes included) with timings | Steps → *Before Hooks* / *After Hooks* |
| **Screenshot** per `reporting-labs.selenium.screenshot` (default `on-failure`) | Attachments |
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
reporting-labs.selenium.screenshot=on-failure
```

| Value | You get a screenshot… |
|---|---|
| `never` | never |
| `on-failure` *(default)* | only when the test fails — the usual CI setting |
| `always` | on every test — useful while hunting flaky tests |
| `only-on-pass` | only on passing tests |

A **skipped** test never gets one. Override per run with
`-Dreporting-labs.selenium.screenshot=always`.

Want an extra screenshot mid-test? `RlSelenium.screenshot("after-login.png")`.

## Without the add-on — do it by hand

If you'd rather not add the Selenium artifact, the manual pattern still
works: take the bytes yourself and let `Rl.shouldCaptureScreenshot()` apply
the policy.

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

`AndroidDriver` / `IOSDriver` are WebDrivers — the same auto-discovery
finds them, steps included.

## Next

- Run the same test for many rows from CSV / Excel / JSON → [Data-driven tests](/get-started/java/data-driven)
- Tag tests with priority, owner, feature → [Annotations](/get-started/java/annotations)
- Header chips, trend history, CI auto-detection → [Configuration](/get-started/java/configuration)

## Source and issues

The Java port lives in its own repository, separate from the Node.js reporter:

- Source and examples: [github.com/naveenautomationlabs/reporting-labs-java](https://github.com/naveenautomationlabs/reporting-labs-java)
- Bugs and requests: [reporting-labs-java/issues](https://github.com/naveenautomationlabs/reporting-labs-java/issues)
- Releases: [reporting-labs-java/releases](https://github.com/naveenautomationlabs/reporting-labs-java/releases) · Maven Central: [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs)
