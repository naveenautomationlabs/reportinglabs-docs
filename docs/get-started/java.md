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
| Playwright | [Playwright + Java](/get-started/java/playwright): one line, `RlPlaywright.attach(page)`, for API calls, traces and screenshots. |
| REST Assured | [REST Assured + Java](/get-started/java/rest-assured): a 30-line filter, registered once. |
| Anything else | [Other tools + Java](/get-started/java/other-tools): Cucumber, Karate, HttpClient, JDBC. |

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
    <version>0.1.11</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-testng:0.1.11'
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
    <version>0.1.11</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-junit5:0.1.11'
```

Then turn on JUnit's extension auto-detection — one file, one line:

```properties title="src/test/resources/junit-platform.properties"
junit.jupiter.extensions.autodetection.enabled=true
```

That is the whole setup. No `@ExtendWith` on any class.

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
| [**Playwright + Java**](/get-started/java/playwright) | One line — `RlPlaywright.attach(page)` — gives you API calls, trace zips and failure screenshots automatically. |
| [**Selenium + Java**](/get-started/java/selenium) | Zero code — add the dependency and your existing `BaseTest` / `DriverFactory` / page objects are found automatically: every open/click/type as a timed step, the failing action marked, screenshots by policy, console output. Works with `@BeforeTest` drivers, `ThreadLocal` factories and parallel TestNG. |
| [**REST Assured + Java**](/get-started/java/rest-assured) | A 25-line filter that records every request/response into the API tab, with secrets masked. |
| [**Other tools**](/get-started/java/other-tools) | Appium, Cucumber JVM, Karate, `HttpClient`, JDBC — what works today and how. |

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
- Maven Central: [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs)
