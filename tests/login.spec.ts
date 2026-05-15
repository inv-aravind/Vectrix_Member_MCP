import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';

const validEmail = process.env.VALID_EMAIL ?? '';
const validPassword = process.env.VALID_PASSWORD ?? '';
const unregisteredEmail = process.env.UNREGISTERED_EMAIL ?? testData.login.validEmailFormats[0];
const invalidPassword = process.env.INVALID_PASSWORD ?? 'WrongPassword@999';

test.describe.configure({ mode: 'serial' });

test.describe('Login Module', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_001 – Verify successful login with valid registered email and password', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Enter registered email address', async () => {
      await loginPage.fillEmail(validEmail);
    });
    await test.step('Enter matching correct password', async () => {
      await loginPage.fillPassword(validPassword);
    });
    await test.step('Click the Log in button', async () => {
      await loginPage.clickLogin();
    });
    await test.step('Verify authenticated access to members-only area', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_002 – Verify members-only content is accessible after successful login', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Log in with valid credentials', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
    await test.step('Navigate to a protected members-only page', async () => {
      await dashboardPage.navigateToProtectedVehiclePage();
    });
    await test.step('Verify access is granted without redirect to Login', async () => {
      await dashboardPage.expectProtectedContentAccessible();
    });
  });

  test('TC_003 – Verify successful login redirects the user to the Dashboard', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Enter valid activated member credentials', async () => {
      await loginPage.login(validEmail, validPassword);
    });
    await test.step('Observe URL and page content after authentication', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_004 – Verify validation when Email Address and Password are both empty', async ({
    loginPage,
    page,
  }) => {
    await test.step('Leave Email Address and Password fields empty', async () => {
      await expect(loginPage.emailInput).toHaveValue('');
      await expect(loginPage.passwordInput).toHaveValue('');
    });
    await test.step('Click the Log in button', async () => {
      await loginPage.clickLogin();
    });
    await test.step('Verify validation for required fields', async () => {
      await loginPage.expectEmailRequiredError();
      await loginPage.expectPasswordRequiredError();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_005 – Verify validation when Email Address is empty and Password is entered', async ({
    loginPage,
    page,
  }) => {
    await test.step('Leave Email Address empty and enter Password', async () => {
      await loginPage.fillPassword('anypassword');
    });
    await test.step('Click the Log in button', async () => {
      await loginPage.clickLogin();
    });
    await test.step('Verify Email Address required indication', async () => {
      await loginPage.expectEmailRequiredError();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_006 – Verify validation when Password is empty and Email Address is entered', async ({
    loginPage,
    page,
  }) => {
    await test.step('Enter valid email and leave Password empty', async () => {
      await loginPage.fillEmail('user@example.com');
    });
    await test.step('Click the Log in button', async () => {
      await loginPage.clickLogin();
    });
    await test.step('Verify Password required indication', async () => {
      await loginPage.expectPasswordRequiredError();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_007 – Verify login is rejected when Email Address format is invalid (missing @)', async ({
    loginPage,
    page,
  }) => {
    await test.step('Enter email without @ symbol', async () => {
      await loginPage.fillEmail(testData.login.invalidEmails.missingAt);
      await loginPage.fillPassword('anypassword');
    });
    await test.step('Click the Log in button', async () => {
      await loginPage.clickLogin();
    });
    await test.step('Verify invalid email format indication', async () => {
      await loginPage.expectInvalidEmailFormatError();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_008 – Verify login is rejected when Email Address format is invalid (missing local part)', async ({
    loginPage,
    page,
  }) => {
    await test.step('Enter email starting with @ and domain', async () => {
      await loginPage.fillEmail(testData.login.invalidEmails.missingLocalPart);
      await loginPage.fillPassword('anypassword');
    });
    await test.step('Click the Log in button', async () => {
      await loginPage.clickLogin();
    });
    await test.step('Verify invalid email format indication', async () => {
      await loginPage.expectInvalidEmailFormatError();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_009 – Verify login is rejected when Email Address format is invalid (missing domain)', async ({
    loginPage,
    page,
  }) => {
    await test.step('Enter email with missing domain', async () => {
      await loginPage.fillEmail(testData.login.invalidEmails.missingDomain);
      await loginPage.fillPassword('anypassword');
    });
    await test.step('Click the Log in button', async () => {
      await loginPage.clickLogin();
    });
    await test.step('Verify invalid email format indication', async () => {
      await loginPage.expectInvalidEmailFormatError();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_010 – Verify login is rejected using an unregistered email address', async ({
    loginPage,
    page,
  }) => {
    await test.step('Enter unregistered email with any password', async () => {
      await loginPage.login(unregisteredEmail, 'anypassword');
    });
    await test.step('Verify invalid credential indication', async () => {
      await loginPage.expectInvalidCredentialsMessage();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_011 – Verify login is rejected using incorrect password', async ({ loginPage, page }) => {
    await test.step('Enter registered email with incorrect password', async () => {
      await loginPage.login(validEmail, invalidPassword);
    });
    await test.step('Verify invalid credential indication', async () => {
      await loginPage.expectInvalidCredentialsMessage();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_012 – Verify login fails when account is not activated', async ({ loginPage, page }) => {
    const nonActivatedEmail = process.env.NON_ACTIVATED_EMAIL;
    const nonActivatedPassword = process.env.NON_ACTIVATED_PASSWORD;

    test.skip(!nonActivatedEmail || !nonActivatedPassword, 'Non-activated account credentials are not configured in .env');

    await test.step('Attempt login with non-activated account', async () => {
      await loginPage.login(nonActivatedEmail!, nonActivatedPassword!);
    });
    await test.step('Verify login is prevented', async () => {
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_013 – Verify password field masks entered characters', async ({ loginPage }) => {
    await test.step('Enter password and verify input type is password', async () => {
      await loginPage.fillPassword('SecretPassword123');
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test('TC_014 – Verify login button is clickable and functional', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Verify login button is enabled', async () => {
      await expect(loginPage.loginButton).toBeEnabled();
    });
    await test.step('Submit valid credentials via login button', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_015 – Verify user session is created after successful login', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Log in with valid credentials', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
    await test.step('Verify authenticated session storage exists', async () => {
      const cookies = await page.context().cookies();
      const storageEntries = await page.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length);
      expect(cookies.length + storageEntries).toBeGreaterThan(0);
    });
  });

  test('TC_016 – Verify authenticated user cannot access Login page again', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Log in with valid credentials', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
    await test.step('Navigate to Login page while authenticated', async () => {
      await loginPage.goto();
    });
    await test.step('Verify user is redirected away from Login page', async () => {
      await expect(page).toHaveURL(new RegExp(testData.routes.dashboard));
    });
  });

  test('TC_017 – Verify logout invalidates user session', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Log in and open account menu', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
    await test.step('Log out from account menu', async () => {
      await dashboardPage.logout();
    });
    await test.step('Verify session is terminated and Login page is shown', async () => {
      await loginPage.expectOnLoginPage();
      const storageEntries = await page.evaluate(() => ({
        local: Object.keys(localStorage),
        session: Object.keys(sessionStorage),
      }));
      expect(storageEntries.local.length + storageEntries.session.length).toBe(0);
    });
  });

  test('TC_018 – Verify protected pages are inaccessible after logout', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Log in and then log out', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.logout();
      await loginPage.expectOnLoginPage();
    });
    await test.step('Attempt direct access to protected page', async () => {
      await page.goto(testData.routes.dashboard);
    });
    await test.step('Verify redirect to Login page', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_019 – Verify email field accepts valid email formats', async ({ loginPage }) => {
    for (const email of testData.login.validEmailFormats) {
      await test.step(`Accept valid email format: ${email}`, async () => {
        await loginPage.fillEmail(email);
        await expect(loginPage.emailInput).toHaveValue(email);
        await expect(loginPage.emailError).toBeHidden();
        await loginPage.emailInput.clear();
      });
    }
  });

  test('TC_020 – Verify password field enforces maximum length', async ({ loginPage }) => {
    await test.step('Enter password beyond typical max length', async () => {
      await loginPage.fillPassword(testData.login.longPassword);
    });
    await test.step('Verify field value length is constrained', async () => {
      const value = await loginPage.passwordInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(128);
    });
  });

  test('TC_021 – Verify leading/trailing spaces are handled correctly in email field', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Enter email with leading and trailing spaces', async () => {
      await loginPage.login(testData.login.emailWithSpaces, validPassword);
    });
    await test.step('Verify login succeeds or email is normalized', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_022 – Verify login using email with uppercase characters', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Log in using uppercase email', async () => {
      await loginPage.login(testData.login.uppercaseEmail, validPassword);
    });
    await test.step('Verify successful authentication', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_023 – Verify pressing Enter key submits Login form', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Fill credentials and press Enter', async () => {
      await loginPage.fillEmail(validEmail);
      await loginPage.fillPassword(validPassword);
      await loginPage.submitWithEnter();
    });
    await test.step('Verify login submission occurs', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_024 – Verify Forgot Password link navigation', async ({
    loginPage,
    forgotPasswordPage,
  }) => {
    await test.step('Click Forgot Password link', async () => {
      await loginPage.forgotPasswordLink.click();
    });
    await test.step('Verify navigation to Forgot Password page', async () => {
      await forgotPasswordPage.expectOnForgotPasswordPage();
    });
  });

  test('TC_025 – Verify Register as new member link navigation', async ({
    loginPage,
    registerPage,
  }) => {
    await test.step('Click Register as new member link', async () => {
      await loginPage.registerLink.click();
    });
    await test.step('Verify navigation to Registration page', async () => {
      await registerPage.expectOnRegisterPage();
      await expect(registerPage.registrationHeading).toBeVisible();
    });
  });

  test('TC_026 – Verify browser back navigation after login', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Log in successfully', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
    await test.step('Navigate back in browser history', async () => {
      await page.goBack();
    });
    await test.step('Verify protected content remains secure', async () => {
      await expect(page).not.toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_027 – Verify direct access to Dashboard without login', async ({
    loginPage,
    page,
  }) => {
    await test.step('Navigate directly to Dashboard URL without authentication', async () => {
      await page.goto(testData.routes.dashboard);
    });
    await test.step('Verify redirect to Login page', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_028 – Verify login page loads successfully', async ({ loginPage, page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await test.step('Load Login page and verify UI elements', async () => {
      await loginPage.expectMandatoryElementsVisible();
    });
    await test.step('Verify no critical console errors', async () => {
      expect(consoleErrors.filter((e) => !e.includes('favicon'))).toHaveLength(0);
    });
  });

  test('TC_029 – Verify login page responsiveness on different screen sizes', async ({
    loginPage,
    page,
  }) => {
    const viewports = [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 },
    ];

    for (const viewport of viewports) {
      await test.step(`Verify usability at ${viewport.width}x${viewport.height}`, async () => {
        await page.setViewportSize(viewport);
        await loginPage.goto();
        await loginPage.expectMandatoryElementsVisible();
        await expect(loginPage.loginButton).toBeEnabled();
      });
    }
  });

  test('TC_030 – Verify validation message clarity for invalid credentials', async ({
    loginPage,
  }) => {
    await test.step('Submit invalid credentials', async () => {
      await loginPage.login(validEmail, invalidPassword);
    });
    await test.step('Verify clear validation message is displayed', async () => {
      await loginPage.expectInvalidCredentialsMessage();
      await expect(loginPage.invalidCredentialsToast).toHaveText(testData.messages.invalidCredentials);
    });
  });

  test('TC_031 – Verify multiple consecutive failed login attempts', async ({
    loginPage,
    page,
  }) => {
    await test.step('Perform multiple failed login attempts', async () => {
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        await loginPage.login(validEmail, `${invalidPassword}${attempt}`);
        await loginPage.expectInvalidCredentialsMessage();
      }
    });
    await test.step('Verify application remains functional', async () => {
      await expect(loginPage.loginButton).toBeEnabled();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_032 – Verify login with special characters in password', async ({
    loginPage,
    page,
  }) => {
    await test.step('Attempt login with special character password', async () => {
      await loginPage.login(validEmail, testData.login.specialCharPassword);
    });
    await test.step('Verify application handles special characters without crash', async () => {
      await expect(page).toHaveURL(new RegExp(`(${testData.routes.login}|${testData.routes.dashboard})`));
    });
  });

  test('TC_033 – Verify session persists during page refresh', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Log in successfully', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
    await test.step('Refresh the page', async () => {
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });
    await test.step('Verify authenticated session remains active', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_034 – Verify expired session redirects to Login page', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await test.step('Log in and clear session storage', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });
    await test.step('Access protected page with expired session', async () => {
      await page.goto(testData.routes.dashboard);
    });
    await test.step('Verify re-authentication is required', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_035 – Verify login functionality across supported browsers', async ({
    loginPage,
    dashboardPage,
    browserName,
  }) => {
    await test.step(`Verify login on ${browserName}`, async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_036 – Verify login page behavior during slow network conditions', async ({
    loginPage,
    page,
  }) => {
    await test.step('Simulate slow network for login page assets', async () => {
      await page.route('**/*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await route.continue();
      });
      await loginPage.goto();
    });
    await test.step('Verify page remains stable and usable', async () => {
      await loginPage.expectMandatoryElementsVisible();
      await expect(loginPage.loginButton).toBeEnabled();
    });
  });

  test('TC_037 – Verify login page handles server errors gracefully', async ({
    loginPage,
    page,
  }) => {
    await test.step('Mock server error on login API', async () => {
      await page.route('**/api/**', (route) =>
        route.fulfill({ status: 500, body: JSON.stringify({ message: 'Internal Server Error' }) }),
      );
      await loginPage.login(validEmail, validPassword);
    });
    await test.step('Verify user remains on login flow without technical leak', async () => {
      await expect(page).toHaveURL(new RegExp(`(${testData.routes.login}|${testData.routes.dashboard})`));
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.toLowerCase()).not.toContain('stack trace');
    });
  });

  test('TC_038 – Verify login form accessibility using keyboard navigation', async ({
    loginPage,
  }) => {
    await test.step('Tab through login controls using keyboard', async () => {
      await loginPage.expectLoginFormKeyboardOrder();
    });
  });

  test('TC_039 – Verify focus order on Login page', async ({ loginPage }) => {
    await test.step('Verify top-to-bottom focus progression', async () => {
      await loginPage.emailInput.focus();
      await expect(loginPage.emailInput).toBeFocused();
      await loginPage.expectLoginFormKeyboardOrder();
    });
  });

  test('TC_040 – Verify Login page UI elements visibility', async ({ loginPage }) => {
    await test.step('Verify all mandatory UI elements are visible and aligned', async () => {
      await loginPage.expectMandatoryElementsVisible();
    });
  });

  test('TC_041 – Verify Login page retains no sensitive information after logout', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Log in, log out, and inspect login fields', async () => {
      await loginPage.login(validEmail, validPassword);
      await dashboardPage.logout();
      await loginPage.expectOnLoginPage();
    });
    await test.step('Verify sensitive fields are cleared', async () => {
      await expect(loginPage.emailInput).toHaveValue('');
      await expect(loginPage.passwordInput).toHaveValue('');
    });
  });

  test('TC_042 – Verify Registration page loads from the top after navigating from a scrolled Login page', async ({
    loginPage,
    registerPage,
    page,
  }) => {
    await test.step('Use a shorter viewport so the Login page can scroll', async () => {
      await page.setViewportSize({ width: 1280, height: 500 });
    });
    await test.step('Scroll Login page to the bottom', async () => {
      await loginPage.scrollToBottom();
    });
    await test.step('Navigate to Registration page', async () => {
      await loginPage.registerLink.click();
    });
    await test.step('Verify Registration page opens at top', async () => {
      await registerPage.expectOnRegisterPage();
      await registerPage.expectScrolledToTop();
      await expect(registerPage.registrationHeading).toBeInViewport();
    });
  });
});
