# Mobipark Member Site – Playwright Automation

End-to-end UI automation for the **Mobipark Member Site** using Playwright, TypeScript, and the Page Object Model (POM). Test cases are derived from manual test documents under `TestCases/` and implemented according to `.cursor/rules.md`.

**Last updated:** 2026-05-18

---

## Project structure

```
[MCP]/
├── .cursor/
│   └── rules.md                 # Automation rules (POM, MCP, fixtures, README policy)
├── .runtime/
│   ├── password-state.json      # Live password tracker (gitignored; change-password suite)
│   └── profile-state.json       # Profile baseline (gitignored; account-settings suite)
├── Credentials/
│   └── credetials.md            # Reference credentials (not used at runtime)
├── TestCases/
│   ├── LoginTestCases.md        # Login module manual test cases (42)
│   ├── Registration_TestCases.md # Registration module manual test cases (68)
│   ├── ChangePassword_TestCases.md # Change password module (26)
│   └── Account_settings_TestCases.md # Account settings module (36)
├── data/
│   └── testData.json            # Shared test data, routes, UI messages
├── fixtures/
│   └── page-fixture.ts          # Custom Playwright fixtures (page object injection)
├── page-objects/
│   ├── Login.page.ts
│   ├── Dashboard.page.ts
│   ├── ForgotPassword.page.ts
│   ├── Register.page.ts
│   ├── ChangePassword.page.ts
│   └── AccountSettings.page.ts
├── tests/
│   ├── login.spec.ts            # Login module (TC_001–TC_042)
│   ├── registration.spec.ts     # Registration module (TC_001–TC_068)
│   ├── changePassword.spec.ts   # Change password (TC_001–TC_026 + TC_REVERT)
│   └── accountSettings.spec.ts  # Account settings (TC_001–TC_036 + TC_REVERT)
├── utils/
│   ├── registrationEmail.ts     # Unique registration email builder
│   ├── passwordState.ts         # Persists latest account password between tests
│   └── profileState.ts          # Persists profile baseline for account-settings revert
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env                         # Environment variables (not committed)
└── README.md                    # This file – keep in sync with the codebase
```

---

## Architecture

| Layer | Responsibility |
|-------|----------------|
| **Spec files** (`tests/`) | Test flow, `test.step()` blocks, business-level assertions |
| **Page objects** (`page-objects/`) | Locators, UI actions, page-level assertions |
| **Fixtures** (`fixtures/`) | Inject page objects; never instantiate POMs inside specs |
| **Test data** (`data/testData.json`) | Routes, messages, field limits, reusable values |
| **Utils** (`utils/`) | Cross-cutting helpers (e.g. timestamped registration emails) |
| **Environment** (`.env`) | URLs, credentials, secrets |

### Execution model

- **Sequential:** `workers: 1`, `fullyParallel: false` (see `playwright.config.ts`)
- **Browser:** Chromium (Desktop Chrome profile)
- **Auth:** HTTP Basic Auth via `httpCredentials` in config
- **Locators:** Validated with Playwright MCP before implementation; stored only in page objects

---

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
cd d:\Work\Project\[Support]\Vectrix\[MCP]
npm install
npx playwright install chromium
```

Copy or create `.env` at the project root (see [Environment variables](#environment-variables)).

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `BASE_URL` | Application base URL |
| `BASIC_AUTH_USERNAME` | HTTP basic auth username |
| `BASIC_AUTH_PASSWORD` | HTTP basic auth password |
| `VALID_EMAIL` | Existing member email (login / duplicate-registration tests) |
| `VALID_PASSWORD` | Password for `VALID_EMAIL` |
| `UNREGISTERED_EMAIL` | Email not in the system |
| `INVALID_PASSWORD` | Wrong password for negative login tests |
| `NON_ACTIVATED_EMAIL` | Optional; non-activated account email |
| `NON_ACTIVATED_PASSWORD` | Optional; non-activated account password |
| `REGISTRATION_EMAIL_LOCAL_PART` | Local part base for registration (`reacharavindh.s14`) |
| `REGISTRATION_EMAIL_DOMAIN` | Domain for registration emails (`gmail.com`) |
| `REGISTRATION_PASSWORD` | Default valid registration password |
| `CHANGE_PASSWORD_ALT_A` | First alternate password for change-password flows |
| `CHANGE_PASSWORD_ALT_B` | Second alternate password for repeated-change tests |
| `CHANGE_PASSWORD_ALT_C` | Third alternate password for idempotency tests |

Registration emails use: `{REGISTRATION_EMAIL_LOCAL_PART}+{timestamp}@{REGISTRATION_EMAIL_DOMAIN}` via `buildRegistrationEmail()` in `utils/registrationEmail.ts`.

Change-password tests track the live account password in `.runtime/password-state.json` via `getCurrentPassword()` / `setCurrentPassword()` in `utils/passwordState.ts`. If a run fails mid-suite, read that file to see the last known password.

Account-settings tests capture the signed-in profile in `.runtime/profile-state.json` during TC_001 and restore it in **`TC_REVERT`** via `utils/profileState.ts`.

---

## Running tests

| Command | Description |
|---------|-------------|
| `npm test` | Run full suite |
| `npm run test:login` | Login module only |
| `npm run test:registration` | Registration module only |
| `npm run test:change-password` | Change password module only |
| `npm run test:account-settings` | Account settings module only |
| `npm run test:headed` | Run with visible browser |
| `npm run test:report` | Open Playwright HTML report |
| `npm run allure:generate` | Generate Allure HTML from `allure-results/` |
| `npm run allure:open` | Open generated Allure report in browser |
| `npm run allure:report` | Generate and open Allure report |

After any test run, raw Allure data is written to `allure-results/`. Generate a browsable report with `npm run allure:report`.

---

## Test coverage

### Login (`tests/login.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| Login | 42 | `TestCases/LoginTestCases.md` |

**Note:** TC_042 (scroll position on route change) may fail if the app retains scroll offset when navigating to Registration — documents a known UI defect.

### Registration (`tests/registration.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| Registration | 68 | `TestCases/Registration_TestCases.md` |

**Skipped (require mailbox / activation infrastructure):**

- TC_002 – activation email delivery
- TC_003 – activation link within 7 days
- TC_004 – post-activation login
- TC_006 – expired activation link
- TC_063 – unique activation token comparison

**Last run summary (registration):** 63 passed, 5 skipped

### Change Password (`tests/changePassword.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| Change Password | 26 + TC_REVERT | `TestCases/ChangePassword_TestCases.md` |

- Opens the change-password **modal** from dashboard → account menu → `パスワードを変更`
- Successful changes update `.runtime/password-state.json` immediately
- **`TC_REVERT`** runs last and restores `VALID_PASSWORD` from `.env`

**Last run summary (change password):** 27 passed (includes TC_REVERT)

### Account Settings (`tests/accountSettings.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| Account Settings | 36 + TC_REVERT | `TestCases/Account_settings_TestCases.md` |

- Route: `/mypage/settings` — view/edit pattern with `編集` / `保存` / `キャンセル`
- TC_001 writes baseline profile to `.runtime/profile-state.json`
- **`TC_REVERT`** restores the baseline profile when the suite mutates account data

**Skipped:**

- TC_033 – requires known registration payload for the signed-in account

---

## Conventions

- Use fixtures from `fixtures/page-fixture.ts` — do not `new LoginPage(page)` in specs.
- All selectors live in page objects; no raw selectors in spec files.
- Use `test.step()` for every manual test step.
- Read secrets and URLs from `.env`; use `data/testData.json` for `{{key}}` test data.
- Registration tests must use `buildRegistrationEmail()` for email fields (see `.cursor/rules.md`).
- Change-password tests must use `getCurrentPassword()` and `setCurrentPassword()` (see `.cursor/rules.md`).
- Account-settings tests must capture baseline in TC_001 and end with `TC_REVERT` (see `.cursor/rules.md`).

---

## Reports and artifacts

| Output | Location |
|--------|----------|
| Playwright HTML report | `playwright-report/` |
| Allure raw results | `allure-results/` |
| Allure HTML report | `allure-report/` |
| Failure screenshots / video | `test-results/` |
| MCP inspection snapshots | `.playwright-mcp/` (gitignored) |
| Password state (runtime) | `.runtime/password-state.json` (gitignored) |
| Profile baseline (runtime) | `.runtime/profile-state.json` (gitignored) |

---

## Maintenance

When adding or changing automation:

1. Follow `.cursor/rules.md`
2. Inspect UI with Playwright MCP before adding locators
3. Update page objects, fixtures, `testData.json`, and `.env` as needed
4. Run affected specs and fix failures
5. **Update this `README.md`** (structure, commands, coverage, env vars, last-updated date)

Detailed README policy is defined in `.cursor/rules.md` → **Section 14: README Maintenance**.
