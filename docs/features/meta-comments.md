---
title: Meta from comments
sidebar_label: Meta from comments
description: Tag tests with priority, owner, feature and story in a comment, docstring or Javadoc, with no code change. Works in Playwright, WebdriverIO, pytest, Robot Framework, JUnit 5 and TestNG.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Meta from comments

The report ranks failures by **priority**, groups them by **owner** and **feature**, and links **stories**. That information usually comes from `meta()`, a marker or an annotation in the test. If your team prefers not to add calls to the tests, write the same values in the **comment right above the test** instead:

```ts
/**
 * Places an order with a saved card.
 * @priority P0  @owner naveen  @feature checkout  @story SHOP-12
 * @smoke
 */
test('places an order', async ({ page }) => { ... });
```

This is an **extra** way, not a replacement. `meta()`, markers and annotations work exactly as before, and when a test has both, the code wins.

<small>Available from npm `reporting-labs` 0.6.13, PyPI `reporting-labs` 0.1.6 and Maven `dev.reportinglabs` 0.1.27. On by default.</small>

## In every framework

<Tabs groupId="meta-lang">
<TabItem value="playwright" label="Playwright" default>

```ts title="tests/checkout.spec.ts"
/** @owner team-pay  @feature payments */
test.describe('Payments', () => {           // applies to every test inside

  /**
   * @priority P0  @story PAY-12
   * @smoke
   */
  test('pays with a saved card', async ({ page }) => { ... });

  // @priority P2  @owner asha
  test('shows the receipt', async ({ page }) => { ... });
});
```

A JSDoc block `/** */` or `//` line comments both work. The comment above `test.describe` applies to every test inside, and the test's own comment wins over it.

</TabItem>
<TabItem value="wdio" label="WebdriverIO">

```js title="test/specs/login.e2e.js"
/** @feature login  @team identity */
describe('Sign in', () => {

  /** @priority P1  @owner asha  @story LOGIN-7 */
  it('signs in a valid user', async () => { ... });
});
```

The reporter finds each `it()` in the spec by its title, inside its own `describe`, so two describes that each have an `it('logs in')` keep their own meta. A title built at run time (a template string with `${...}`) cannot be found in the source, so give that test its meta with tags in the title instead.

</TabItem>
<TabItem value="pytest" label="pytest">

```python title="tests/test_checkout.py"
"""Checkout tests.

@team checkout-squad
"""

class TestPayments:
    """@feature payments  @owner team-pay"""

    def test_pays_with_saved_card(self, page):
        """Pays with a saved card.

        @priority P0  @story PAY-12
        @smoke
        """
        ...

    # @priority P2  @owner asha
    @pytest.mark.parametrize("currency", ["INR", "USD"])
    def test_shows_receipt(self, page, currency):
        ...
```

Use the test's docstring, or `#` comments right above the `def` (and its decorators). A module docstring applies to every test in the file, a class docstring to every test in the class.

</TabItem>
<TabItem value="robot" label="Robot Framework">

```robot title="tests/cart.robot"
*** Test Cases ***
Cart Total Is Correct
    [Documentation]    Checks the cart total.    @owner naveen    @priority P0    @story SHOP-12
    [Tags]    smoke
    ...
```

Robot reads the meta from the test's `[Documentation]`. Tags like `owner:asha` or `P1` keep working as before.

</TabItem>
<TabItem value="junit5" label="JUnit 5">

```java title="src/test/java/com/example/CheckoutTest.java"
/**
 * Checkout suite.
 * @team checkout-squad
 */
class CheckoutTest {

    /**
     * Pays with a saved card.
     * @priority P0  @owner naveen  @feature payments  @story PAY-12
     * @smoke
     */
    @Test
    void paysWithSavedCard() { ... }

    /** @owner asha  @feature cart */
    @ParameterizedTest
    @CsvSource({ "1, 99", "5, 495" })
    void cartTotal(int qty, int total) { ... }
}
```

The class Javadoc applies to every test in the class (and to `@Nested` classes inside). Annotations between the Javadoc and the method are skipped, including multi-line ones like `@CsvSource({ ... })`.

</TabItem>
<TabItem value="testng" label="TestNG">

```java title="src/test/java/com/example/LoginTest.java"
/** @team identity */
public class LoginTest {

    /**
     * @priority P1  @owner asha  @feature login
     * @critical
     */
    @Test
    public void rejectsWrongPassword() { ... }

    /** @feature data-driven */
    @Test(dataProvider = "users")
    public void logsIn(String user) { ... }
}
```

</TabItem>
</Tabs>

## The rules

| You write | You get |
|---|---|
| `@key value` | meta: `@owner naveen` → owner **naveen** |
| several on a line | `@priority P0  @owner naveen  @story SHOP-12` |
| a value with spaces | `@feature Cart and checkout` (the value runs to the next `@key` or the end of the line) |
| quotes | `@owner 'naveen'` and `@feature "Cart and checkout"` drop the quotes |
| `@key: value` / `@key=value` | same as `@key value` |
| a line of bare `@words` | tags: `@smoke @regression` |
| `@P0`…`@P4` on a tag line | priority |
| `@blocker` `@critical` `@major` `@minor` `@trivial` on a tag line | severity |

**Keys that count:** `priority`, `severity`, `owner`, `feature`, `epic`, `story`, `issue`, `component`, `team`, `sprint` (Python and Java also `jira`, `ticket`), plus any key you list in [`dimensions`](../reference/options.md) or [`links`](./meta.md#make-ids-clickable). A link template turns the value into a link, exactly as with `meta()`.

### Which value wins

From strongest to weakest:

1. **Code in the test:** `meta()` / `Rl.meta()`
2. **Markers and annotations:** `@pytest.mark.meta`, `@Owner`, `@Priority`, `@Meta`
3. **The test's own comment**, docstring or Javadoc
4. **The comment on the describe, class or module** around it
5. **Tags in the title** (`@owner:asha`, `@P1`)

Each key is decided on its own: if `meta({ owner: 'priya' })` sets the owner and the comment says `@owner ravi @priority P1`, the test gets owner **priya** and priority **P1**.

### What is ignored

So that comments you already have never change your report by accident:

- **A comment that does not touch the test.** A file header separated from the first test by a blank line is not that test's comment.
- **A comment at the end of a code line:** in `const x = 1; /* @owner a */` the comment belongs to the code.
- **Mentions inside a sentence:** "Regression reported by @naveen" adds nothing. Only a line that *starts* with `@` gives tags.
- **Unknown keys:** `// TODO @naveen fix this` is not a chip.
- **The comment language's own tags:** `@param`, `@returns`, `@throws`, `@see`, `@link`, `@author`, `@deprecated`, `@ts-expect-error`, `@eslint…` and the like.
- **A key without a value:** a bare `@priority` is neither meta nor a tag.

## Type it once: editor snippets

Writing the comment by hand every time is not the idea. One command adds VS Code snippets to the project:

<Tabs groupId="meta-lang">
<TabItem value="playwright" label="Node.js / WebdriverIO" default>

```bash
npx reporting-labs snippets       # npx reporting-labs init adds them too
```

| Type | then Tab | You get |
|---|---|---|
| `rlmeta` | the comment | `/** @priority P0 @owner name @feature area @story SHOP-123 */` |
| `rltest` | comment + test | the comment and an empty `test('…', async ({ page }) => {})` |
| `rlit` | comment + `it()` | the same for WebdriverIO / Mocha |
| `rldescribe` | describe + comment | meta for every test inside |

</TabItem>
<TabItem value="pytest" label="Python">

```bash
python -m reporting_labs snippets
```

| Type | then Tab | You get |
|---|---|---|
| `rlmeta` | the docstring meta | `"""What this test checks. @priority P0 @owner name …"""` |
| `rltest` | a whole test | `def test_…(page):` with the docstring meta |

</TabItem>
</Tabs>

Priority is a dropdown (P0 to P4), and Tab moves from field to field. The snippets live in `.vscode/reporting-labs.code-snippets`: commit it and the whole team has them. An existing file is never overwritten without `--force`.

In **IntelliJ, WebStorm or PyCharm**, add a Live Template once (Settings → Editor → Live Templates → +) with the abbreviation `rlmeta` and the text:

```text
/** @priority $PRIORITY$  @owner $OWNER$  @feature $FEATURE$  @story $STORY$ */
```

## Turn it off

<Tabs groupId="meta-lang">
<TabItem value="playwright" label="Playwright / WebdriverIO" default>

```ts
reporter: [['reporting-labs', { commentMeta: false }]]
```

</TabItem>
<TabItem value="pytest" label="Python">

```toml title="pyproject.toml"
[tool.reporting-labs]
commentMeta = false
```

</TabItem>
<TabItem value="junit5" label="Java">

```properties title="src/test/resources/reporting-labs.properties"
reporting-labs.commentMeta=false
```

</TabItem>
</Tabs>

## My comment is not picked up

1. **Version.** Check you have npm `reporting-labs` 0.6.13+, PyPI 0.1.6+ or Maven 0.1.27+ (`npm ls reporting-labs`, `pip show reporting-labs`).
2. **It must touch the test.** No blank line between the comment and the `test(` / `def` / `@Test` line. Annotations and decorators in between are fine.
3. **The key must be known.** Custom keys need to be in `dimensions` or `links`.
4. **Tags need their own line.** `@smoke` inside a sentence is a mention, not a tag.
5. **The code wins.** A `meta()` call or annotation with the same key overrides the comment.
6. **WebdriverIO:** the test title must be a plain string in the source, so the reporter can find it.

## Related

- [Meta, log, testData](./meta.md): the `meta()` helper and clickable links
- [Annotations & `Rl.*` helpers](../get-started/java/annotations.md) for Java
- [All options](../reference/options.md)
