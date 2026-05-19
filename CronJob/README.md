# Scheduled Playwright Tests (GitHub Actions)

This folder documents the **cron-based GitHub Action** that periodically runs the Playwright suite against the **latest commit** on a configured Git branch.

Workflow file: [`.github/workflows/cron-playwright-tests.yml`](../.github/workflows/cron-playwright-tests.yml)

---

## What it does

| Trigger | Behavior |
|---------|----------|
| **Schedule (cron)** | Runs daily at **02:00 UTC** on the branch resolved below |
| **Manual (`workflow_dispatch`)** | Run on demand from the Actions tab; optional branch and test suite |

On each run the job:

1. Checks out the **latest code** from the target branch (`fetch-depth: 0`)
2. Installs npm dependencies and Playwright Chromium
3. Runs Playwright tests (`npm test` by default)
4. Generates an Allure HTML report
5. Uploads Playwright report, Allure report, and raw results as workflow artifacts (14-day retention)

---

## Which branch runs?

GitHub **scheduled workflows only execute from the repository default branch** (the workflow YAML must exist there). The tests themselves can target another branch.

Branch resolution order:

1. **Manual run:** `branch` input (if provided)
2. **Repository variable:** `CRON_TARGET_BRANCH` (Settings → Secrets and variables → Actions → Variables)
3. **Fallback:** default branch ref (`github.ref_name`, e.g. `master`)

### Example: run latest from a feature branch

If your active branch is `feat/changePassword_Login_Registration`:

1. Merge or push this workflow to the **default branch** (`master`).
2. In GitHub: **Settings → Secrets and variables → Actions → Variables**
3. Add variable: `CRON_TARGET_BRANCH` = `feat/changePassword_Login_Registration`

Scheduled runs will then checkout and test the **latest commit** on that branch every day.

To switch branches later, update `CRON_TARGET_BRANCH` — no workflow edit required.

---

## One-time GitHub setup

### 1. Push the workflow

Ensure `.github/workflows/cron-playwright-tests.yml` exists on the **default branch** of:

`https://github.com/inv-aravind/Vectrix_Member_MCP`

### 2. Add repository secrets

**Settings → Secrets and variables → Actions → Secrets → New repository secret**

| Secret | Required | Description |
|--------|----------|-------------|
| `BASE_URL` | Yes | Application base URL |
| `BASIC_AUTH_USERNAME` | Yes | HTTP basic auth username |
| `BASIC_AUTH_PASSWORD` | Yes | HTTP basic auth password |
| `VALID_EMAIL` | Yes | Existing member email |
| `VALID_PASSWORD` | Yes | Password for `VALID_EMAIL` |
| `UNREGISTERED_EMAIL` | Yes | Email not registered in the system |
| `INVALID_PASSWORD` | Yes | Wrong password for negative login tests |
| `REGISTRATION_EMAIL_LOCAL_PART` | Yes | e.g. `reacharavindh.s14` |
| `REGISTRATION_EMAIL_DOMAIN` | Yes | e.g. `gmail.com` |
| `REGISTRATION_PASSWORD` | Yes | Default valid registration password |
| `CHANGE_PASSWORD_ALT_A` | Yes* | Alternate password (change-password suite) |
| `CHANGE_PASSWORD_ALT_B` | Yes* | Alternate password (change-password suite) |
| `CHANGE_PASSWORD_ALT_C` | Yes* | Alternate password (change-password suite) |
| `NON_ACTIVATED_EMAIL` | No | Non-activated account (TC_012 skip if missing) |
| `NON_ACTIVATED_PASSWORD` | No | Password for non-activated account |

\*Required only when running the full suite or `test:change-password`.

Use the same values as your local `.env` file.

### 3. (Optional) Set target branch variable

| Variable | Example value |
|----------|----------------|
| `CRON_TARGET_BRANCH` | `feat/changePassword_Login_Registration` |

---

## Changing the schedule

Edit the `cron` expression in `.github/workflows/cron-playwright-tests.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'   # minute hour day month weekday (UTC)
```

Examples:

| Schedule | Cron |
|----------|------|
| Daily 02:00 UTC | `0 2 * * *` |
| Daily 06:00 IST (00:30 UTC) | `30 0 * * *` |
| Weekdays 09:00 UTC | `0 9 * * 1-5` |
| Every 6 hours | `0 */6 * * *` |

Cron syntax reference: [GitHub Actions schedule](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)

> Scheduled workflows may be delayed during high GitHub load; they are not guaranteed to the exact minute.

---

## Manual runs

1. Open **Actions** → **Scheduled Playwright Tests**
2. Click **Run workflow**
3. Choose:
   - **branch** — leave empty to use `CRON_TARGET_BRANCH` / default branch
   - **test_command** — `test`, `test:login`, `test:registration`, or `test:change-password`

---

## Viewing results

After a run completes (pass or fail):

1. Open the workflow run in **Actions**
2. Scroll to **Artifacts**
3. Download:
   - `playwright-report-*` — Playwright HTML report
   - `allure-report-*` — Allure HTML report (open `index.html` locally)
   - `test-results-*` — traces, screenshots, `allure-results/`

---

## CI behavior notes

- `CI=true` is set automatically; Playwright config enables **1 retry** on failure in CI.
- Tests run **sequentially** (`workers: 1`) as in local config.
- **Change-password suite** mutates the live test account password on the target environment. The suite includes `TC_REVERT` to restore `VALID_PASSWORD`. If a scheduled run fails before revert, reset the account password manually or re-run `test:change-password` until `TC_REVERT` passes.
- Registration tests that need mailbox access remain skipped in CI (same as local).
- Concurrent scheduled runs for the same branch are cancelled (`concurrency.cancel-in-progress: true`) to avoid overlapping password changes.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Schedule never runs | Workflow must be on the **default branch**; check Actions are enabled for the repo |
| Wrong branch tested | Set or update `CRON_TARGET_BRANCH` |
| `npm ci` fails | Commit `package-lock.json`; run `npm install` locally and push lockfile |
| Playwright browser missing | Workflow runs `npx playwright install chromium --with-deps` |
| Auth / login failures | Verify secrets match `.env`; check `BASE_URL` and basic auth |
| Timeouts | Increase `timeout-minutes` on the job in the workflow file |

---

## Files

| Path | Purpose |
|------|---------|
| `.github/workflows/cron-playwright-tests.yml` | Workflow definition |
| `CronJob/README.md` | This document |
