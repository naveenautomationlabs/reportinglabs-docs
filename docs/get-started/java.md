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

## Data-driven tests

TestNG's `@DataProvider` works out of the box — every row becomes its own report row and the parameters are captured automatically as a **Parameters** block (no `Rl.testData()` call needed). Sensitive keys like `password`, `token`, `cvv` are masked as `****`.

For parameter **names** to show (`firstName`, `lastName`, …) instead of `arg0`, `arg1`, …, turn on `-parameters` for the test compiler:

```xml title="pom.xml"
<plugin>
  <artifactId>maven-compiler-plugin</artifactId>
  <configuration>
    <parameters>true</parameters>
  </configuration>
</plugin>
```

All the usual sources work:

<Tabs groupId="data-source">
<TabItem value="array" label="2D array" default>

```java
@DataProvider
public Object[][] users() {
    return new Object[][] {
        { "gaurav", "sharma",     "9878987678", "gaurav@123", "yes" },
        { "anurag", "automation", "9878987687", "anurag@123", "no"  },
        { "priya",  "automation", "2378987678", "priya@123",  "yes" },
    };
}

@Test(dataProvider = "users")
public void register(String firstName, String lastName, String phone, String password, String subscribe) {
    Rl.log("filling form for " + firstName);
    // 3 test rows in the report, each with its own Parameters block
}
```

</TabItem>
<TabItem value="csv" label="CSV">

```xml title="pom.xml"
<dependency>
  <groupId>com.opencsv</groupId>
  <artifactId>opencsv</artifactId>
  <version>5.9</version>
  <scope>test</scope>
</dependency>
```

```csv title="src/test/resources/users.csv"
firstName,lastName,phone,password,subscribe
gaurav,sharma,9878987678,gaurav@123,yes
anurag,automation,9878987687,anurag@123,no
priya,automation,2378987678,priya@123,yes
```

```java
@DataProvider
public Object[][] users() throws Exception {
    try (CSVReader r = new CSVReader(new InputStreamReader(
            getClass().getClassLoader().getResourceAsStream("users.csv")))) {
        List<String[]> rows = r.readAll();
        rows.remove(0);                       // drop header row
        return rows.toArray(new Object[0][]);
    }
}

@Test(dataProvider = "users")
public void register(String firstName, String lastName, String phone, String password, String subscribe) { /* ... */ }
```

</TabItem>
<TabItem value="json" label="JSON">

```xml title="pom.xml"
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.17.2</version>
  <scope>test</scope>
</dependency>
```

```json title="src/test/resources/users.json"
[
  { "firstName": "gaurav", "lastName": "sharma",     "phone": "9878987678", "password": "gaurav@123", "subscribe": "yes" },
  { "firstName": "anurag", "lastName": "automation", "phone": "9878987687", "password": "anurag@123", "subscribe": "no"  }
]
```

```java
@DataProvider
public Object[][] users() throws Exception {
    ObjectMapper om = new ObjectMapper();
    List<Map<String, Object>> rows = om.readValue(
        getClass().getClassLoader().getResourceAsStream("users.json"),
        om.getTypeFactory().constructCollectionType(List.class, Map.class));
    Object[][] out = new Object[rows.size()][5];
    for (int i = 0; i < rows.size(); i++) {
        Map<String, Object> r = rows.get(i);
        out[i] = new Object[] { r.get("firstName"), r.get("lastName"), r.get("phone"), r.get("password"), r.get("subscribe") };
    }
    return out;
}
```

</TabItem>
<TabItem value="excel" label="Excel (.xlsx)">

```xml title="pom.xml"
<dependency>
  <groupId>org.apache.poi</groupId>
  <artifactId>poi-ooxml</artifactId>
  <version>5.2.5</version>
  <scope>test</scope>
</dependency>
```

```java
@DataProvider
public Object[][] users() throws Exception {
    try (InputStream in = getClass().getClassLoader().getResourceAsStream("users.xlsx");
         Workbook wb = new XSSFWorkbook(in)) {
        Sheet sh = wb.getSheetAt(0);
        List<Object[]> rows = new ArrayList<>();
        for (int i = 1; i <= sh.getLastRowNum(); i++) {     // skip header
            Row r = sh.getRow(i);
            Object[] row = new Object[5];
            for (int c = 0; c < 5; c++) {
                Cell cell = r.getCell(c);
                row[c] = cell == null ? "" : cell.toString();
            }
            rows.add(row);
        }
        return rows.toArray(new Object[0][]);
    }
}
```

</TabItem>
</Tabs>

Verified end-to-end with a mixed 13-row suite (Array 3 + CSV 4 + JSON 3 + Excel 3) — every row lands as its own report entry with the right parameters, and `password` is masked automatically.

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

## Where the report lands

The report is one HTML file. Path is auto-picked so it works out of the box for both Maven and Gradle:

| Build tool | Default output | Wiped by |
|---|---|---|
| **Maven** | `target/reporting-labs/index.html` | `mvn clean` |
| **Gradle** | `build/reporting-labs/index.html` | `gradle clean` |
| Neither | `reporting-labs/index.html` (in the working directory) | — |

Both `target/` and `build/` are gitignored by default in the standard Maven/Gradle `.gitignore`, so nothing extra to configure.

Override with `reporting-labs.outputFolder`:

<Tabs groupId="build-tool">
<TabItem value="maven" label="Maven" default>

```bash
mvn test -Dreporting-labs.outputFolder=target/reports/qa
```

Or in `reporting-labs.properties`:
```properties
reporting-labs.outputFolder=target/reports/qa
```

</TabItem>
<TabItem value="gradle" label="Gradle">

```bash
./gradlew test -Dreporting-labs.outputFolder=build/reports/qa
```

Or in `build.gradle` set it as a system property on the `test` task:
```gradle
test {
  useTestNG()
  systemProperty 'reporting-labs.outputFolder', "$buildDir/reports/qa"
  systemProperty 'reporting-labs.title', 'Nightly'
}
```

</TabItem>
</Tabs>

## Configuration

Everything is optional. Set values in **three** interchangeable ways — the highest wins:

1. **System property** on the command line: `-Dreporting-labs.title="Nightly"`
2. **`src/test/resources/reporting-labs.properties`** file
3. **Environment variable**: `REPORTING_LABS_TITLE=Nightly` (dots → underscores, uppercased)

### Full reference — `reporting-labs.properties`

Copy this template as-is; every line is optional. Uncomment or tweak what you need.

```properties
# ─── Look & feel ─────────────────────────────────────────────────────────────
reporting-labs.title=Nightly regression
reporting-labs.outputFolder=target/reporting-labs
reporting-labs.outputFile=index.html
reporting-labs.theme=auto              # auto | light | dark
reporting-labs.palette=lab             # lab | ocean | ember | mono
# reporting-labs.accent=#7C3AED        # override palette accent with your brand color
# reporting-labs.customCss=.hdr .title{letter-spacing:.02em}
reporting-labs.embedFonts=true         # embed IBM Plex woff2 (offline-safe)
reporting-labs.editorLinks=false       # show "Open in IDE" links per test
reporting-labs.bdd=false               # style Given/When/Then as Gherkin
reporting-labs.open=never              # never | on-failure | always (auto-skipped in CI / headless)

# ─── Header ──────────────────────────────────────────────────────────────────
reporting-labs.project.name=ShopLite Web
reporting-labs.project.version=2.4.0
reporting-labs.project.team=QA Platform
reporting-labs.project.url=https://shoplite.example.com
reporting-labs.project.description=Frontend regression suite

# metadata.<name> becomes a chip. metadata.build labels the trend x-axis.
reporting-labs.metadata.build=ci-4287
reporting-labs.metadata.env=staging
reporting-labs.metadata.branch=release/2.4.0
reporting-labs.metadata.commit=abc123f
reporting-labs.metadata.region=apac

# Turn @Story("SHOP-231") etc. into clickable chips. {id} = annotation value.
reporting-labs.links.story=https://shoplite.atlassian.net/browse/{id}
reporting-labs.links.epic=https://shoplite.atlassian.net/browse/{id}
reporting-labs.links.issue=https://shoplite.atlassian.net/browse/{id}

# ─── Extra rows for the Environment card ────────────────────────────────────
# URLs become links automatically.
reporting-labs.env.App version=2.4.0
reporting-labs.env.Test data=staging-seed-12
reporting-labs.env.Docs=https://reportinglabs.dev

# ─── History + trend ────────────────────────────────────────────────────────
reporting-labs.history.enabled=true
reporting-labs.history.file=reporting-labs.history.json
reporting-labs.history.keep=30

# ─── Data masking ───────────────────────────────────────────────────────────
# Extra case-insensitive substrings to mask in testData / API headers, on
# top of the built-in defaults (password, token, authorization, cvv, ...).
# reporting-labs.maskKeys=internalCustomerId,phone

# ─── Charts / dimensions ────────────────────────────────────────────────────
reporting-labs.dimensions=priority,severity,owner,feature
reporting-labs.dimensionOrder.severity=blocker,critical,major,minor,trivial
reporting-labs.dimensionOrder.priority=P0,P1,P2,P3,P4

# ─── Widget toggles (all default to true) ───────────────────────────────────
# Uncomment any of these and set to false to hide the card.
# reporting-labs.widgets.trend=false
# reporting-labs.widgets.timeline=false
# reporting-labs.widgets.flaky=false
# reporting-labs.widgets.skipped=false
# reporting-labs.widgets.environment=false
# reporting-labs.widgets.needsAttention=false
# reporting-labs.widgets.failureClusters=false

# ─── Extra HTML sections rendered below the summary ─────────────────────────
# Any number of named sections. `title` and `html` are both required.
# reporting-labs.sections.release.title=Release notes
# reporting-labs.sections.release.html=<p>See <a href="https://example.com/changelog">changelog</a>.</p>
# reporting-labs.sections.oncall.title=On-call
# reporting-labs.sections.oncall.html=<p>QA: @naveen · SRE: @amit</p>

# ─── Parallel / project (informational) ─────────────────────────────────────
reporting-labs.workers=4
reporting-labs.projects=chromium,firefox
```

### Option cheat sheet

| Key | Default | What it does |
|---|---|---|
| `title` | `Test report` | Header title |
| `outputFolder` | Maven → `target/reporting-labs`, Gradle → `build/reporting-labs`, else `reporting-labs` (auto-detected) | Where the HTML file lands |
| `open` | `never` | `never` \| `on-failure` \| `always` — auto-open the report in the default browser; auto-skipped in CI / headless |
| `outputFile` | `index.html` | Report file name |
| `theme` | `auto` | `auto` \| `light` \| `dark` |
| `palette` | `lab` | `lab` \| `ocean` \| `ember` \| `mono` |
| `accent` | palette's own | Brand accent hex (e.g. `#7C3AED`) |
| `customCss` | – | Extra CSS appended to the report |
| `embedFonts` | `true` | Inline IBM Plex woff2 (~140 KB) |
| `editorLinks` | `false` | "Open in IDE" link per test |
| `bdd` | `false` | Gherkin-style Given/When/Then |
| `project.*` | – | `name`, `version`, `team`, `url`, `description` |
| `metadata.<key>` | – | Header chip (`build` labels the trend x-axis) |
| `links.<key>` | – | Turn a meta value into a link, `{id}` template |
| `env.<label>` | – | Extra row in the Environment card (URLs auto-link) |
| `history.enabled` | `true` | Write/read `reporting-labs.history.json` |
| `history.file` | `reporting-labs.history.json` | Path (relative to CWD) |
| `history.keep` | `30` | Max runs kept in history |
| `maskKeys` | – | Extra sensitive-key substrings to mask (comma-separated) |
| `dimensions` | `priority,severity,owner,feature` | Meta keys used in charts + filters |
| `dimensionOrder.<key>` | – | Custom sort order for that dimension's values |
| `widgets.<name>` | `true` | Toggle a card off (12 widgets) |
| `sections.<name>.title` + `.html` | – | Custom HTML block below the summary |
| `workers` | `1` | Shown in the header |
| `projects` | `java` | Shown in header + used by heatmap |

### CLI overrides (per-run)

```bash
mvn test \
  -Dreporting-labs.title="Nightly regression" \
  -Dreporting-labs.metadata.build=ci-4287 \
  -Dreporting-labs.metadata.env=staging \
  -Dreporting-labs.outputFolder=target/reporting-labs
```

### Environment variables (great for CI)

Rule: replace `.` with `_`, uppercase everything, prefix with `REPORTING_LABS_`.

```bash
export REPORTING_LABS_TITLE="Nightly"
export REPORTING_LABS_METADATA_BUILD="$CI_BUILD_ID"
export REPORTING_LABS_METADATA_ENV="staging"
mvn test
```

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
