---
title: Playwright + Java
sidebar_label: Playwright + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Playwright + Java

**One line per test.** `RlPlaywright.attach(page)` and the report fills itself:
every network call the page makes, a Playwright trace, and a full-page
screenshot when the test fails.

Finish [Step 1 on the Java overview](/get-started/java) first (install the
TestNG or JUnit 5 artifact). Then add the Playwright add-on:

```xml title="pom.xml"
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-playwright</artifactId>
    <version>0.1.10</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-playwright:0.1.10'
```

## The one line

Call `RlPlaywright.attach(page)` right after you create the page — usually in
your before-each hook.

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
import com.microsoft.playwright.*;
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import dev.reportinglabs.playwright.RlPlaywright;
import org.testng.Assert;
import org.testng.annotations.*;

@Owner("naveen") @Feature("home")
public class HomeTest {

    Playwright playwright;
    Browser browser;
    Page page;

    @BeforeMethod
    public void setUp() {
        playwright = Playwright.create();
        browser    = playwright.chromium().launch();
        page       = browser.newPage();
        RlPlaywright.attach(page);          // <-- the one line
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }

    @Test @Priority("P0") @Severity("blocker")
    public void loads_the_home_page() {
        Rl.log("navigating to example.com");
        page.navigate("https://example.com");
        Assert.assertTrue(page.title().contains("Example"));
    }
}
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```java
import com.microsoft.playwright.*;
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import dev.reportinglabs.playwright.RlPlaywright;
import org.junit.jupiter.api.*;

@Owner("naveen") @Feature("home")
class HomeTest {

    Playwright playwright;
    Browser browser;
    Page page;

    @BeforeEach
    void setUp() {
        playwright = Playwright.create();
        browser    = playwright.chromium().launch();
        page       = browser.newPage();
        RlPlaywright.attach(page);          // <-- the one line
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

</TabItem>
</Tabs>

Nothing else in the test changes — `page.click()`, `page.fill()`,
`page.request()` all work exactly as before.

## What you get automatically

| Captured | Where it shows | Default policy |
|---|---|---|
| **Every request the page makes** — method, URL, status, timing, request headers + body, response headers; response body for XHR/fetch calls | **API** tab and the test's detail panel | always |
| **Playwright trace** (`trace.zip`) — drop it into [trace.playwright.dev](https://trace.playwright.dev) | Attachments on the test | on failure |
| **Full-page screenshot** (`failure.png`) | Attachments on the test | on failure |

![API tab — every call the page made, with status and timing](/img/screenshots/05-api-light.png)

![Test detail — attachments panel](/img/screenshots/03-test-detail-light.png)

In the test's detail panel each call expands to the full request and
response — headers, bodies — with **Copy as cURL** and **Copy URL** buttons,
exactly as in the Node.js report.

Sensitive headers (`Authorization`, `Cookie`, `X-Api-Key`, …) are masked as
`****` before they reach the report. Add your own keys with
`reporting-labs.maskKeys` — see [Configuration](/get-started/java/configuration).

## API tests — `page.request()` and `APIRequestContext`

Calls made through Playwright's API client don't go through the page, so
they need one more line: wrap the context with `RlPlaywright.record(...)` and
use the wrapper.

```java
APIRequestContext api = RlPlaywright.record(page.request());

api.get("/v1/orders", RequestOptions.create()
    .setHeader("Authorization", "Bearer " + token)
    .setQueryParam("page", 1));

api.post("/v1/orders", RequestOptions.create()
    .setHeader("Authorization", "Bearer " + token)
    .setData(Map.of("sku", "JEAN-BLUE-32", "qty", 1)));   // body recorded as JSON
```

Standalone contexts work the same way:

```java
APIRequestContext api = RlPlaywright.record(playwright.request().newContext());
```

Every call is recorded with method, URL (query params included), request
headers and body (`setData` / `setForm` / `setMultipart`), status, timing,
response headers and the response body (text types, capped at 200 KB — the
same rules as `import 'reporting-labs/auto'` on the Node side). A connection
error is recorded as a failed call with the error message, then rethrown.
Outside a test the wrapper simply delegates.

## Change what gets captured — one config line

Playwright auto-capture reads the capture policy from
`reporting-labs.properties`. No code change to flip it.

```properties title="src/test/resources/reporting-labs.properties"
# never | on-failure | always | only-on-pass
reporting-labs.screenshot=on-failure
# never | on-failure | always | only-on-pass
reporting-labs.trace=on-failure
```

| Value | Screenshot / trace is attached… |
|---|---|
| `never` | never — trace recording is not even started, so no overhead |
| `on-failure` *(default)* | only when the test fails |
| `always` | on every test |
| `only-on-pass` | only on passing tests |

Per-run override without editing the file:

```bash
mvn test -Dreporting-labs.trace=always
```

## Multi-tab flows — attach the whole context

If your test opens popups or new tabs, attach the `BrowserContext` once and
every current **and future** page is wired:

```java
BrowserContext context = browser.newContext();
RlPlaywright.attach(context);            // pages opened later are auto-wired too
Page page = context.newPage();
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
