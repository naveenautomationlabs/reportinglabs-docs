---
title: Playwright + Java
sidebar_label: Playwright + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Playwright + Java

**Zero code.** Add the dependency and your `BaseTest`, `PlaywrightFactory`
and page objects stay exactly as they are. The `Page` is found on the test
instance and the report fills itself: every click, fill and navigation as a
timed step with the failing one in red, a Playwright trace and a full-page
screenshot when the test fails. An `APIRequestContext` field is recorded the
same way, so API tests get the **API** tab with every request and response,
without a wrapper. The page's own network traffic (fonts, images, scripts)
stays out of the API tab; it is in the trace.

## Step 1. Add two dependencies

The reporter for your test framework, plus the Playwright add-on. Playwright for Java 1.47 or newer.

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```xml title="pom.xml"
<!-- the reporter for TestNG -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-testng</artifactId>
    <version>0.1.28</version>
    <scope>test</scope>
</dependency>
<!-- finds your Page, records API calls, trace and screenshot -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-playwright</artifactId>
    <version>0.1.28</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-testng:0.1.28'   // the reporter for TestNG
testImplementation 'dev.reportinglabs:reporting-labs-playwright:0.1.28'   // API calls, traces and screenshots from the Page
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```xml title="pom.xml"
<!-- the reporter for JUnit 5 -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-junit5</artifactId>
    <version>0.1.28</version>
    <scope>test</scope>
</dependency>
<!-- finds your Page, records API calls, trace and screenshot -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-playwright</artifactId>
    <version>0.1.28</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-junit5:0.1.28'   // the reporter for JUnit 5
testImplementation 'dev.reportinglabs:reporting-labs-playwright:0.1.28'   // API calls, traces and screenshots from the Page
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

## Step 3. Keep your test as it is

There is no call to add. When a test starts, the add-on looks at the test
instance for Playwright objects and wires them:

| It finds | Where it looks | What happens |
|---|---|---|
| `Page` | a field on the test class or a base class, a page object, a factory, a `ThreadLocal`, a list or map | every action as a step, trace and screenshot at the end per policy |
| `BrowserContext` | same places | every current and future page of the context, popups included |
| `Browser` | same places | every open context; pages created later in the test body through `browser.newPage()` / `newContext()` |
| `APIRequestContext` | a field or a `ThreadLocal` | the field is replaced with the recording wrapper, every `get/post/...` lands in the API tab |

Static holders count too: a `DriverFactory`-style class with a `static ThreadLocal<Page>`
that the test only reaches through `PlaywrightFactory.getPage()` is found through the
classes the test refers to. The scan repeats after every `@Before*` / `@After*`
hook, so a page created in `@BeforeMethod`, `@BeforeClass` or `@BeforeEach` is
seen before the first test runs.

A typical framework, unchanged:

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
public class BaseTest {
    protected PlaywrightFactory pf;
    protected Page page;
    protected LoginPage loginPage;

    @Parameters({"browser", "headless"})
    @BeforeMethod
    public void setUp(@Optional("chromium") String browser, @Optional("true") String headless) {
        pf = new PlaywrightFactory();
        page = pf.initBrowser(browser, Boolean.parseBoolean(headless));   // found here
        loginPage = new LoginPage(page);
    }

    @AfterMethod
    public void tearDown() { pf.tearDown(); }
}

@Owner("naveen") @Feature("home")
public class LoginTest extends BaseTest {
    @Test @Priority("P0")
    public void validLoginTest() {
        InventoryPage inventory = loginPage.doLogin("standard_user", "secret_sauce");
        Assert.assertEquals(inventory.getHeaderText(), "Products");
    }
}
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```java
@Owner("naveen") @Feature("home")
class HomeTest {
    Playwright playwright;
    Browser browser;
    Page page;

    @BeforeEach
    void setUp() {
        playwright = Playwright.create();
        browser    = playwright.chromium().launch();
        page       = browser.newPage();          // found here
    }

    @AfterEach
    void tearDown() { browser.close(); playwright.close(); }

    @Test @Priority("P0") @Severity("blocker")
    void loads_the_home_page() {
        Rl.log("navigating to example.com");
        page.navigate("https://example.com");
        Assertions.assertTrue(page.title().contains("Example"));
    }
}
```

</TabItem>
</Tabs>

`page.click()`, `page.fill()`, `page.request()` all work exactly as before;
nothing is wrapped that you can see.

**Attach by hand** when a page lives somewhere the scan cannot reach (a local
variable in a helper, an object outside your own packages): `RlPlaywright.attach(page)`
or `RlPlaywright.attach(context)` once after creating it. Calling it on a page the
scan already found is harmless. To switch the discovery off:
`reporting-labs.playwright.autoAttach=false`.

## Step 4. Run and open the report

```bash
mvn clean test        # or: ./gradlew clean test
```

| Build tool | Report |
|---|---|
| Maven | `target/reporting-labs/index.html` |
| Gradle | `build/reporting-labs/index.html` |

Open the file in a browser. It is self-contained: mail it, attach it to a ticket, drop it in Slack.

## What you get automatically

| Captured | Where it shows | Default policy |
|---|---|---|
| **Every action** — `navigate to …`, `fill #user-name with "…"`, `click #login-button`, `expect h1 to have text "…"` — with timing, the failing one marked red with its error. Read back from Playwright's own trace at the end of the test, so nothing is wrapped: `assertThat(page)` and `assertThat(locator)` keep working. Each action is filed under the `Rl.step()` block, hook or Cucumber step that was running when it happened. Values typed into password-like fields show as •••• | **Steps** on the test | always (`reporting-labs.playwright.steps=false` turns it off) |
| **Every `APIRequestContext` call** — method, URL, status, timing, request headers + body, response headers + body | **API** tab and the test's detail panel | always |
| **Playwright trace** (`trace.zip`) — drop it into [trace.playwright.dev](https://trace.playwright.dev) | Attachments on the test | never (set `reporting-labs.playwright.trace=on-failure`; recording snapshots costs about 70 ms per short test) |
| **Full-page screenshot** (`failure.png`; `screen.png` on a passing test with policy `always`) | Attachments on the test | on failure |
| **Video** (`video.webm`) when the context is created with `RlPlaywright.contextOptions()`, see below | Attachments on the test, playable inline | never (set `reporting-labs.playwright.video`) |
| **Where it failed**: the failing line (`FailuresTest.java:26`), a code snippet, and a plain-language reading of the error (element not found, assertion, site unreachable, test timed out) | Error block on the test, Failure clusters, Graphs | always |

![API tab of a Playwright Java run: every APIRequestContext call, with status, timing and the test it belongs to](/img/screenshots/14-playwright-java-api-light.png)

![A failed Playwright Java test: error, hooks, log, the API call it made, failure.png and trace.zip](/img/screenshots/13-playwright-java-detail-light.png)

In the test's detail panel each call expands to the full request and
response — headers, bodies — with **Copy as cURL** and **Copy URL** buttons,
exactly as in the Node.js report.

Sensitive headers (`Authorization`, `Cookie`, `X-Api-Key`, …) are masked as
`****` before they reach the report. Add your own keys with
`reporting-labs.maskKeys` — see [Configuration](/get-started/java/configuration).

## API tests — `APIRequestContext`

An `APIRequestContext` kept on the test (or in a `ThreadLocal`) is recorded
without any change: the field is swapped for a recording wrapper when the test
starts, and every `get/post/put/patch/delete/fetch` lands in the API tab.

```java
public class UsersApiTest {
    Playwright playwright;
    APIRequestContext request;                       // recorded as is

    @BeforeClass
    public void setUp() {
        playwright = Playwright.create();
        request = playwright.request().newContext(new APIRequest.NewContextOptions().setBaseURL(BASE_URL));
    }

    @Test
    public void createUser() {
        APIResponse res = request.post("/public/v2/users", RequestOptions.create()
            .setHeader("Authorization", "Bearer " + token)      // masked in the report
            .setData(Map.of("name", "Naveen", "email", email)));   // body recorded as JSON
        Assert.assertEquals(res.status(), 201);
    }
}
```

The page's own traffic is not an API call: a UI test's fonts, images and
scripts stay out of the API tab, exactly as in the Node.js reporter. The trace
zip has every request if you need one.

Two cases still need a line, because the object never sits on the test:
a context created inside the test body, or `page.request()`. Wrap it where it
is made and use the wrapper:

```java
APIRequestContext api = RlPlaywright.record(page.request());
api.get("/v1/orders", RequestOptions.create().setQueryParam("page", 1));
```

Every call is recorded with method, URL (query params included), request
headers and body (`setData` / `setForm` / `setMultipart`), status, timing,
response headers and the response body (text types, capped at 200 KB, the
same rules as `import 'reporting-labs/auto'` on the Node side). A connection
error is recorded as a failed call with the error message, then rethrown.

## Videos

Playwright records video per browser context, so the context has to be created with a recording folder.
`RlPlaywright.contextOptions()` returns `Browser.NewContextOptions` with that folder set whenever
`reporting-labs.video` is not `never`. Add your own options to it:

```java
context = browser.newContext(RlPlaywright.contextOptions().setViewportSize(1280, 800));
page    = context.newPage();
```

This is the one thing the discovery cannot do for you: Playwright decides at
context creation whether it records, so the folder has to be passed in.

```properties title="src/test/resources/reporting-labs.properties"
# never | on-failure | always | only-on-pass
reporting-labs.playwright.video=on-failure
```

Close the context in your after-hook as usual; the file is only complete then. Videos the policy wants are
copied to `target/reporting-labs/assets/` and play inline in the test's detail; the rest are deleted.

## Change what gets captured — one config line

Playwright auto-capture reads the capture policy from
`reporting-labs.properties`. No code change to flip it.

```properties title="src/test/resources/reporting-labs.properties"
# Playwright (reporting-labs-playwright)
reporting-labs.playwright.autoAttach=true
# every action as a step, read from the trace
reporting-labs.playwright.steps=true
# never | on-failure | always | only-on-pass
reporting-labs.playwright.screenshot=on-failure
# off by default: snapshots cost about 70 ms per short test
reporting-labs.playwright.trace=on-failure
# needs RlPlaywright.contextOptions(), see Videos
reporting-labs.playwright.video=never
```

With `trace=never` (the default) a lightweight trace without screenshots or
snapshots still runs for the steps; it costs nothing measurable. `steps=false`
switches that off too. A browser closed inside the test body (a
try-with-resources around `Playwright`) is gone before the test ends, so its
steps and screenshot cannot be collected; close it in your after-hook.

The plain `reporting-labs.screenshot` / `trace` / `video` keys are the
defaults for every tool; the `playwright.` ones win when both are set.

| Value | Screenshot / trace / video is attached… |
|---|---|
| `never` *(default for trace)* | never; for the trace only the lightweight step recording runs |
| `on-failure` *(default for screenshot)* | only when the test fails |
| `always` | on every test |
| `only-on-pass` | only on passing tests |

Per-run override without editing the file:

```bash
mvn test -Dreporting-labs.playwright.trace=always
```

## What it costs

Measured on a 240-test suite (200 UI tests against a local site, 40 API tests, four parallel classes), same machine, same run repeated:

| Setup | Suite time |
|---|---|
| No reporter on the classpath | 37 s |
| reportingLabs, defaults (steps on, screenshot on failure, trace off) | 36 s |
| reportingLabs with `playwright.trace=on-failure` | 54 s |

The step list and screenshots cost nothing measurable. Recording a full trace (DOM snapshots and screencast for every test, so the failing ones can be attached) is what costs, about 70 ms per short test; turn it on when you want `trace.zip` on failures. The report itself was written in under 200 ms after the last test, is 1 MB for those 240 tests with 10 failure screenshots embedded, and opens in a browser in about 0.2 s with the Tests, API and Graphs tabs each rendering in under 150 ms.

## Multi-tab flows

Popups and new tabs are covered when the discovery finds the `BrowserContext`
or the `Browser`: every current and future page of the context is wired. When
only the `Page` is reachable, the page's own context is hooked as well, so a
`window.open` from it still lands in the report. For a context created in a
helper and never stored, attach it once:

```java
BrowserContext context = browser.newContext();
RlPlaywright.attach(context);            // pages opened later are wired too
```

## Add your own detail

Auto-capture covers the browser. For anything else, the same `Rl.*` helpers
work inside a Playwright test:

```java
Rl.log("logging in as " + user);                   // step message
Rl.testData("Login", Map.of("user", user, "password", pw));   // password auto-masked
Rl.attach("cart.json", "application/json", bytes);            // any extra file
```

See [Annotations & `Rl.*` helpers](/get-started/java/annotations) for the full list.

## Next

- Tag tests so the report can rank them → [Annotations](/get-started/java/annotations)
- Run the same test against many rows → [Data-driven tests](/get-started/java/data-driven)
- Header chips, trend history, output folder → [Configuration](/get-started/java/configuration)

## Source and issues

The Java port lives in its own repository, separate from the Node.js reporter:

- Source and examples: [github.com/naveenautomationlabs/reporting-labs-java](https://github.com/naveenautomationlabs/reporting-labs-java)
- Bugs and requests: [reporting-labs-java/issues](https://github.com/naveenautomationlabs/reporting-labs-java/issues)
- Releases: [reporting-labs-java/releases](https://github.com/naveenautomationlabs/reporting-labs-java/releases) · Maven Central: [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs)
