---
title: REST Assured + Java
sidebar_label: REST Assured + Java
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# REST Assured + Java

REST Assured has a `Filter` hook that sees every request and response. Drop
in the 30-line filter below, register it once, and every call your tests make
shows up in the report's **API** tab — method, URL, status, timing, headers
and bodies — with secrets masked.

![API tab — every call, with status and timing](/img/screenshots/05-api-light.png)

Finish [Step 1 on the Java overview](/get-started/java) first (install the
TestNG or JUnit 5 artifact). Nothing extra to install for REST Assured.

## 1. The filter

Copy this into your test sources. It records the call and returns the
response untouched.

```java title="src/test/java/com/example/RlRestAssuredFilter.java"
import dev.reportinglabs.core.Rl;
import io.restassured.filter.Filter;
import io.restassured.filter.FilterContext;
import io.restassured.http.Header;
import io.restassured.response.Response;
import io.restassured.specification.FilterableRequestSpecification;
import io.restassured.specification.FilterableResponseSpecification;

import java.util.LinkedHashMap;
import java.util.Map;

public class RlRestAssuredFilter implements Filter {

    @Override
    public Response filter(FilterableRequestSpecification req,
                           FilterableResponseSpecification res,
                           FilterContext ctx) {
        long started = System.currentTimeMillis();
        Response response = ctx.next(req, res);          // the real call
        long duration = System.currentTimeMillis() - started;

        Object body = req.getBody();
        Rl.api(req.getMethod(), req.getURI(), response.getStatusCode(), duration,
               headers(req.getHeaders()), body == null ? null : body.toString(),
               headers(response.getHeaders()), response.asString());
        return response;
    }

    private static Map<String, String> headers(Iterable<Header> headers) {
        Map<String, String> out = new LinkedHashMap<>();
        if (headers != null) for (Header h : headers) out.put(h.getName(), h.getValue());
        return out;
    }
}
```

## 2. Register it once

<Tabs groupId="java-framework">
<TabItem value="testng" label="TestNG" default>

```java
import io.restassured.RestAssured;
import org.testng.annotations.BeforeSuite;

public class ApiBaseTest {

    @BeforeSuite(alwaysRun = true)
    public void wireReporting() {
        RestAssured.filters(new RlRestAssuredFilter());   // global — applies to every request
    }
}
```

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```java
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeAll;

public class ApiBaseTest {

    @BeforeAll
    static void wireReporting() {
        RestAssured.filters(new RlRestAssuredFilter());   // global — applies to every request
    }
}
```

</TabItem>
</Tabs>

Prefer per-request? `given().filter(new RlRestAssuredFilter())` works too.

## 3. Write tests as usual

```java
import dev.reportinglabs.core.Rl;
import dev.reportinglabs.core.annotations.*;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@Owner("naveen") @Feature("orders")
public class OrdersApiTest extends ApiBaseTest {

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

Nothing about the test changed. The filter recorded the call; the report shows
the row under the test **and** in the suite-wide API tab.

## What gets masked

Headers whose name contains `authorization`, `cookie`, `token`, `api-key`,
`secret`, `password` (and more) are replaced with `****` before they reach the
report. `Bearer super-secret` never lands in the HTML.

Add your own with a comma-separated list:

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.maskKeys=x-tenant-secret,internalCustomerId
```

Bodies are recorded as-is. If a body contains a secret, redact it before
calling `Rl.api()` or skip the body argument (`null`).

## No filter? Record one call by hand

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
