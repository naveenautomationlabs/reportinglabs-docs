---
title: Meta from comments
sidebar_label: Meta from comments
description: Don't want to call meta() in your tests? Write priority, owner, feature and story in a comment above the test instead. Works in Playwright, WebdriverIO, pytest, Robot Framework, JUnit 5 and TestNG.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Meta from comments

**Meta** is the extra information about a test: its **priority** (P0, P1…), its **owner**, the **feature** it tests and the **story** or ticket it belongs to. The report uses it to show the most important failures first, to group failures by owner and feature, and to link each test to its ticket.

## Two ways to add meta: you choose

| | Way 1: `meta()` in the test | Way 2: a comment above the test |
|---|---|---|
| What you write | one line of code inside the test | a normal comment above the test |
| Import needed | yes, `import { meta } from 'reporting-labs'` | no |
| What the report shows | the same | the same |

Both ways give **exactly the same report**. Use whichever you like:

```ts
// Way 1: meta() in the test
test('places an order', async ({ page }) => {
  meta({ priority: 'P0', owner: 'naveen', feature: 'checkout', story: 'SHOP-12' });
  ...
});

// Way 2: a comment above the test
/** @priority P0  @owner naveen  @feature checkout  @story SHOP-12 */
test('places an order', async ({ page }) => {
  ...
});
```

- **Already using `meta()`?** Nothing changes. Keep using it. Comments are only an extra option, never a replacement.
- **Don't want to touch the test code?** Use comments. No import, no function call.
- **Want both?** That's fine too. Some tests can use `meta()`, others a comment. If one test has both, `meta()` wins (more on that [below](#if-a-test-has-both)).

<small>Comments need npm `reporting-labs` 0.6.13+, PyPI `reporting-labs` 0.1.6+ or Maven `dev.reportinglabs` 0.1.27+. They are on by default.</small>

## How to write it

Put `@key value` in the comment right above the test. One example for each tool:

<Tabs groupId="meta-lang">
<TabItem value="playwright" label="Playwright" default>

```ts title="tests/checkout.spec.ts"
/** @owner team-pay  @feature payments */
test.describe('Payments', () => {

  /**
   * @priority P0  @story PAY-12
   * @smoke
   */
  test('pays with a saved card', async ({ page }) => { ... });

  // @priority P2  @owner asha
  test('shows the receipt', async ({ page }) => { ... });
});
```

- `/** */` and `//` comments both work.
- A comment above `test.describe` applies to **every test inside** it.
- A test's own comment wins over the describe's comment. Here *pays with a saved card* gets owner **team-pay**, and *shows the receipt* gets owner **asha**.

</TabItem>
<TabItem value="wdio" label="WebdriverIO">

```js title="test/specs/login.e2e.js"
/** @feature login  @team identity */
describe('Sign in', () => {

  /** @priority P1  @owner asha  @story LOGIN-7 */
  it('signs in a valid user', async () => { ... });
});
```

- Works the same as Playwright: above `it()` for one test, above `describe()` for all tests inside.
- The test title must be plain text in the code, like `it('signs in a valid user', …)`. If the title is built while the test runs (for example `` it(`logs in as ${user}`, …) ``), the comment can't be found. Use `meta()` for that test instead.

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

- Write it in the test's **docstring**, or in `#` comments **right above** the `def` (decorators in between are fine).
- The docstring at the **top of the file** applies to every test in the file.
- A **class** docstring applies to every test in the class.

</TabItem>
<TabItem value="robot" label="Robot Framework">

```robot title="tests/cart.robot"
*** Test Cases ***
Cart Total Is Correct
    [Documentation]    Checks the cart total.    @owner naveen    @priority P0    @story SHOP-12
    [Tags]    smoke
    ...
```

- Write it in the test's `[Documentation]`.
- Tags like `owner:asha` or `P1` keep working as before.

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

- Write it in the **Javadoc** of the test method.
- The Javadoc on the **class** applies to every test in the class (also `@Nested` classes).
- Annotations like `@Test` or `@CsvSource(...)` between the Javadoc and the method are fine.

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

- Same as JUnit 5: the method's Javadoc for one test, the class Javadoc for all tests in the class.

</TabItem>
</Tabs>

## The rules, in short

| You write | The report gets |
|---|---|
| `@owner naveen` | owner = **naveen** |
| `@priority P0  @owner naveen  @story SHOP-12` | all three. Many on one line is fine. |
| `@feature Cart and checkout` | feature = **Cart and checkout**. Spaces are fine; the value ends at the next `@` or at the end of the line. |
| `@owner 'naveen'` or `@owner: naveen` or `@owner=naveen` | owner = **naveen**. Quotes, `:` and `=` are all fine. |
| a line with only `@smoke @regression` | two **tags**: smoke and regression |
| a line with `@P0` (up to `@P4`) | priority **P0** |
| a line with `@blocker`, `@critical`, `@major`, `@minor` or `@trivial` | that **severity** |

**Keys you can use:** `priority`, `severity`, `owner`, `feature`, `epic`, `story`, `issue`, `component`, `team`, `sprint`. Python and Java also take `jira` and `ticket`. Want your own key, like `@module payments`? Add it to [`dimensions`](../reference/options.md) or [`links`](./meta.md#make-ids-clickable) first. If `story` has a link set up, `@story SHOP-12` becomes a clickable link, the same as with `meta()`.

## If a test has both

If the same test has `meta()` (or an annotation or marker) **and** a comment, the code wins. The full order, strongest first:

1. `meta()` / `Rl.meta()` in the test
2. Markers and annotations: `@pytest.mark.meta`, `@Owner`, `@Priority`, `@Meta`
3. The test's own comment, docstring or Javadoc
4. The comment on the describe, class or file around it
5. Tags in the test title, like `@owner:asha` or `@P1`

This is checked **key by key**. Say the code has `meta({ owner: 'priya' })` and the comment has `@owner ravi @priority P1`. The test gets owner **priya** (the code wins) and priority **P1** (only the comment has it).

## Your old comments are safe

Your project already has lots of comments. These never end up in the report by mistake:

- **Comments that don't touch the test.** If there is an empty line between the comment and the test, it's not that test's comment. So a header at the top of the file is ignored.
- **Comments at the end of a code line,** like `const x = 1; /* @owner a */`.
- **Names in a sentence.** "Bug reported by @naveen" adds nothing. A tag counts only when the line *starts* with `@`.
- **Keys the report doesn't know,** like `// TODO @naveen fix this`.
- **Normal JSDoc and Javadoc tags,** like `@param`, `@returns`, `@throws`, `@see`, `@author`, `@deprecated`, `@ts-expect-error`.
- **A key with no value,** like a bare `@priority`.

## Install the editor snippets

You don't have to type the comment by hand every time. Set up a **snippet** once (takes a minute). After that, type **`rlmeta`** and press **Tab**, and the editor writes the comment for you:

```ts
/**
 * @priority P0  @owner name  @feature area
 * @story SHOP-123
 */
```

Pick the priority from a list (P0 to P4), type the owner, press **Tab** to jump to the next field, and so on.

Pick your editor:

<Tabs groupId="snippet-editor">
<TabItem value="vscode-node" label="VS Code (Node.js)" default>

1. Install the reporter in the project if you haven't yet: `npm i -D reporting-labs`. The snippets ship inside the package.
2. In a terminal at the **root of the project** (the folder you open in VS Code), run:

   ```bash
   npx reporting-labs snippets
   ```

   It prints `Created .vscode/reporting-labs.code-snippets`. A new project gets the file from `npx reporting-labs init` already (skip it there with `--no-snippets`).
3. Open any `.spec.ts` / `.js` file, type `rlmeta` (or `/**rl`) and pick **reportingLabs: meta comment** from the suggestion list, or just press **Tab**.
4. Commit `.vscode/reporting-labs.code-snippets`. Everyone who opens the project in VS Code gets the snippets, with no install of their own.

| Type | You get |
|---|---|
| `rlmeta` | the meta comment, above a `test()`, `it()` or `describe()` |
| `rltest` | the comment and an empty `test('…', async ({ page }) => {})` |
| `rlit` | the comment and an empty `it('…', async () => {})` for WebdriverIO / Mocha |
| `rldescribe` | a `describe` with the comment, so every test inside gets the meta |

</TabItem>
<TabItem value="vscode-python" label="VS Code (Python)">

1. Install the reporter if you haven't yet: `pip install reporting-labs`.
2. In a terminal at the **root of the project** (with the same virtualenv active), run:

   ```bash
   python -m reporting_labs snippets
   ```

   It prints `Created .vscode/reporting-labs.code-snippets`.
3. Inside a test, on the first line of the body, type `rlmeta` and press **Tab** for the docstring. Type `rltest` at the start of a line for a whole `def test_…(page):` with the docstring.
4. Commit `.vscode/reporting-labs.code-snippets` and the whole team has them.

</TabItem>
<TabItem value="intellij" label="IntelliJ / PyCharm">

IntelliJ IDEA, WebStorm and PyCharm use **Live Templates**. You add one once, and it works in every project:

1. Open **Settings** (macOS: **IntelliJ IDEA → Settings**) → **Editor → Live Templates**.
2. Click **+** → **Live Template**. (Click **+** → **Template Group** first if you want them in their own group, say `reportingLabs`.)
3. Fill in:
   - **Abbreviation:** `rlmeta`
   - **Description:** `reportingLabs meta`
   - **Template text:** for Java, JavaScript or TypeScript:

     ```text
     /**
      * @priority $PRIORITY$  @owner $OWNER$  @feature $FEATURE$
      * @story $STORY$
      */
     ```

     for Python (inside the test, as its docstring):

     ```text
     """$END$

     @priority $PRIORITY$  @owner $OWNER$  @feature $FEATURE$
     @story $STORY$
     """
     ```
4. **Don't skip this step.** Under the text it says *No applicable contexts*: click **Define** and tick **Java**, **JavaScript and TypeScript** or **Python**. Without a context the template never fires.
5. Optional: click **Edit Variables** and set the `PRIORITY` expression to `enum("P0","P1","P2","P3","P4")` for a dropdown.
6. Click **OK**. Above a test, type `rlmeta` and press **Tab**.

To give the team the same template: **File → Manage IDE Settings → Export Settings**, tick *Live templates*, and share the file.

</TabItem>
<TabItem value="vscode-java" label="VS Code (Java)">

The Java reporter has no command for this, so add the file by hand. Create `.vscode/reporting-labs.code-snippets` at the project root with:

```json title=".vscode/reporting-labs.code-snippets"
{
  "reportingLabs: meta Javadoc": {
    "scope": "java",
    "prefix": "rlmeta",
    "description": "reportingLabs meta in a test's Javadoc",
    "body": [
      "/**",
      " * ${1:What this test checks}.",
      " * @priority ${2|P0,P1,P2,P3,P4|}  @owner ${3:name}  @feature ${4:area}",
      " * @story ${5:SHOP-123}",
      " */"
    ]
  }
}
```

Above an `@Test`, type `rlmeta` and press **Tab**. Commit the file for the team.

</TabItem>
<TabItem value="eclipse" label="Eclipse">

1. **Window → Preferences → Java → Editor → Templates → New…**
2. **Name:** `rlmeta`, **Context:** `Java type members`, **Description:** `reportingLabs meta`.
3. **Pattern:**

   ```text
   /**
    * @priority ${priority}  @owner ${owner}  @feature ${feature}
    * @story ${story}
    */
   ```
4. **OK**. Above an `@Test`, type `rlmeta`, press **Ctrl+Space** and pick the template. **Tab** moves between the fields.

To share it, select the template and click **Export…**. Teammates use **Import…** on the same page.

</TabItem>
</Tabs>

**Snippet not showing up?**

- **VS Code:** open the project folder itself in VS Code, the one that has the `.vscode` folder. If you open a folder above it, VS Code doesn't see the snippets. Press **Ctrl+Space** (macOS: **⌃Space**) to open the suggestion list yourself. If the file was added while VS Code was open, run **Developer: Reload Window**.
- **The file was already there:** the command never replaces an existing file. Use `npx reporting-labs snippets --force` or `python -m reporting_labs snippets --force` to replace it with the latest version.
- **IntelliJ / PyCharm:** you didn't tick a context in step 4, or you typed `rlmeta` in the middle of a word.

## Turn it off

Don't want comments read at all? Turn it off. `meta()` keeps working.

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

## My comment doesn't show in the report

Check these one by one:

1. **Version.** You need npm `reporting-labs` 0.6.13+, PyPI 0.1.6+ or Maven 0.1.27+. Check with `npm ls reporting-labs` or `pip show reporting-labs`.
2. **No empty line.** The comment must sit right above the `test(` / `it(` / `def` / `@Test` line. Annotations and decorators in between are fine; an empty line is not.
3. **Known key.** `@priority`, `@owner`, `@feature` and the other keys above work. Your own keys must be added to `dimensions` or `links` first.
4. **Tags on their own line.** `@smoke` in the middle of a sentence is not a tag.
5. **`meta()` wins.** If the test also calls `meta()` with the same key, you see the `meta()` value.
6. **WebdriverIO:** the test title must be plain text in the code (see the WebdriverIO tab above).

## Related

- [Meta, log, testData](./meta.md): Way 1, the `meta()` helper, and clickable ticket links
- [Annotations & `Rl.*` helpers](../get-started/java/annotations.md) for Java
- [All options](../reference/options.md)
