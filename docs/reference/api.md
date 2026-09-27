---
title: JavaScript API
sidebar_position: 2
---

# JavaScript API

```ts
import { meta, log, testData, api, explainError } from 'reporting-labs';
```

## `meta(values)`

Attach report metadata to the current test. Call it first thing inside the test body.

```ts
meta({ priority: 'P0', owner: 'naveen', story: 'SHOP-231' });
meta({ story: ['SHOP-1', 'SHOP-2'] });        // multiple ids → chips + links each
meta({ octaneTestCase: { id: '58966', p: '4001/14014' } });  // fields for a multi-parameter link, see links in options
meta({ team: 'web', component: 'checkout' }); // free-form keys are fine
```

## `log(msg, ...rest)`

Timestamped log line. Lines containing "error" or "fail" render red.

```ts
await log('cart total before coupons: $99.00');
```

## `testData(data, name?)`

Attach the data used by this test.

```ts
await testData({ username: 'naveen', password: 'S3cret' }, 'Login');
await testData([{ id: 1, sku: 'A' }, { id: 2, sku: 'B' }], 'Order lines');
await testData('id,name\n1,alice\n2,bob', 'Users CSV');
```

## `api(call)`

Record an API request/response manually. Prefer `import 'reporting-labs/auto'` for zero-code automatic capture.

```ts
await api({ method: 'POST', url: '/v1/orders', status: 201, requestBody, responseBody });
```

## `explainError(raw)`

Advanced: classify a raw error string into a `{kind, summary, ...}` object using the same rules the reporter uses. Rarely needed in user code.
