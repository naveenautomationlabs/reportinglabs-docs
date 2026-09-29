---
title: Other tools + Java
sidebar_label: Other tools + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Other tools + Java

reportingLabs hooks into the **test framework** lifecycle — the `@Test`
start and finish. It never looks inside the test body. So anything that runs
under TestNG or JUnit 5 is reported, and the `Rl.*` helpers work from
anywhere in that body.

## Install (same for every tool)

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```xml title="pom.xml"
<!-- the reporter for TestNG -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.11</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-testng:0.1.11'   // the reporter for TestNG
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```xml title="pom.xml"
<!-- the reporter for JUnit 5 -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.11</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-junit5:0.1.11'   // the reporter for JUnit 5
```

</TabItem>
</Tabs>

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

Then `mvn clean test` and open `target/reporting-labs/index.html` (Gradle: `build/reporting-labs/index.html`).

Here's what that means tool by tool.

## Appium (Android / iOS)

Identical to [Selenium](/get-started/java/selenium): with the
`reporting-labs-selenium` dependency on the classpath an `AndroidDriver` /
`IOSDriver` field is found the same way and every tap, type and find becomes
a step. Without the add-on, both drivers implement `TakesScreenshot`, so the
manual `BaseTest` `tearDown()` works verbatim:

```java
@AfterMethod(alwaysRun = true)
public void tearDown() {
    if (Rl.shouldCaptureScreenshot()) {
        Rl.attach("screen.png", "image/png",
                  ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES));
    }
    driver.quit();
}
```

Add device info as chips so the header shows what ran:

```java
Rl.meta("device", caps.getCapability("deviceName").toString());
Rl.meta("platform", "android");
```

## Cucumber JVM

**Via the TestNG runner** (`AbstractTestNGCucumberTests`): every scenario runs
as one TestNG test, so every scenario becomes one row in the report. Call
`Rl.log()` / `Rl.testData()` / `Rl.attach()` from step definitions or hooks —
they attach to the scenario that is running. The scenario name appears in the
row's **Parameters** block.

```java
public class RunCucumberTest extends AbstractTestNGCucumberTests {
    @Override @DataProvider(parallel = true)
    public Object[][] scenarios() { return super.scenarios(); }
}
```

```java
// in your step definitions
@When("I add {string} to the cart")
public void addToCart(String sku) {
    Rl.log("adding " + sku);
    // ...
}
```

**Via the JUnit Platform engine** (`@Suite` + `cucumber-junit-platform-engine`):
scenarios run on Cucumber's own engine, not Jupiter, so the JUnit 5 extension
does not see them. Use the TestNG runner for now — first-class Cucumber support
(scenario titles, Gherkin steps in the log) is planned.

## Karate

Karate's JUnit 5 runner executes features as dynamic tests, which the Jupiter
extension does not observe today. A dedicated Karate hook is on the roadmap.
Until then, Karate's own HTML report remains the right place for feature-level
detail.

## Plain `HttpClient`, OkHttp, Retrofit

Record the call yourself — it's one line after the request:

```java
HttpResponse<String> r = client.send(request, HttpResponse.BodyHandlers.ofString());
Rl.api(request.method(), request.uri().toString(), r.statusCode());
```

Want headers and bodies in the API tab too? Use the long form — see
[REST Assured → record one call by hand](/get-started/java/rest-assured#not-rest-assured-record-one-call-by-hand)
for the full signature.

## JDBC / database checks

Pin the query and the row you asserted on as a data block:

```java
Rl.testData("Order row", Map.of(
    "sql",   "select status, total from orders where id = ?",
    "id",    orderId,
    "status", rs.getString("status"),
    "total",  rs.getBigDecimal("total")
));
```

## Anything else

If it runs inside a TestNG or JUnit 5 `@Test`, it's already in the report. To
add detail, the whole toolbox is:

```java
Rl.log("step message");                             // step list
Rl.meta("region", "apac");                          // chip on the test
Rl.testData("Name", mapOrObject);                   // pinned data block (masked)
Rl.api("GET", "/v1/x", 200);                        // API row
Rl.attach("file.ext", "content/type", bytes);       // any file
```

All of them are no-ops outside a test, so they're safe in shared utilities.
Details in [Annotations & `Rl.*` helpers](/get-started/java/annotations).
