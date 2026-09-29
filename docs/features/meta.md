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

Some tools put more than the id in the URL: a workspace, a project, an organisation. For those, give the link an
object instead of a string. It works for any tool and any URL shape:

```ts title="reporting-labs.config.ts"
links: {
  <yourKey>: {
    url: 'https://…/{anyField}/…/{id}',   // placeholders = the fields you send from the test
    display: '{id}',                        // what the report shows (default '{id}')
  },
},
```

```ts
meta({ <yourKey>: { id: '…', anyField: '…' } });   // same field names as the placeholders
```

Three rules:

- The key (`<yourKey>`) is yours: `octaneTestCase`, `testCase`, `workItem`, `tms`, anything.
- Every `{placeholder}` in `url` is filled from the object you pass to `meta()`. Names are up to you; only `{id}` is special because it is the default `display`.
- Fields that are not in `display` never show in the report. They only build the URL, and they can differ per test.

Two examples with different tools.

**ALM Octane / ValueEdge**: the URL carries the workspace `p` and the test case `id`; the report should show only the id.

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

Chip on the test: **octaneTestCase 58966**, linking to `https://oss.valueedge.com/ui/?p=4001/14014#/entity-navigation?entityType=test&id=58966`.

**Azure DevOps work items**: organisation and project are in the path; show the item as `AB#1234`.

```ts title="reporting-labs.config.ts"
links: {
  workItem: {
    url: 'https://dev.azure.com/{org}/{project}/_workitems/edit/{id}',
    display: 'AB#{id}',
  },
},
```

```ts
test('login with expired password', async ({ page }) => {
  meta({ priority: 'P0', workItem: { id: '1234', org: 'acme', project: 'shop-web' } });
  // ...
});
```

Chip on the test: **workItem AB#1234**, linking to `https://dev.azure.com/acme/shop-web/_workitems/edit/1234`.

Tools whose URL needs only the id (Jira, TestRail, Xray, Zephyr) do not need any of this: the plain string form
with `{id}` is enough.

## `log(msg)`

```ts
await log('opening checkout');
```

Timestamped log lines. Lines containing "error" or "fail" render red; "warn" amber.

Secrets in the text are masked automatically, the same way `console.log` output, step titles and assertion messages are: `password=x`, `Password: x`, `{ password: 'x' }`, `"password":"x"`, `X-Api-Key: x`, `access_token=x`, "password is x", "with password S3cret@1", `Bearer ...`, JWTs and well-known token formats (GitHub, AWS, Slack, Stripe, Google, GitLab, npm, SendGrid) all show as `****`. Keys you add with `maskKeys` are masked in text too.

## `testData(obj, name?)`

```ts
await testData({ user: 'demo@shop.io', card: '4242…' }, 'Cart');
```

- Object → key/value block.
- Array of objects → table.
- CSV string → table.

Sensitive keys (`password`, `token`, `secret`, `apiKey`, `authorization`, `cookie`, ...) are masked as `****`.
