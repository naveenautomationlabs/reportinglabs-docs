---
title: Meta, log, testData
sidebar_position: 2
---

# Meta, log, testData

Three tiny helpers add the details the report ranks and groups by.

## `meta({...})`

```ts
meta({ priority: 'P0', severity: 'blocker', owner: 'naveen', feature: 'checkout', story: 'SHOP-231' });
```

- Known keys: `priority`, `severity`, `owner`, `feature`, `epic`, `story`, `issue`, `component`, `team`.
- Any other key is allowed and shows as a chip on the test.
- Multiple ids for one key? Pass an array or a comma-separated string: `story: ['SHOP-1', 'SHOP-2']`. Each id gets its own chip and link.
- To make story / epic keys clickable, set `links` in the config: `links: { story: 'https://acme.atlassian.net/browse/{id}' }`. Several ids (`story: ['SHOP-1', 'SHOP-2']`) become one link each.
- A link that needs more than the shown value takes an object. Placeholders name the fields of the object you pass to `meta()`; `display` is what the report shows, the other fields only build the URL:

  ```ts
  // playwright.config.ts
  links: {
    octaneTestCase: {
      url: 'https://oss.valueedge.com/ui/?p={p}#/entity-navigation?entityType=test&id={id}',
      display: '{id}',
    },
  }
  // in the test
  meta({ octaneTestCase: { id: '58966', p: '4001/14014' } });
  ```

  The report shows **octaneTestCase 58966**; clicking it opens the full URL. `p` is never shown and can differ per test.

## `log(msg)`

```ts
await log('opening checkout');
```

Timestamped log lines. Lines containing "error" or "fail" render red; "warn" amber. Sensitive-looking strings (Bearer tokens, JWTs, `password=`) are masked automatically.

## `testData(obj, name?)`

```ts
await testData({ user: 'demo@shop.io', card: '4242…' }, 'Cart');
```

- Object → key/value block.
- Array of objects → table.
- CSV string → table.

Sensitive keys (`password`, `token`, `secret`, `apiKey`, `authorization`, `cookie`, ...) are masked as `****`.
