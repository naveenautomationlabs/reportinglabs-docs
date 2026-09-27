---
title: Meta, log, testData
sidebar_position: 2
---

# Meta, log, testData

Three tiny helpers add the details the report ranks and groups by.

## `meta({...})`

One line at the top of the test says who owns it, how important it is and which story it covers:

```ts title="tests/checkout.spec.ts"
import { test, expect } from '@playwright/test';
import { meta } from 'reporting-labs';

test('completes purchase', async ({ page }) => {
  meta({ priority: 'P0', severity: 'blocker', owner: 'naveen', feature: 'checkout', story: 'SHOP-231' });

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByText('Order confirmed')).toBeVisible();
});
```

With this the report ranks failures by priority, groups them by owner and feature, and shows every value as a chip on the test.

- Known keys: `priority`, `severity`, `owner`, `feature`, `epic`, `story`, `issue`, `component`, `team`.
- Any other key is allowed and shows as a chip on the test.
- Multiple ids for one key? Pass an array or a comma-separated string: `story: ['SHOP-1', 'SHOP-2']`. Each id gets its own chip and link.

### Make ids clickable

Set `links` in the config once. `{id}` is replaced by the value from `meta()`:

```ts title="reporting-labs.config.ts"
links: {
  story: 'https://acme.atlassian.net/browse/{id}',
  epic: 'https://acme.atlassian.net/browse/{id}',
},
```

Now `story: 'SHOP-231'` in the test becomes a link to `https://acme.atlassian.net/browse/SHOP-231`.

### Links that need more than one value

Some tools put more than the id in the URL. An ALM Octane / ValueEdge test case looks like
`https://oss.valueedge.com/ui/?p=4001/14014#/entity-navigation?entityType=test&id=58966`, where `p` is the
workspace and `id` the test case. You want the report to show only **58966**, clickable.

Give the link an object. Placeholders name the fields you pass from the test; `display` is what the report shows,
the other fields only build the URL:

```ts title="reporting-labs.config.ts"
links: {
  octaneTestCase: {
    url: 'https://oss.valueedge.com/ui/?p={p}#/entity-navigation?entityType=test&id={id}',
    display: '{id}',
  },
},
```

```ts title="tests/notifications.spec.ts"
import { test, expect } from '@playwright/test';
import { meta } from 'reporting-labs';

test('TC003 - manual trigger with all notifications disabled', async ({ page }) => {
  meta({
    priority: 'P1',
    owner: 'chetan',
    octaneTestCase: { id: '58966', p: '4001/14014' },   // p is only used in the URL
  });

  await page.goto('/notifications');
  await page.getByRole('button', { name: 'Trigger' }).click();
  await expect(page.getByText('Sent')).toBeVisible();
});
```

The test shows a chip **octaneTestCase 58966**. Clicking it opens the full URL with both values filled in.
`p` never appears in the report and can differ from test to test. `display` can combine fields too, for example
`display: '{project}-{id}'`.

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
