---
title: Java — pick your stack
sidebar_label: Java overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get started: Java

One report, any Java stack. reportingLabs plugs into your **test framework**
(JUnit 5 or TestNG) — it doesn't care whether the test body drives Playwright,
Selenium, REST Assured or plain Java.

Pick the guide for your tool; each one is complete on its own, from `pom.xml` to the open report:

| Your stack | Guide |
|---|---|
| Selenium (or Appium) | [Selenium + Java](/get-started/java/selenium): add the dependency, nothing else. Steps, screenshots, hooks, console output appear on their own. |
| Playwright | [Playwright + Java](/get-started/java/playwright): add the dependency, nothing else. Every action as a step, traces and screenshots from the Page it finds on your test, the API tab from your `APIRequestContext`. |
| REST Assured | [REST Assured + Java](/get-started/java/rest-assured): add the dependency, every request lands in the API tab. |
| Cucumber JVM | [Cucumber + Java](/get-started/java/cucumber): one property, one row per scenario with Given/When/Then as steps. |
| Anything else | [Other tools + Java](/get-started/java/other-tools): Karate, HttpClient, JDBC, Appium. |

Or install the framework artifact here and go from there.

![Java-generated report — Overview tab](/img/screenshots/08-java-overview-light.png)

*Real run of the JUnit 5 example that ships in the [reporting-labs-java repo](https://github.com/naveenautomationlabs/reporting-labs-java/tree/main/examples). Every language port renders the same template, so a Java report looks exactly like a Node.js one.*

## Step 1. Install for your test framework

All artifacts live under the `dev.reportinglabs` groupId on Maven Central.

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.22</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-testng:0.1.22'
```

**Nothing else to wire.** TestNG finds the listener through `ServiceLoader`.
If you already keep a `<listeners>` block in `testng.xml` you can list it
explicitly — both ways work:

```xml title="testng.xml (optional)"
<listeners>
  <listener class-name="dev.reportinglabs.testng.ReportingLabsListener"/>
</listeners>
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.22</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-junit5:0.1.22'
```

Then turn on JUnit's extension auto-detection — one file, one line:

```properties title="src/test/resources/junit-platform.properties"
junit.jupiter.extensions.autodetection.enabled=true
```

That is the whole setup. No `@ExtendWith` on any class.

Every JUnit shape is a row of its own: `@Test`, `@ParameterizedTest` (one row
per argument set, titled by its display name, a password column masked),
`@RepeatedTest`, `@TestFactory` dynamic tests (one row per dynamic test under
the factory, dynamic containers as tree levels), `@Nested` classes (tree by
`@DisplayName`, enclosing `@BeforeEach` / `@AfterEach` listed), tests inherited
from a base class or a test interface (the row points at the declaring file),
`@Disabled` methods and classes (skipped with the reason), assumptions
(skipped with the message), `@Timeout` (explained as a time-out), `@Tag`
(a tag chip), `TestReporter.publishEntry` (a log line), a failing `@BeforeEach`
(the test fails with the hook's error), a failing `@BeforeAll` (every test of
the class fails with it), a failing `@AfterEach` (fails the test, as JUnit
does), a failing `@AfterAll` (an error at the top of the report), and
junit-pioneer's `@RetryingTest` (attempts grouped, the test marked Flaky).
One limit: a `@Timeout` in `SEPARATE_THREAD` mode runs the body on another
thread, so `Rl.log` and `System.out` from inside it are not on the row.

</TabItem>
</Tabs>

## Step 2. Run and open the report

```bash
mvn test        # or: ./gradlew test
```

The report is a single HTML file:

| Build tool | Report path |
|---|---|
| Maven | `target/reporting-labs/index.html` |
| Gradle | `build/reporting-labs/index.html` |

Want it to open in the browser when a test fails? Add
`reporting-labs.open=on-failure` to `src/test/resources/reporting-labs.properties`.
Every other knob is in [Configuration](/get-started/java/configuration).

## Step 3. Open the guide for your tool

| Your stack | What the guide covers |
|---|---|
| [**Playwright + Java**](/get-started/java/playwright) | Zero code — add the dependency and the `Page`, `Browser` or `APIRequestContext` on your test is found automatically: every action as a step, trace zips and failure screenshots for UI tests, every request and response for API tests. Works with factories, base classes, `ThreadLocal` holders and parallel runs. |
| [**Selenium + Java**](/get-started/java/selenium) | Zero code — add the dependency and your existing `BaseTest` / `DriverFactory` / page objects are found automatically: every open/click/type as a timed step, the failing action marked, screenshots by policy, console output. Works with `@BeforeTest` drivers, `ThreadLocal` factories and parallel TestNG. |
| [**REST Assured + Java**](/get-started/java/rest-assured) | Zero code — add the dependency and every request/response lands in the API tab, with secrets masked. |
| [**Cucumber + Java**](/get-started/java/cucumber) | One property — every scenario is a row named after it, at its feature line, with the Gherkin steps, hooks, data tables and tags as filters. TestNG runner or JUnit Platform engine. |
| [**Other tools**](/get-started/java/other-tools) | Appium, Karate, `HttpClient`, JDBC — what works today and how. |

## Guides that apply to every stack

- [**Annotations & `Rl.*` helpers**](/get-started/java/annotations) — `@Priority`, `@Owner`, `@Feature`, `Rl.log()`, `Rl.testData()`, `Rl.attach()`.
- [**Data-driven tests**](/get-started/java/data-driven) — `@DataProvider` / `@ParameterizedTest` from arrays, CSV, JSON, Excel. Every row is its own report row.
- [**Configuration**](/get-started/java/configuration) — the full `reporting-labs.properties` reference, CI auto-detection, output folder, CLI and env-var overrides.

## Requirements

- JDK 11+
- Maven 3.9+ or Gradle 8+
- TestNG 7.10+ **or** JUnit Jupiter 5.10+
- Playwright for Java 1.47+ (only for the Playwright artifact)

## Source + release notes

- Source: [github.com/naveenautomationlabs/reporting-labs-java](https://github.com/naveenautomationlabs/reporting-labs-java)
- Releases: [github.com/naveenautomationlabs/reporting-labs-java/releases](https://github.com/naveenautomationlabs/reporting-labs-java/releases)
- Bugs and requests: [github.com/naveenautomationlabs/reporting-labs-java/issues](https://github.com/naveenautomationlabs/reporting-labs-java/issues)
- Maven Central: [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs)
