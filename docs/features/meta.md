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
- To make story / epic keys clickable, set `links` in the config: `links: { story: 'https://acme.atlassian.net/browse/{id}' }`.

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
