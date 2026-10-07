---
title: REST Assured + Java
sidebar_label: REST Assured + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# REST Assured + Java

**Zero code.** Add one dependency and every request your REST Assured tests make
shows up in the report's **API** tab: method, URL, status, timing, request and
response headers and bodies, with secrets masked. No filter to write, nothing to
register in a base class.

![API tab of a REST Assured run: every call with method, status, timing and the test it belongs to](/img/screenshots/16-rest-assured-api-light.png)

## Step 1. Add two dependencies

The reporter for your test framework, plus the REST Assured add-on. Works with REST Assured 4.x, 5.x and 6.x.

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
<!-- records every REST Assured call -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-rest-assured</artifactId>
    <version>0.1.28</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-testng:0.1.28'         // the reporter for TestNG
testImplementation 'dev.reportinglabs:reporting-labs-rest-assured:0.1.28'   // records every REST Assured call
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
<!-- records every REST Assured call -->
<dependency>
    <groupId>dev.reportinglabs</groupId>
    <artifactId>reporting-labs-rest-assured</artifactId>
    <version>0.1.28</version>
    <scope>test</scope>
</dependency>
```

```gradle title="build.gradle"
testImplementation 'dev.reportinglabs:reporting-labs-junit5:0.1.28'         // the reporter for JUnit 5
testImplementation 'dev.reportinglabs:reporting-labs-rest-assured:0.1.28'   // records every REST Assured call
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

## Step 3. Write tests as usual

Your `given().when().then()` code stays exactly as it is. The add-on puts its
filter into `RestAssured.filters()` when the run starts and puts it back at
every lifecycle point (test start, after each `@Before*` / `@After*`, each
Cucumber step), so a `RestAssured.reset()` or `replaceFiltersWith(...)` in a
hook costs nothing. Your own `RestAssured.filters(...)` and
`given().filter(...)` run alongside it.

```java
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@Owner("naveen") @Feature("orders")
public class OrdersApiTest {

    @Test(description = "creates an order")
    @Priority("P0") @Severity("blocker") @Story("SHOP-231")
    public void creates_order() {
        Rl.log("POST /v1/orders");

        given()
            .header("Authorization", "Bearer " + token)
            .contentType("application/json")
            .body("{\"sku\":\"JEAN-BLUE-32\",\"qty\":1}")
        .when()
            .post("https://api.shoplite.example.com/v1/orders")
        .then()
            .statusCode(201)
            .body("status", equalTo("CREATED"));
    }
}
```

## Step 4. Run and open the report

```bash
mvn clean test        # or: ./gradlew clean test
```

| Build tool | Report |
|---|---|
| Maven | `target/reporting-labs/index.html` |
| Gradle | `build/reporting-labs/index.html` |

The call shows under the test **and** in the suite-wide API tab. Click the row for
headers and bodies on both sides, with **Copy as cURL**:

![Test detail: the POST /v1/orders call expanded, request and response headers and bodies, secrets masked, Copy as cURL](/img/screenshots/15-rest-assured-detail-light.png)

## What gets recorded

| | |
|---|---|
| Method, URL | Query and path params resolved, as REST Assured sent them |
| Status, timing | Round trip in ms |
| Request headers and body | JSON / XML / text bodies as-is; form fields as `a=1&b=2`; multipart as the part names, file names and sizes |
| Response headers and body | Text types (JSON, XML, HTML, text) up to 200 KB, then truncated; binary types as `<application/pdf 34 KB>` |
| Failed requests | A connection error is recorded with status 0 and the error message, then rethrown |

Already have your own recording filter from an earlier version? Remove it, or
every call shows twice.

One case is out of reach: `RestAssured.reset()` or `replaceFiltersWith(...)`
*inside a test body* drops the filter for the rest of that test (the next test
gets it back). If you must reset mid-test, add the filter back on the same line:

```java
RestAssured.reset();
RestAssured.filters(new dev.reportinglabs.restassured.RlRestAssuredFilter());
```

To switch the automatic filter off: `reporting-labs.restassured.autoRecord=false`.
You can then add it yourself, globally or per request:

```java
RestAssured.filters(new dev.reportinglabs.restassured.RlRestAssuredFilter());   // global
given().filter(new RlRestAssuredFilter()).get("/v1/health");                       // one request
```

## What gets masked

Headers whose name contains `authorization`, `cookie`, `token`, `api-key`,
`secret`, `password` (and more) are replaced with `****` before they reach the
report. `Bearer super-secret` never lands in the HTML.

Add your own with a comma-separated list:

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.maskKeys=x-tenant-secret,internalCustomerId
```

Bodies are masked too: `"password":"…"`, `token=…`, `Bearer …` and JWT-shaped
values inside a JSON, form or text body show as `****`.

The same masker runs over log lines, `System.out` / `System.err`, step titles,
error messages and data blocks, and it remembers what it masked: once a value
has been seen under a sensitive key (`password=…`, a `Credentials` data block,
a `PASSWORD` environment variable), that value is blanked wherever it turns up
again, even in a line with no key at all, such as `Logging in as admin / s3cret`.
Add values it cannot know about with `reporting-labs.maskValues`.

## Not REST Assured? Record one call by hand

For a one-off, `Rl.api()` is a plain method — call it yourself:

```java
Response r = given().get("/v1/health");
Rl.api("GET", "/v1/health", r.getStatusCode(), r.getTime());
```

Full signature:

```java
Rl.api(String method, String url, int status);
Rl.api(String method, String url, int status, long durationMs);
Rl.api(String method, String url, int status, long durationMs,
       Map<String,String> requestHeaders,  String requestBody,
       Map<String,String> responseHeaders, String responseBody);
```

## Next

- Same request against many payloads from CSV / JSON → [Data-driven tests](/get-started/java/data-driven)
- Tag tests with priority, owner, feature → [Annotations](/get-started/java/annotations)
- Header chips, trend history, CI auto-detection → [Configuration](/get-started/java/configuration)

## Source and issues

The Java port lives in its own repository, separate from the Node.js reporter:

- Source and examples: [github.com/naveenautomationlabs/reporting-labs-java](https://github.com/naveenautomationlabs/reporting-labs-java)
- Bugs and requests: [reporting-labs-java/issues](https://github.com/naveenautomationlabs/reporting-labs-java/issues)
- Releases: [reporting-labs-java/releases](https://github.com/naveenautomationlabs/reporting-labs-java/releases) · Maven Central: [`dev.reportinglabs`](https://central.sonatype.com/namespace/dev.reportinglabs)
