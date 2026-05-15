# Playwright POM Automation Rules (v3.0 - MCP Enhanced)

You are an expert Playwright Automation test generator. Follow these rules for every manual step provided.

---

# 1. Syntax & Data Parsing

## Variables

* `{{key}}` maps to `data/testData.json`.
* Reuse existing test data whenever possible.
* If test data does not exist:

  * Add it into `testData.json`.
  * Use meaningful and reusable naming conventions.

## UI Elements

* `"Name"` refers to button/input/link labels.
* Resolve UI elements using Playwright MCP inspection before generating locators.

## Environment

* Read URLs, credentials, secrets, tokens, and environment-specific values from `.env`.
* Update `.env` when new required values are identified.
* Never hardcode credentials or URLs inside test/spec/page object files.

## Registration Email Uniqueness (Mandatory)

For **every** registration test case that fills the Email Address field:

* Generate the email using `buildRegistrationEmail()` from `utils/registrationEmail.ts`.
* Format: `reacharavindh.s14+{timestamp}@gmail.com` (local part and domain come from `.env`: `REGISTRATION_EMAIL_LOCAL_PART`, `REGISTRATION_EMAIL_DOMAIN`).
* `{timestamp}` MUST be the current timestamp at test execution time (`Date.now()` or equivalent) so each run uses a unique mailbox alias.
* For **successful registration** flows, always pass the generated email into the form before submit.
* For negative/validation cases that still require a syntactically valid email, use the same timestamped format unless the case explicitly requires a fixed duplicate (e.g. already-registered email from `.env`).
* Never reuse a static registration email across tests in the same suite run.

## Change Password State Tracking (Mandatory)

For the **Change Password** module:

* Track the live account password in `.runtime/password-state.json` via `utils/passwordState.ts`.
* **Initialize** state at suite start with `initializePasswordState()` using `VALID_PASSWORD` from `.env`.
* **Immediately** call `setCurrentPassword(newPassword, testId)` after every **successful** password change, before subsequent steps. This persists the latest password even if a later test fails.
* Tests that need the current password MUST use `getCurrentPassword()` — never assume `.env` alone after TC_002.
* The suite MUST end with **`TC_REVERT`** to restore `VALID_PASSWORD` when the current password differs from the initial value.
* Document the state file path in `README.md`; never commit `.runtime/`.

---

# 2. Page Object Model (POM) Upsert Logic

## Discovery

Before creating a new Page Object:

1. Search `/page-objects` for an existing matching module/class.
2. Reuse existing Page Objects whenever possible.
3. Avoid duplicate Page Objects for the same feature.

## Create

If no matching class exists:

* Create `ClassName.page.ts`.
* Use standard Playwright TypeScript POM structure.
* Group:

  * locators
  * actions
  * assertions
  * helper utilities

## Update

If the Page Object already exists:

* Check whether the locator already exists.
* Check whether the action method already exists.
* Append only missing locators/methods.
* Never remove or overwrite existing methods unless they are broken/conflicting.
* Preserve backward compatibility with existing tests.

## Locator Storage

* ALL locators MUST exist only inside the corresponding Page Object.
* Never place raw selectors directly inside spec files.

---

# 3. Test File Management

## Persistence

* Search `/tests` for an existing `.spec.ts` file related to the feature.
* Extend existing spec files whenever appropriate.

## Merge Logic

If a matching spec file exists:

* Add a new `test('description', async (...) => {})` block.
* Preserve existing structure and hooks.

## Test Structure

Every test MUST:

* Use `test.step()` for every manual test step.
* Maintain readable business-level descriptions.
* Keep assertions close to related actions.
* Follow Arrange → Act → Assert structure.

## Naming Convention

* Use meaningful test names.
* Reflect actual business workflow.
* Avoid generic names like:

  * `test1`
  * `sample test`
  * `verify functionality`

---

# 4. Playwright MCP Server Usage (Mandatory)

## Core Rule

ALWAYS utilise the Playwright MCP Server before generating or updating automation code.

## Mandatory MCP Workflow

Before creating locators or methods:

1. Launch browser session using MCP.
2. Navigate to the target application/page.
3. Study the DOM structure.
4. Validate locator uniqueness.
5. Confirm actionability of elements.
6. Re-validate after navigation/state changes.

## Mandatory MCP Commands

Use the following MCP capabilities whenever applicable:

### Navigation

* `browser_navigate`
* `browser_go_back`
* `browser_go_forward`

### DOM Analysis

* `accessibility_tree`
* `snapshot_dom`
* `console_log`
* `get_visible_text`
* `inspect_element`

### Validation

* Validate:

  * visibility
  * enabled state
  * uniqueness
  * interactability
  * stability after rerenders

## Self-Healing Flow

If a locator fails:

1. Re-inspect DOM using MCP.
2. Compare against existing locator.
3. Generate a more stable locator.
4. Update the Page Object immediately.
5. Retry execution.
6. Repeat until stable.

## Dynamic Applications

For modern frameworks (React/Angular/Vue):

* Re-check locators after state updates.
* Avoid unstable generated classes.
* Avoid transient IDs.
* Prefer resilient hierarchy-based selectors.

## Shadow DOM / iframe Handling

When Shadow DOM or iframes are detected:

* Use MCP to inspect frame hierarchy.
* Explicitly switch frame context.
* Validate selectors within the correct scope.

---

# 5. Fixture Management (CRITICAL)

## Mandatory Rule

DO NOT instantiate Page Objects directly inside tests.

### Forbidden

```ts
const loginPage = new LoginPage(page)
```

## Required Pattern

Always use custom fixtures from:

```ts
/fixtures/page-fixture.ts
```

## When Creating New Page Objects

You MUST:

1. Import the Page Object into `page-fixture.ts`.
2. Extend `MyFixtures` type.
3. Add fixture initialization.
4. Add fixture getter inside `test.extend()`.

## Usage Pattern

```ts
test('description', async ({ loginPage, dashboardPage }) => {

})
```

## Reusability

* Fixtures should support cross-spec reuse.
* Avoid duplicate fixture initialization.

---

# 6. Execution Parallelism (Mandatory)

Run the suite as a SINGLE sequential execution flow.

## Required Playwright Config

```ts
workers: 1,
fullyParallel: false
```

## Reason

This prevents:

* shared-state conflicts
* race conditions
* environment contamination
* unstable execution order

Sequential execution improves:

* debugging
* trace analysis
* reproducibility
* CI stability

---

# 7. Validation & Execution (Mandatory)

## Execution Rule

After generating or updating tests:

1. Execute the test.
2. Review failures.
3. Fix locators/actions/assertions.
4. Re-run the test.
5. Repeat until the test passes.

## Mandatory Validation Areas

Validate:

* locator correctness
* waits
* assertions
* navigation
* API dependencies
* timing issues
* flaky interactions

## Stability Requirement

Tests must:

* pass consistently
* avoid arbitrary waits
* avoid force clicks unless necessary
* avoid flaky retry-based design

---

# 8. Locator Identification Strategy (Mandatory)

## Preferred Locator Order

ALWAYS prioritize locators in this exact order:

1. Relative XPath
2. Text-based locators
3. ID
4. Name
5. Class name
6. Other stable attributes (`data-*`, `aria-*`, etc.)

## Locator Rules

* NEVER use absolute XPath unless unavoidable.
* Prefer human-readable locators.
* Prefer stable business identifiers.
* Avoid auto-generated CSS classes.
* Avoid brittle nth-child selectors.

## Multi-Match Resolution

If multiple elements match:

* Refine using:

  * parent-child hierarchy
  * visible text
  * neighboring elements
  * indexed filtering
  * additional attributes

Final locator MUST uniquely resolve to exactly ONE element.

## Mandatory MCP Validation

Before finalizing ANY locator:

* Validate uniqueness using MCP.
* Confirm visibility.
* Confirm interactability.
* Confirm stability after rerender.

DO NOT proceed with action/method creation until locator validation succeeds.

---

# 9. Waiting Strategy (Mandatory)

## Preferred Waiting Order

1. Explicit Playwright waits
2. Locator state waits
3. Network/UI stabilization
4. Assertion-based waits

## Avoid

* `waitForTimeout()` unless absolutely unavoidable.
* hardcoded sleeps.
* arbitrary delays.

## Preferred Examples

```ts
await expect(locator).toBeVisible()
await locator.waitFor()
await page.waitForLoadState('networkidle')
```

---

# 10. Assertion Strategy

## Assertions MUST

* Validate business outcomes.
* Validate UI state.
* Validate navigation.
* Validate success/failure messaging.
* Validate persisted changes.

## Preferred Assertions

```ts
await expect(locator).toHaveText()
await expect(locator).toBeVisible()
await expect(page).toHaveURL()
```

## Avoid Weak Assertions

Avoid:

* console-only validation
* non-deterministic assertions
* overly broad text assertions

---

# 11. Code Quality Standards

## Generated Code MUST

* Follow TypeScript best practices.
* Be modular.
* Be reusable.
* Be readable.
* Follow existing project patterns.

## Keep Logic Separation

* Spec file → test flow
* Page Object → UI interaction
* Fixture → dependency injection
* Test data → externalized

## Avoid

* duplicate logic
* magic strings
* inline selectors
* unnecessary comments

---

# 12. Reporting & Debugging

## On Failure

Capture:

* screenshot
* trace
* video (if configured)
* console logs

## MCP Assistance

Use MCP console inspection to:

* identify runtime JS errors
* inspect failing elements
* validate rendering issues
* analyze hidden overlays/loaders

---

# 13. Final Output Requirements

Before finalizing generated automation:

## Ensure

* all imports are correct
* no unused code exists
* fixtures are updated
* locators are validated
* tests are executable
* tests pass successfully
* TypeScript compilation succeeds
* **README.md is updated when structure, scripts, env vars, or coverage changed** (Section 14)

## Final Deliverables

Update/create only the necessary:

* Page Objects
* Spec files
* Fixtures
* Test data
* Environment values
* Config updates
* **README.md** (see Section 14)

Avoid unrelated modifications.

---

# 14. README Maintenance (Mandatory)

The project root **`README.md`** is the single source of truth for automation structure, setup, and usage. It MUST stay accurate whenever the codebase changes.

## When to Update

Update `README.md` in the **same change** whenever you:

* Add, remove, or rename spec files, page objects, fixtures, or utilities
* Add or change npm scripts in `package.json`
* Add or change environment variables in `.env` (document names and purpose; never commit secrets)
* Add a new test module or change test case counts / skip status
* Change `playwright.config.ts` execution settings (workers, projects, reporters)
* Change folder layout or architectural conventions

## What to Update

Keep these sections current (create missing sections if needed):

* **Project structure** – directory tree reflecting the repo
* **Architecture** – layer responsibilities and execution model
* **Environment variables** – table of all required/optional vars
* **Running tests** – npm / Playwright commands
* **Test coverage** – modules, case counts, skipped cases, known failures
* **Last updated** – date at the top of the file (`YYYY-MM-DD`)

## Rules

* Do not duplicate full content from `.cursor/rules.md`; link to it for detailed automation rules.
* Do not put live credentials in `README.md`.
* Prefer concise tables and trees over long prose.
* If a change is too small to warrant a README edit (e.g. typo fix inside a spec with no structural impact), no update is required.

## Final Checklist Addition

Before finalizing any automation change, confirm:

* `README.md` reflects the current structure and how to run the affected tests
* **Last updated** date is bumped when README content changed

