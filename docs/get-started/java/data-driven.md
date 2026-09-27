---
title: Data-driven tests
sidebar_label: Data-driven tests
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Data-driven tests

Run one test method against many rows — from a 2D array, CSV, JSON or Excel —
and get **one report row per data row**, each showing exactly the parameters
it ran with. Works the same whether the body drives Selenium, REST Assured or
anything else.

## TestNG `@DataProvider`

Parameters are captured **automatically** as a **Parameters** block on each
row. No `Rl.testData()` needed. Sensitive values (`password`, `token`, `cvv`,
…) are masked.

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
public void register(String firstName, String lastName, String phone,
                     String password, String subscribe) {
    Rl.log("filling form for " + firstName);
    // 3 rows in the report, each with its own Parameters block
}
```

**Show parameter names** (`firstName`, `lastName`, …) instead of `arg0`,
`arg1`, … by compiling tests with `-parameters`:

```xml title="pom.xml"
<plugin>
  <artifactId>maven-compiler-plugin</artifactId>
  <configuration>
    <parameters>true</parameters>
  </configuration>
</plugin>
```

```gradle title="build.gradle"
compileTestJava { options.compilerArgs += '-parameters' }
```

## JUnit 5 `@ParameterizedTest`

Each invocation is its own row, titled with JUnit's display name (which
includes the arguments — `[1] gaurav, sharma, …`). To get the same
key/value **Parameters** block TestNG produces, add one line:

```java
@ParameterizedTest
@CsvFileSource(resources = "/users.csv", numLinesToSkip = 1)
void register(String firstName, String lastName, String phone,
              String password, String subscribe) {
    Rl.testData("Parameters", Map.of(
        "firstName", firstName, "lastName", lastName,
        "phone", phone, "password", password, "subscribe", subscribe));
    // ...
}
```

## Data sources

The provider is plain Java — read from wherever you like. Four common ones:

<Tabs groupId="data-source">
<TabItem value="array" label="2D array" default>

```java
@DataProvider
public Object[][] users() {
    return new Object[][] {
        { "gaurav", "sharma",     "9878987678", "gaurav@123", "yes" },
        { "anurag", "automation", "9878987687", "anurag@123", "no"  },
    };
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
```

```java
@DataProvider
public Object[][] users() throws Exception {
    try (CSVReader r = new CSVReader(new InputStreamReader(
            getClass().getClassLoader().getResourceAsStream("users.csv")))) {
        List<String[]> rows = r.readAll();
        rows.remove(0);                              // header
        return rows.toArray(new Object[0][]);
    }
}
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
    Object[][] out = new Object[rows.size()][];
    for (int i = 0; i < rows.size(); i++) {
        Map<String, Object> r = rows.get(i);
        out[i] = new Object[] { r.get("firstName"), r.get("lastName"),
                                r.get("phone"), r.get("password"), r.get("subscribe") };
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
        for (int i = 1; i <= sh.getLastRowNum(); i++) {          // skip header
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

## What the report shows

![Tests tab — one row per data row](/img/screenshots/02-tests-light.png)

- **One row per data row** — never collapsed, even when the method name is the same.
- **Parameters block** on each row (TestNG automatic; JUnit 5 via `Rl.testData`).
- **`password` masked** as `****`.
- Failures cluster by error message in the **Failures** tab, so ten rows failing
  the same way show as one cluster.

Verified end-to-end with a mixed 13-row TestNG suite (Array 3 + CSV 4 + JSON 3
+ Excel 3).
