---
title: Cucumber + Java
sidebar_label: Cucumber + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cucumber JVM + Java

**One property.** Add the `reporting-labs-cucumber` plugin and every scenario
becomes one row in the report, named after the scenario and pointing at its
line in the `.feature` file. The Gherkin steps are the steps, hooks are hooks,
tags become filters, and Scenario Outline rows carry their example values.
Nothing changes in your step definitions.

![A failed scenario: the undefined step marked in red at orders.feature:40, the feature file snippet, the step after it shown as not run](/img/screenshots/18-cucumber-detail-light.png)

Works with the **TestNG runner** (`AbstractTestNGCucumberTests`) and the
**JUnit Platform engine** (`cucumber-junit-platform-engine`), serial or
parallel, Cucumber 7.x.

## Step 1. Add the dependencies

<Tabs groupId="cucumber-runner">
<TabItem value="testng" label="TestNG runner" default>

The reporter for TestNG (it already opens a row per scenario) plus the Cucumber
plugin (it names the row and fills it in).

```xml title="pom.xml"
<!-- the reporter for TestNG -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.14</version>
    <scope>test</scope>
</dependency>
<!-- the Cucumber plugin -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-cucumber</artifactId>
    <version>0.1.14</version>
    <scope>test</scope>
</dependency>
```

Your runner stays what it is:

```java title="src/test/java/com/example/RunCucumberTest.java"
@CucumberOptions(features = "src/test/resources/features", glue = "com.example")
public class RunCucumberTest extends AbstractTestNGCucumberTests {
    @Override @DataProvider(parallel = true)
    public Object[][] scenarios() { return super.scenarios(); }
}
```

</TabItem>
<TabItem value="junit-platform" label="JUnit Platform engine">

The plugin alone is enough: scenarios run on Cucumber's own engine, and the
plugin opens and closes each row itself.

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-cucumber</artifactId>
    <version>0.1.14</version>
    <scope>test</scope>
</dependency>
```

```java title="src/test/java/com/example/RunCucumberTest.java"
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
public class RunCucumberTest { }
```

</TabItem>
</Tabs>

Gradle: `testImplementation("dev.reportinglabs:reporting-labs-cucumber:0.1.14")`
(plus `reporting-labs-testng` with the TestNG runner).

## Step 2. Register the plugin

One line, in the file your runner reads. This is the only configuration.

<Tabs groupId="cucumber-runner">
<TabItem value="testng" label="TestNG runner" default>

```properties title="src/test/resources/cucumber.properties"
cucumber.plugin=dev.reportinglabs.cucumber.ReportingLabsPlugin
```

Or on the runner class, next to the plugins you already list:

```java
@CucumberOptions(plugin = { "dev.reportinglabs.cucumber.ReportingLabsPlugin", "pretty" }, ...)
```

</TabItem>
<TabItem value="junit-platform" label="JUnit Platform engine">

```properties title="src/test/resources/junit-platform.properties"
cucumber.plugin=dev.reportinglabs.cucumber.ReportingLabsPlugin
```

The JUnit Platform engine does not read `cucumber.properties`; the key goes in
`junit-platform.properties` (or a `@ConfigurationParameter` on the suite).

</TabItem>
</Tabs>

## Step 3. Run and open

```bash
mvn test
```

Open `target/reporting-labs/index.html` (Gradle: `build/reporting-labs/index.html`).

![Overview of a Cucumber run: one row per scenario, grouped by feature file](/img/screenshots/17-cucumber-overview-light.png)

## Step 4. Turn on BDD styling (optional)

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.title=Orders — Cucumber JVM
reporting-labs.bdd=true
```

With `bdd=true` the step list highlights **Given / When / Then / And** and drops
the category chips, so it reads like the feature file. Everything else in
[Configuration](/get-started/java/configuration) applies: output folder,
history file, screenshot policy for a Selenium driver used from step definitions.

## What the report shows

| In the feature file | In the report |
|---|---|
| `Scenario: Missing token is rejected` | Row titled **Missing token is rejected**, file `orders.feature:13`, under the feature name in the tree |
| `Given` / `When` / `Then` / `And` steps, Background included | One step each, in order, with timing; the failing one in red with its message |
| A step after a failure | Shown as **not run** in grey, so you can tell "never ran" from "passed" |
| A step with no step definition | The row fails at that step, the error points at the feature line with a snippet, and the explanation says which expression to write |
| `@Before` / `@After` / `@BeforeStep` / `@AfterStep` hooks | Under **Before Hooks** / **After Hooks** with the method name; a failed hook fails the scenario |
| `Scenario Outline` rows | One row per Examples line, titled `Create orders per row (JEAN-BLUE-32, 1)`, with an **Examples** data block; history and "new vs known" work per row |
| A data table under a step | A table in the test data section, named after the step |
| A doc string under a step | A text block, named after the step, secrets masked |
| `System.out` from step definitions | Console output on the row, colour codes from the `pretty` plugin stripped |
| REST Assured calls, Selenium actions | Recorded as on any other test once the [REST Assured](/get-started/java/rest-assured) or [Selenium](/get-started/java/selenium) add-on is on the classpath |

![A scenario with a data table: the table pinned as test data, the two POST calls it made in the API section](/img/screenshots/19-cucumber-table-light.png)

## Tags become filters

Feature and scenario tags are read on every scenario. A few shapes have a
meaning of their own; everything else is a plain tag you can search and filter by.

| Tag | Where it lands |
|---|---|
| `@P0` … `@P4` | Priority. Failures on the Overview are ranked by it |
| `@blocker` `@critical` `@major` `@normal` `@minor` `@trivial` | Severity |
| `@owner:naveen` (or `@owner=naveen`) | Owner chip; the Owners chart on the Graphs tab |
| `@story:SHOP-231`, `@feature:checkout`, any `@key:value` | A meta chip named after the key |
| `@smoke`, `@regression`, anything else | Tag |

```gherkin
@orders @P1 @owner:naveen
Feature: Orders API

  @smoke
  Scenario: List orders with a valid token
    When I list orders with token "abc-123"
    Then the status is 200
```

## Add your own from step definitions

The `Rl` helpers attach to the scenario that is running, from any step
definition or hook:

```java
@When("I list orders with token {string}")
public void listOrders(String token) {
    Rl.log("listing orders");                       // Log line
    Rl.meta("env", System.getProperty("env"));      // chip on the row
    Rl.testData("Request", Map.of("token", token)); // pinned, token masked
    last = given().header("Authorization", "Bearer " + token).get("/v1/orders");
}
```

## Parallel runs

Both runners are fine in parallel: `@DataProvider(parallel = true)` on the
TestNG runner, or `cucumber.execution.parallel.enabled=true` on the JUnit
Platform engine. Each scenario is recorded on the thread that runs it, and the
Timeline shows one lane per worker.

## Troubleshooting

**Rows are titled "Runs Cucumber Scenarios" with the scenario name under Parameters.**
The plugin is not registered. Check the `cucumber.plugin` line is in the file
your runner reads (Step 2), and that `reporting-labs-cucumber` is on the test
classpath.

**JUnit Platform: nothing from the plugin at all.** `cucumber.properties` is
ignored by the engine; move the line to `junit-platform.properties`.

**The file column shows `features/orders.feature` instead of `src/test/resources/features/orders.feature`.**
The features are not under `src/test/resources` (or `src/main/resources`), so the
classpath path is shown as is. The row still works; only the label differs.

**Steps from a `pretty` plugin show up twice.** They do not: the step list is
built from Cucumber's events, the console block is your `System.out`. Drop
`pretty` from `cucumber.plugin` if you do not want its output in the console block.

## Source and issues

The Java port lives in its own repository, separate from the Node.js reporter:

- Source and examples: [github.com/naveenautomationlabs/reporting-labs-java](https://github.com/naveenautomationlabs/reporting-labs-java)
- Bugs and requests: [reporting-labs-java/issues](https://github.com/naveenautomationlabs/reporting-labs-java/issues)
- Releases: [reporting-labs-java/releases](https://github.com/naveenautomationlabs/reporting-labs-java/releases) · Maven Central: [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs)
