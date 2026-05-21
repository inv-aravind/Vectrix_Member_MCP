import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';
import { getCurrentPassword } from '../utils/passwordState';

const validEmail = process.env.VALID_EMAIL ?? '';
const unregisteredEmail = process.env.UNREGISTERED_EMAIL ?? testData.login.validEmailFormats[0];
const invalidEmail = testData.login.invalidEmails.missingAt;

test.describe.configure({ mode: 'serial' });

async function clearSession(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(testData.routes.login);
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function loginMember(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
): Promise<void> {
  await loginPage.goto();
  await loginPage.login(validEmail, getCurrentPassword());
  await dashboardPage.expectOnDashboard();
}

test.describe('Forgot Password Module', () => {
  test('TC_001 – Verify user can open the Forgot password page from the Login menu', async ({
    loginPage,
    forgotPasswordPage,
    page,
  }) => {
    await test.step('Navigate to Login page', async () => {
      await clearSession(page);
      await loginPage.goto();
    });
    await test.step('Click Forgot your password link', async () => {
      await loginPage.forgotPasswordLink.click();
    });
    await test.step('Verify forgot password page without sign-in', async () => {
      await forgotPasswordPage.expectOnForgotPasswordPage();
    });
  });

  test('TC_002 – Verify password reset request is blocked or shows validation when the email field is empty', async ({
    loginPage,
    dashboardPage,
    forgotPasswordPage,
    page,
  }) => {
    await test.step('Sign in and open Forgot password page', async () => {
      await clearSession(page);
      await loginMember(loginPage, dashboardPage);
      await forgotPasswordPage.goto();
    });
    await test.step('Submit with empty email', async () => {
      await forgotPasswordPage.submit();
    });
    await test.step('Verify email required validation', async () => {
      await forgotPasswordPage.expectEmailRequiredError();
      await expect(forgotPasswordPage.page).toHaveURL(new RegExp(testData.routes.forgotPassword));
    });
  });

  test('TC_003 – Verify password reset request is blocked when the email format is invalid', async ({
    loginPage,
    forgotPasswordPage,
    page,
  }) => {
    await test.step('Open Forgot password page', async () => {
      await clearSession(page);
      await loginPage.goto();
      await loginPage.forgotPasswordLink.click();
      await forgotPasswordPage.expectOnForgotPasswordPage();
    });
    await test.step('Enter invalid email format and submit', async () => {
      await forgotPasswordPage.requestReset(invalidEmail);
    });
    await test.step('Verify invalid email format message', async () => {
      await forgotPasswordPage.expectInvalidEmailFormatError();
      await expect(forgotPasswordPage.page).toHaveURL(new RegExp(testData.routes.forgotPassword));
    });
  });

  test('TC_004 – Verify submitting a non-registered email for forgot password', async ({
    loginPage,
    forgotPasswordPage,
    page,
  }) => {
    await test.step('Open Forgot password page and submit unregistered email', async () => {
      await clearSession(page);
      await forgotPasswordPage.goto();
      await forgotPasswordPage.requestReset(unregisteredEmail);
    });
    await test.step('Verify user-visible messaging without exposing registration status', async () => {
      await loginPage.expectOnLoginPage();
      await forgotPasswordPage.expectResetAcknowledgementVisible();
      await forgotPasswordPage.expectUnregisteredExplicitErrorHidden();
      await forgotPasswordPage.expectNoResetTokenOnScreen();
    });
  });

  test('TC_005 – Verify submitting a registered email triggers a success confirmation suitable for email dispatch', async ({
    loginPage,
    forgotPasswordPage,
    page,
  }) => {
    await test.step('Open Forgot password page and submit registered email', async () => {
      await clearSession(page);
      await forgotPasswordPage.goto();
      await forgotPasswordPage.requestReset(validEmail);
    });
    await test.step('Verify reset acknowledgement without sensitive token on screen', async () => {
      await loginPage.expectOnLoginPage();
      await forgotPasswordPage.expectResetAcknowledgementVisible();
      await forgotPasswordPage.expectNoResetTokenOnScreen();
    });
  });
});
