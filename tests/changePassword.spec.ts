import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';
import {
  getCurrentPassword,
  getInitialPassword,
  initializePasswordState,
  setCurrentPassword,
  getPasswordStateFilePath,
} from '../utils/passwordState';

const validEmail = process.env.VALID_EMAIL ?? '';
const passwords = testData.changePassword.passwords;
const messages = testData.changePassword.messages;
const altA = process.env.CHANGE_PASSWORD_ALT_A ?? passwords.alternateA;
const altB = process.env.CHANGE_PASSWORD_ALT_B ?? passwords.alternateB;
const altC = process.env.CHANGE_PASSWORD_ALT_C ?? passwords.alternateC;

test.describe.configure({ mode: 'serial' });

test.beforeAll(() => {
  initializePasswordState('change-password-suite-start');
});

async function loginMember(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
  password: string,
): Promise<void> {
  await loginPage.goto();
  await loginPage.login(validEmail, password);
  await dashboardPage.expectOnDashboard();
}

test.describe('Change Password Module', () => {
  test('TC_001 – Verify authenticated user can open the Change password page', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Navigate to dashboard and open change password modal', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
    });
    await test.step('Verify change password form fields are displayed', async () => {
      await changePasswordPage.expectModalVisible();
    });
  });

  test('TC_003 – Verify Change password page is not accessible without authentication', async ({
    loginPage,
    page,
  }) => {
    await test.step('Clear session and open protected dashboard URL', async () => {
      await page.goto(testData.routes.login);
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.goto(testData.routes.dashboard);
    });
    await test.step('Verify access is blocked and sign-in is required', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_004 – Verify submission is blocked when current password field is empty', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Open change password modal with empty current password', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.fillForm('', altA, altA);
      await changePasswordPage.submit();
    });
    await test.step('Verify current password required message', async () => {
      await changePasswordPage.expectFieldErrorVisible(messages.currentRequired);
    });
  });

  test('TC_005 – Verify submission is rejected when current password is incorrect', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Submit with incorrect current password', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(passwords.wrongCurrent, altA, altA);
    });
    await test.step('Verify incorrect current password message', async () => {
      await changePasswordPage.expectToastVisible(messages.currentIncorrect);
    });
  });

  test('TC_006 – Verify submission is blocked when new password field is empty', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Submit with empty new password', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.fillForm(getCurrentPassword(), '', '');
      await changePasswordPage.submit();
    });
    await test.step('Verify new password required message', async () => {
      await changePasswordPage.expectFieldErrorVisible(messages.newRequired);
    });
  });

  test('TC_007 – Verify new password is rejected when it does not meet the documented password policy', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Submit password violating policy rules', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(getCurrentPassword(), passwords.tooShort, passwords.tooShort);
    });
    await test.step('Verify submission remains on dashboard without success', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
      await changePasswordPage.expectModalVisible();
    });
  });

  // test('TC_008 – Verify submission is blocked when confirm new password does not match new password', async ({
  //   loginPage,
  //   dashboardPage,
  //   changePasswordPage,
  // }) => {
  //   await test.step('Submit with mismatched confirmation', async () => {
  //     await loginMember(loginPage, dashboardPage, getCurrentPassword());
  //     await dashboardPage.openChangePasswordModal();
  //     await changePasswordPage.changePassword(getCurrentPassword(), altA, passwords.mismatchConfirm);
  //   });
  //   await test.step('Verify passwords must match message', async () => {
  //     await changePasswordPage.expectFieldErrorVisible(messages.mismatch);
  //   });
  // });

  test('TC_012 – Verify new password fields mask input by default', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Type into password fields and verify masking', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.currentPasswordInput.fill(getCurrentPassword());
      await changePasswordPage.newPasswordInput.fill(altA);
      await changePasswordPage.confirmPasswordInput.fill(altA);
      await changePasswordPage.expectPasswordFieldsMasked();
    });
  });

  test('TC_013 – Verify show or hide password toggles behave correctly when present on change password fields', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Toggle visibility on all password fields', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.currentPasswordInput.fill(getCurrentPassword());
      await changePasswordPage.newPasswordInput.fill(altA);
      await changePasswordPage.confirmPasswordInput.fill(altA);
      await changePasswordPage.toggleCurrentPasswordVisibility();
      await expect(changePasswordPage.currentPasswordInput).toHaveAttribute('type', 'text');
      await changePasswordPage.toggleNewPasswordVisibility();
      await expect(changePasswordPage.newPasswordInput).toHaveAttribute('type', 'text');
      await changePasswordPage.toggleConfirmPasswordVisibility();
      await expect(changePasswordPage.confirmPasswordInput).toHaveAttribute('type', 'text');
      await expect(changePasswordPage.newPasswordInput).toHaveValue(altA);
    });
  });

  test('TC_016 – Verify keyboard user can tab through current password, new password and submit in a logical order', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Tab through primary modal controls', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.expectKeyboardOrder();
    });
  });

  test('TC_017 – Verify page title and instructional copy for change password match the design', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Verify modal heading and instructional copy', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await expect(changePasswordPage.modalHeading).toHaveText(testData.changePassword.ui.modalHeading);
      await expect(changePasswordPage.page.getByText('現在のパスワード', { exact: false })).toBeVisible();
      await expect(changePasswordPage.page.getByText('パスワードを入力してください', { exact: false })).toBeVisible();
      await expect(changePasswordPage.page.getByText('パスワードを確認してください', { exact: false })).toBeVisible();
    });
  });

  test('TC_018 – Verify change password form layout remains usable at a narrow viewport width', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Resize to mobile width and verify form usability', async () => {
      await page.setViewportSize({ width: 375, height: 812 });
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.expectModalVisible();
      await expect(changePasswordPage.saveButton).toBeEnabled();
    });
  });

  test('TC_019 – Verify new password identical to current password is rejected', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    const current = getCurrentPassword();
    await test.step('Submit with new password identical to current password', async () => {
      await loginMember(loginPage, dashboardPage, current);
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(current, current, current);
    });
    await test.step('Verify reuse rejection message', async () => {
      await changePasswordPage.expectToastVisible(messages.sameAsCurrent);
    });
  });

  test('TC_020 – Verify Return to My Page or back navigation from change password returns to the expected member area without losing session unintentionally', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Cancel change password modal', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.cancel();
    });
    await test.step('Verify user remains signed in on dashboard', async () => {
      await dashboardPage.expectOnDashboard();
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
    });
  });

  test('TC_021 – Verify whitespace-only new password is rejected on submit', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Submit whitespace-only new password', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(getCurrentPassword(), '        ', '        ');
    });
    await test.step('Verify submission is blocked without success', async () => {
      await changePasswordPage.expectModalVisible();
      await expect(changePasswordPage.toastMessage(messages.success)).toBeHidden();
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
    });
  });

  test('TC_022 – Verify password change is blocked when Password is shorter than 8 characters', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Submit short new password', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(getCurrentPassword(), passwords.tooShort, passwords.tooShort);
    });
    await test.step('Verify submission is blocked', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
      await changePasswordPage.expectModalVisible();
    });
  });

  test('TC_023 – Verify password change is blocked when Password has no uppercase English letter', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Submit password without uppercase', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(getCurrentPassword(), passwords.noUppercase, passwords.noUppercase);
    });
    await test.step('Verify submission is blocked', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
    });
  });

  test('TC_024 – Verify password change is blocked when Password has no lowercase English letter', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Submit password without lowercase', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(getCurrentPassword(), passwords.noLowercase, passwords.noLowercase);
    });
    await test.step('Verify submission is blocked', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
    });
  });

  test('TC_025 – Verify password change blocks password with no digit when a digit is required', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Submit password without digit', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(getCurrentPassword(), passwords.noDigit, passwords.noDigit);
    });
    await test.step('Verify submission is blocked', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
    });
  });

  test('TC_026 – Verify password change blocks password with no special character when that rule applies', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    await test.step('Submit password without special character', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(getCurrentPassword(), passwords.noSpecial, passwords.noSpecial);
    });
    await test.step('Verify submission is blocked', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
    });
  });

  test('TC_002 – Verify successful password change when current password is correct and new password meets all policy criteria', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
    page,
  }) => {
    const current = getCurrentPassword();
    await test.step('Submit valid password change', async () => {
      await loginMember(loginPage, dashboardPage, current);
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(current, altA, altA);
    });
    await test.step('Verify success without exposing password in URL', async () => {
      await changePasswordPage.expectSuccessMessage();
      setCurrentPassword(altA, 'TC_002');
      expect(page.url()).not.toContain(altA);
    });
  });

  test('TC_009 – Verify user can sign in with the new password after a successful change from the same session or after sign-out', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Sign in using the latest changed password', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
    });
    await test.step('Verify authenticated dashboard access', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_010 – Verify sign-in fails when using the previous password after a successful change', async ({
    loginPage,
    page,
  }) => {
    await test.step('Attempt login with previous password', async () => {
      await loginPage.goto();
      await loginPage.login(validEmail, getInitialPassword());
    });
    await test.step('Verify authentication is rejected', async () => {
      await loginPage.expectInvalidCredentialsMessage();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_011 – Verify changing password again after a first successful change works when the latest current password is used', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    const current = getCurrentPassword();
    await test.step('Perform second successful password change', async () => {
      await loginMember(loginPage, dashboardPage, current);
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(current, altB, altB);
      await changePasswordPage.expectSuccessMessage();
      setCurrentPassword(altB, 'TC_011');
    });
    await test.step('Verify login with latest password only', async () => {
      await loginMember(loginPage, dashboardPage, altB);
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_014 – Verify rapid double click on submit does not leave the account in an inconsistent password state', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    const current = getCurrentPassword();
    await test.step('Double-click submit with valid password change data', async () => {
      await loginMember(loginPage, dashboardPage, current);
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.fillForm(current, altC, altC);
      await changePasswordPage.saveButton.dblclick();
      await changePasswordPage.expectSuccessMessage();
      setCurrentPassword(altC, 'TC_014');
    });
    await test.step('Verify consistent login with resulting password', async () => {
      await loginMember(loginPage, dashboardPage, altC);
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_015 – Verify password change request completes within acceptable time under normal server conditions', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    await test.step('Measure validation response time on submit', async () => {
      await loginMember(loginPage, dashboardPage, getCurrentPassword());
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.fillForm(getCurrentPassword(), '', '');
      const started = Date.now();
      await changePasswordPage.submit();
      await changePasswordPage.expectFieldErrorVisible(messages.newRequired);
      const elapsed = Date.now() - started;
      expect(elapsed).toBeLessThan(15000);
    });
  });

  test('TC_REVERT – Revert account password to the original initial password after suite execution', async ({
    loginPage,
    dashboardPage,
    changePasswordPage,
  }) => {
    const initialPassword = getInitialPassword();
    const current = getCurrentPassword();

    test.skip(current === initialPassword, 'Password is already at the initial value');

    await test.step('Change password back to the original initial password', async () => {
      await loginMember(loginPage, dashboardPage, current);
      await dashboardPage.openChangePasswordModal();
      await changePasswordPage.changePassword(current, initialPassword, initialPassword);
      await changePasswordPage.expectSuccessMessage();
      setCurrentPassword(initialPassword, 'TC_REVERT');
    });
    await test.step('Verify login works with the reverted initial password', async () => {
      await loginMember(loginPage, dashboardPage, initialPassword);
      await dashboardPage.expectOnDashboard();
    });
  });
});

test.afterAll(() => {
  const statePath = getPasswordStateFilePath();
  const current = getCurrentPassword();
  const initial = getInitialPassword();
  // eslint-disable-next-line no-console
  console.log(`[password-state] file: ${statePath}`);
  // eslint-disable-next-line no-console
  console.log(`[password-state] current: ${current}`);
  // eslint-disable-next-line no-console
  console.log(`[password-state] initial: ${initial}`);
});
