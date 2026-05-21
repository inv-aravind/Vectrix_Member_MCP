# Mobipark Member Site – Playwright Automation

End-to-end UI automation for the **Mobipark Member Site** using Playwright, TypeScript, and the Page Object Model (POM). Test cases are derived from manual test documents under `TestCases/` and implemented according to `.cursor/rules.md`.

**Last updated:** 2026-05-21

---

## Project structure

```
[MCP]/
├── .cursor/
│   └── rules.md                 # Automation rules (POM, MCP, fixtures, README policy)
├── .runtime/
│   ├── password-state.json      # Live password tracker (gitignored; change-password suite)
│   ├── profile-state.json       # Profile baseline (gitignored; account-settings suite)
│   └── vehicle-vin-state.json   # Consumed VIN tracker (gitignored; new vehicle registration)
├── Credentials/
│   └── credetials.md            # Reference credentials (not used at runtime)
├── TestCases/
│   ├── LoginTestCases.md        # Login module manual test cases (42)
│   ├── Registration_TestCases.md # Registration module manual test cases (68)
│   ├── ChangePassword_TestCases.md # Change password module (26)
│   └── Account_settings_TestCases.md # Account settings module (36)
│   └── Dashboard_TestCases.md       # Dashboard module (11)
│   └── ForgotPassword_TestCases.md  # Forgot password module (5)
│   └── ViewRegistration_TestCases.md # View registration module (42)
│   └── NewVehicleRegistration_TestCases.md # New vehicle registration module (44)
├── data/
│   ├── testData.json            # Shared test data, routes, UI messages
│   └── UnRegistered_Serial_Number.md # Unregistered VIN/serial numbers (reference)
├── fixtures/
│   └── page-fixture.ts          # Custom Playwright fixtures (page object injection)
├── page-objects/
│   ├── Login.page.ts
│   ├── Dashboard.page.ts
│   ├── ForgotPassword.page.ts
│   ├── Register.page.ts
│   ├── ChangePassword.page.ts
│   └── AccountSettings.page.ts
│   └── ViewRegistration.page.ts
│   └── NewVehicleRegistration.page.ts
├── tests/
│   ├── login.spec.ts            # Login module (TC_001–TC_042)
│   ├── registration.spec.ts     # Registration module (TC_001–TC_068)
│   ├── changePassword.spec.ts   # Change password (TC_001–TC_026 + TC_REVERT)
│   ├── accountSettings.spec.ts  # Account settings (TC_001–TC_036 + TC_REVERT)
│   └── dashboard.spec.ts        # Dashboard (TC_001–TC_011)
│   └── forgotPassword.spec.ts   # Forgot password (TC_001–TC_005)
│   └── viewRegistration.spec.ts # View registration (TC_001–TC_042)
│   └── newVehicleRegistration.spec.ts # New vehicle registration (TC_001–TC_044 + TC_MULTI)
│   └── vehicleRegistrationRegression.spec.ts # Combined regression (REG_*)
├── utils/
│   ├── registrationEmail.ts     # Unique registration email builder
│   ├── passwordState.ts         # Persists latest account password between tests
│   ├── profileState.ts          # Persists profile baseline for account-settings revert
│   ├── vehicleRegistrationAccounts.ts # Dedicated +1000–+1003 account helpers
│   ├── vehicleVinPool.ts        # Allocates unregistered VINs from testData pool
│   ├── vehicleApi.ts            # Validate API helpers and warranty date utils
│   └── vehicleRegistrationRegression.ts # Shared E2E helpers for combined regression
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
| `NO_VEHICLE_EMAIL` | Member with zero registered vehicles (`reacharavindh.s14+999@gmail.com`) |
| `NO_VEHICLE_PASSWORD` | Password for `NO_VEHICLE_EMAIL` |
| `NEW_VEHICLE_EMAIL_1000` | Dedicated registration account (+1000) |
| `NEW_VEHICLE_EMAIL_1001` | Dedicated registration account (+1001) |
| `NEW_VEHICLE_EMAIL_1002` | Dedicated registration account (+1002) |
| `NEW_VEHICLE_EMAIL_1003` | Dedicated registration account (+1003) |
| `NEW_VEHICLE_PASSWORD` | Shared password for +1000–+1003 accounts |
| `API_BASE_URL` | Mobipark members API base (`https://api.mobipark-members.innovaturelabs.net`) |

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
| `npm run test:dashboard` | Dashboard module only |
| `npm run test:forgot-password` | Forgot password module only |
| `npm run test:view-registration` | View registration module only |
| `npm run test:new-vehicle-registration` | New vehicle registration module only |
| `npm run test:vehicle-regression` | Combined view + new registration regression |
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

### Dashboard (`tests/dashboard.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| Dashboard | 11 | `TestCases/Dashboard_TestCases.md` |

- Route: `/mypage` — greeting, membership number, action cards, member information panel
- TC_002–TC_005 cross-check displayed data against Account Settings (`/mypage/settings`)

**Last run summary (dashboard):** 11 passed

### Forgot Password (`tests/forgotPassword.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| Forgot Password | 5 | `TestCases/ForgotPassword_TestCases.md` |

- Route: `/forgot-password` — opened from login link `パスワードを忘れた方`; submit `確認`
- TC_004/TC_005: app uses **anti-enumeration** (same acknowledgement toast for registered and unregistered emails, then redirect to login)

**Last run summary (forgot password):** 5 passed

### View Registration (`tests/viewRegistration.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| View Registration | 42 | `TestCases/ViewRegistration_TestCases.md` |

- Route: `/mypage/vehicle` — tabs `登録済み車両` / `新規登録`
- **With vehicles:** `VALID_EMAIL` (e.g. shows `過去オーナー` badge, serial `SERIAL-NO-02`)
- **No vehicles:** `NO_VEHICLE_EMAIL` (`reacharavindh.s14+999@gmail.com`)
- Unregistered serials reference: `data/UnRegistered_Serial_Number.md` (also in `testData.json`)

**Skipped (need extra test data / main-site access):**

- TC_005, TC_007 – current-owner registration / transfer scenarios
- TC_016, TC_038 – member with 2+ registered vehicles
- TC_019–TC_021 – documented warranty rule test vehicles
- TC_026 – duplicate of TC_024; API comparison
- TC_033, TC_034 – long text / security payload records
- TC_037, TC_039, TC_041, TC_042 – Mobipark main site inventory/catalog sync

**Last run summary (view registration):** 28 passed, 14 skipped

### New Vehicle Registration (`tests/newVehicleRegistration.spec.ts`)

| Module | Cases | Source |
|--------|-------|--------|
| New Vehicle Registration | 44 (+ TC_MULTI) | `TestCases/NewVehicleRegistration_TestCases.md` |

- Route: `/mypage/vehicle` → tab `新規登録`
- **Read-only / validation:** `NO_VEHICLE_EMAIL` (`+999`)
- **Registration accounts:** `NEW_VEHICLE_EMAIL_1000` … `1003` (password `NEW_VEHICLE_PASSWORD`)
- **VIN pool:** `ARSP-01` … `ARSP-43` in `testData.json` / `data/UnRegistered_Serial_Number.md`
- **API:** `GET /api/vehicles/validate`, `POST /api/vehicles`
- **State file:** `.runtime/vehicle-vin-state.json` tracks consumed VINs between runs

**Skipped (need main-site / Safari / delivery-date test data):**

- TC_010 – warranty boundary date vehicle
- TC_026, TC_027, TC_030 – two-year warranty / day-count (no delivery date on catalog VINs)
- TC_036, TC_040, TC_042 – Mobipark main site sync / Wholesale Status
- TC_043 – Safari-on-Mac typography

**Last run summary (new vehicle registration):** 37 passed, 8 skipped

### Vehicle Registration Regression (`tests/vehicleRegistrationRegression.spec.ts`)

Combined end-to-end regression for **New Vehicle Registration** and **Registered Vehicles** co-dependent flows.

| Flow | Description |
|------|-------------|
| REG_SETUP | Tab access, page header, empty/list baseline |
| REG_E2E_001 | Register PSA01 VIN → verify on Registered tab with owner badge |
| REG_E2E_002 | Confirmation → 登録車両一覧へ → list contains new vehicle |
| REG_E2E_003 | Tab switching; registered list stable; VIN input retained |
| REG_E2E_004 | Duplicate self-registration blocked; vehicle still listed |
| REG_E2E_005 | Cross-account transfer guidance; original owner list intact |
| REG_E2E_006 | Failed lookup does not mutate registered list |
| REG_E2E_007 | Validate API ↔ UI alignment for fresh PSA01 lookup |
| REG_E2E_008 | Empty-state CTA opens New registration from Registered tab |
| REG_CLEANUP | Logout + protected route guard + session clear |

- **VIN pool:** `PSA01-01` … `PSA01-43` (`data/testData.json`)
- **Accounts:** `+999` (empty), `+1000`–`+1003` (registration)
- **State:** `.runtime/vehicle-vin-state.json`

**Last run summary (vehicle registration regression):** 10 passed

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
