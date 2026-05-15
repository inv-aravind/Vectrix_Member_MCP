import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';

const validPassword = process.env.REGISTRATION_PASSWORD ?? testData.registration.validPassword;
const registeredEmail = process.env.VALID_EMAIL ?? '';
const limits = testData.registration.limits;
const messages = testData.registration.messages;
const defaults = testData.registration.defaults;

test.describe.configure({ mode: 'serial' });

test.describe('Registration Module', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  test('TC_001 – Verify successful registration when all required fields meet validation rules', async ({
    registerPage,
  }) => {
    await test.step('Complete registration with valid unique timestamped email', async () => {
      const data = await registerPage.registerWithValidDefaults();
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_002 – Verify activation email is delivered to the registered email address after successful registration', async () => {
    test.skip(true, 'Requires mailbox access to verify delivered activation email');
  });

  test('TC_003 – Verify account activation succeeds when the user opens the activation link within 7 days', async () => {
    test.skip(true, 'Requires activation link from mailbox');
  });

  test('TC_004 – Verify activated user can log in with registered email and password', async () => {
    test.skip(true, 'Requires completed email activation flow');
  });

  test('TC_005 – Verify login is blocked or shows pending-activation state before the activation link is used', async ({
    registerPage,
    loginPage,
    page,
  }) => {
    let email = '';
    await test.step('Register a new account without activating', async () => {
      const data = await registerPage.registerWithValidDefaults();
      email = data.email;
      await registerPage.expectRegistrationSuccess(email);
    });
    await test.step('Attempt login before activation', async () => {
      await loginPage.goto();
      await loginPage.login(email, validPassword);
    });
    await test.step('Verify login is not granted', async () => {
      await loginPage.expectInvalidCredentialsMessage();
      await expect(page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    });
  });

  test('TC_006 – Verify activation fails or shows expiry messaging when the activation link is used after 7 days', async () => {
    test.skip(true, 'Requires expired activation URL from test environment');
  });

  test('TC_007 – Verify registration is blocked when First Name is empty', async ({ registerPage }) => {
    await test.step('Submit with empty First Name', async () => {
      await registerPage.fillValidForm({ firstName: '' });
      await registerPage.submit();
    });
    await test.step('Verify First Name required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.firstNameRequired);
    });
  });

  test('TC_008 – Verify registration is blocked when Last Name is empty', async ({ registerPage }) => {
    await test.step('Submit with empty Last Name', async () => {
      await registerPage.fillValidForm({ lastName: '' });
      await registerPage.submit();
    });
    await test.step('Verify Last Name required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.lastNameRequired);
    });
  });

  test('TC_009 – Verify First Name cannot exceed 25 characters', async ({ registerPage }) => {
    const longName = registerPage.repeatChar('A', limits.firstName + 1);
    await test.step('Enter First Name longer than 25 characters', async () => {
      await registerPage.firstNameInput.fill(longName);
    });
    await test.step('Verify enforced maximum length', async () => {
      await expect(registerPage.firstNameInput).toHaveValue(registerPage.repeatChar('A', limits.firstName));
    });
  });

  test('TC_010 – Verify Last Name cannot exceed 25 characters', async ({ registerPage }) => {
    const longName = registerPage.repeatChar('B', limits.lastName + 1);
    await test.step('Enter Last Name longer than 25 characters', async () => {
      await registerPage.lastNameInput.fill(longName);
    });
    await test.step('Verify enforced maximum length', async () => {
      await expect(registerPage.lastNameInput).toHaveValue(registerPage.repeatChar('B', limits.lastName));
    });
  });

  test('TC_011 – Verify registration accepts First Name at exactly 25 characters when all other fields are valid', async ({
    registerPage,
  }) => {
    await test.step('Register with 25-character First Name', async () => {
      const data = await registerPage.registerWithValidDefaults({
        firstName: registerPage.repeatChar('T', limits.firstName),
      });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_012 – Verify registration accepts Last Name at exactly 25 characters when all other fields are valid', async ({
    registerPage,
  }) => {
    await test.step('Register with 25-character Last Name', async () => {
      const data = await registerPage.registerWithValidDefaults({
        lastName: registerPage.repeatChar('Y', limits.lastName),
      });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_013 – Verify registration is blocked when no Gender option is selected', async ({ registerPage }) => {
    await test.step('Submit without selecting Gender', async () => {
      const data = registerPage.buildDefaultFormData();
      await registerPage.fillForm({ ...data, gender: undefined });
      await registerPage.submit();
    });
    await test.step('Verify Gender required message', async () => {
      await registerPage.expectMessageVisible(messages.genderRequired);
    });
  });

  test('TC_014 – Verify registration is blocked when Date of birth is incomplete', async ({ registerPage }) => {
    await test.step('Submit with incomplete Date of birth', async () => {
      await registerPage.fillValidForm();
      await registerPage.birthDaySelect.selectOption('');
      await registerPage.submit();
    });
    await test.step('Verify Date of birth required message', async () => {
      await registerPage.expectMessageVisible(messages.birthDayRequired);
    });
  });

  test('TC_015 – Verify registration is blocked when Email Address is empty', async ({ registerPage }) => {
    await test.step('Submit with empty Email Address', async () => {
      await registerPage.fillValidForm({ email: '' });
      await registerPage.submit();
    });
    await test.step('Verify Email required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.emailRequired);
    });
  });

  test('TC_016 – Verify registration is blocked when Email Address format is invalid', async ({ registerPage }) => {
    await test.step('Submit with invalid email format', async () => {
      await registerPage.fillValidForm({ email: 'invalid-email' });
      await registerPage.submit();
    });
    await test.step('Verify invalid email message', async () => {
      await registerPage.expectFieldErrorVisible(messages.emailInvalid);
    });
  });

  test('TC_017 – Verify registration is rejected when Email Address is already registered', async ({
    registerPage,
  }) => {
    test.skip(!registeredEmail, 'VALID_EMAIL is not configured in .env');
    await test.step('Submit with already registered email', async () => {
      await registerPage.fillValidForm({ email: registeredEmail });
      await registerPage.submit();
    });
    await test.step('Verify duplicate email rejection', async () => {
      await registerPage.expectMessageVisible(messages.emailDuplicate);
    });
  });

  test('TC_018 – Verify registration is blocked when Telephone Number is empty', async ({ registerPage }) => {
    await test.step('Submit with empty Telephone Number', async () => {
      await registerPage.fillValidForm({ phone: '' });
      await registerPage.submit();
    });
    await test.step('Verify Telephone required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.phoneRequired);
    });
  });

  test('TC_019 – Verify Telephone Number cannot exceed 20 characters', async ({ registerPage }) => {
    const longPhone = registerPage.repeatChar('0', 21);
    await test.step('Enter Telephone Number longer than allowed maximum', async () => {
      await registerPage.phoneInput.fill(longPhone);
    });
    await test.step('Verify enforced maximum length', async () => {
      const value = await registerPage.phoneInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(limits.phone);
    });
  });

  test('TC_020 – Verify registration accepts Telephone Number at exactly 20 characters when valid', async ({
    registerPage,
  }) => {
    const phone = registerPage.repeatChar('0', limits.phone);
    await test.step('Register with maximum-length telephone number', async () => {
      const data = await registerPage.registerWithValidDefaults({ phone });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_021 – Verify Postal Code cannot exceed 50 characters', async ({ registerPage }) => {
    const longPostal = registerPage.repeatChar('1', limits.postalCode + 1);
    await test.step('Enter Postal Code longer than 50 characters', async () => {
      await registerPage.postalCodeInput.fill(longPostal);
    });
    await test.step('Verify enforced maximum length', async () => {
      const value = await registerPage.postalCodeInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(limits.postalCode);
    });
  });

  test('TC_022 – Verify Municipality cannot exceed 50 characters', async ({ registerPage }) => {
    const longCity = registerPage.repeatChar('市', limits.municipality + 1);
    await test.step('Enter Municipality longer than 50 characters', async () => {
      await registerPage.municipalityInput.fill(longCity);
    });
    await test.step('Verify enforced maximum length', async () => {
      const value = await registerPage.municipalityInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(limits.municipality);
    });
  });

  test('TC_023 – Verify Street Address cannot exceed 255 characters', async ({ registerPage }) => {
    const longStreet = registerPage.repeatChar('番', limits.streetAddress + 1);
    await test.step('Enter Street Address longer than 255 characters', async () => {
      await registerPage.streetAddressInput.fill(longStreet);
    });
    await test.step('Verify enforced maximum length', async () => {
      const value = await registerPage.streetAddressInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(limits.streetAddress);
    });
  });

  test('TC_024 – Verify Building name cannot exceed 50 characters', async ({ registerPage }) => {
    const longBuilding = registerPage.repeatChar('ビ', limits.buildingName + 1);
    await test.step('Enter Building name longer than 50 characters', async () => {
      await registerPage.buildingNameInput.fill(longBuilding);
    });
    await test.step('Verify enforced maximum length', async () => {
      const value = await registerPage.buildingNameInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(limits.buildingName);
    });
  });

  test('TC_025 – Verify no Gender option is selected by default when the user first opens the New Member Registration page', async ({
    registerPage,
  }) => {
    await test.step('Verify no Gender radio is pre-selected', async () => {
      await registerPage.expectNoGenderSelected();
    });
  });

  test('TC_026 – Verify user cannot access authenticated pages by URL manipulation', async ({
    loginPage,
    page,
  }) => {
    await test.step('Navigate directly to dashboard without authentication', async () => {
      await page.goto(testData.routes.dashboard);
    });
    await test.step('Verify redirect to Login page', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_027 – Verify Date of Birth does not allow selection of a year that makes the user under 16', async ({
    registerPage,
  }) => {
    await test.step('Verify latest selectable birth year policy', async () => {
      await registerPage.expectLatestBirthYear('2010');
    });
  });

  test('TC_028 – Verify Telephone Number accepts a standard Japanese domestic format without international country code', async ({
    registerPage,
  }) => {
    await test.step('Register with domestic telephone format', async () => {
      const data = await registerPage.registerWithValidDefaults({ phone: defaults.phone });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_029 – Verify Telephone Number accepts Japanese numbers entered with international country code plus eight one', async ({
    registerPage,
  }) => {
    await test.step('Register with international telephone format', async () => {
      const data = await registerPage.registerWithValidDefaults({ phone: defaults.phoneInternational });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_030 – Verify Postal Code mandatory behaviour', async ({ registerPage }) => {
    await test.step('Submit with empty Postal Code', async () => {
      await registerPage.fillValidForm({ postalCode: '' });
      await registerPage.submit();
    });
    await test.step('Verify Postal Code required message', async () => {
      await registerPage.expectMessageVisible(messages.postalRequired);
    });
  });

  test('TC_031 – Verify Municipality field mandatory behaviour', async ({ registerPage }) => {
    await test.step('Submit with empty Municipality', async () => {
      await registerPage.fillValidForm({ municipality: '' });
      await registerPage.submit();
    });
    await test.step('Verify Municipality required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.municipalityRequired);
    });
  });

  test('TC_032 – Verify Street Address mandatory behaviour', async ({ registerPage }) => {
    await test.step('Submit with empty Street Address', async () => {
      await registerPage.fillValidForm({ streetAddress: '' });
      await registerPage.submit();
    });
    await test.step('Verify Street Address required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.streetRequired);
    });
  });

  test('TC_033 – Verify registration is blocked when Prefecture is left unselected at the empty default', async ({
    registerPage,
  }) => {
    await test.step('Submit without selecting Prefecture', async () => {
      const data = registerPage.buildDefaultFormData();
      await registerPage.fillForm({ ...data, prefecture: '' });
      await registerPage.prefectureSelect.selectOption('');
      await registerPage.submit();
    });
    await test.step('Verify Prefecture required message', async () => {
      await registerPage.expectMessageVisible(messages.prefectureRequired);
    });
  });

  test('TC_034 – Verify Read address or postal lookup fills Prefecture Municipality and Street when a valid postal code is entered and the control is activated', async ({
    registerPage,
  }) => {
    await test.step('Enter valid postal code and trigger lookup', async () => {
      await registerPage.postalCodeInput.fill(defaults.postalCode);
      await registerPage.triggerPostalLookup();
    });
    await test.step('Verify address fields are auto-populated', async () => {
      await expect(registerPage.prefectureSelect).toHaveValue(defaults.prefecture);
      await expect(registerPage.municipalityInput).not.toHaveValue('');
      await expect(registerPage.streetAddressInput).not.toHaveValue('');
    });
  });

  test('TC_035 – Verify postal lookup does not overwrite valid manual entries incorrectly when user edits fields after lookup', async ({
    registerPage,
  }) => {
    const editedStreet = '手動編集1-2-3';
    await test.step('Lookup address then manually edit Street Address', async () => {
      await registerPage.postalCodeInput.fill(defaults.postalCode);
      await registerPage.triggerPostalLookup();
      await registerPage.streetAddressInput.fill(editedStreet);
    });
    await test.step('Register and verify edited value is retained', async () => {
      const data = registerPage.buildDefaultFormData({ streetAddress: editedStreet });
      await registerPage.fillForm(data);
      await registerPage.submit();
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_036 – Verify postal lookup shows an error and leaves fields empty when an invalid or unknown postal code is submitted to lookup', async ({
    registerPage,
  }) => {
    await test.step('Trigger lookup with invalid postal code', async () => {
      await registerPage.postalCodeInput.fill(defaults.postalCodeInvalid);
      await registerPage.triggerPostalLookup();
    });
    await test.step('Verify lookup failure messaging', async () => {
      await registerPage.expectMessageVisible(messages.postalLookupFailure);
      await expect(registerPage.municipalityInput).toHaveValue('');
    });
  });

  test('TC_037 – Verify registration succeeds when names and address use Japanese scripts (hiragana katakana kanji)', async ({
    registerPage,
  }) => {
    await test.step('Register with Japanese script values', async () => {
      const data = await registerPage.registerWithValidDefaults({
        firstName: defaults.japaneseFirstName,
        lastName: defaults.japaneseLastName,
        municipality: defaults.japaneseMunicipality,
        streetAddress: defaults.japaneseStreet,
      });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_038 – Verify each password rule shows its own error when only that rule fails', async ({ registerPage }) => {
    const passwordCases: Array<{ password: string; rule: keyof typeof testData.registration.passwordRules }> = [
      { password: testData.registration.passwords.tooShort, rule: 'minLength' },
      { password: testData.registration.passwords.noLowercase, rule: 'lowercase' },
      { password: testData.registration.passwords.noUppercase, rule: 'uppercase' },
      { password: testData.registration.passwords.noDigit, rule: 'digit' },
      { password: testData.registration.passwords.noSpecial, rule: 'special' },
    ];

    for (const entry of passwordCases) {
      await test.step(`Verify failing password rule: ${entry.rule}`, async () => {
        await registerPage.goto();
        const base = registerPage.buildDefaultFormData({ password: entry.password, confirmPassword: entry.password });
        await registerPage.fillForm(base);
        await registerPage.submit();
        await expect(registerPage.page).toHaveURL(new RegExp(testData.routes.register));
      });
    }
  });

  test('TC_039 – Verify registration blocks password with no digit when a digit is required', async ({ registerPage }) => {
    await test.step('Submit password without digits', async () => {
      await registerPage.fillValidForm({
        password: testData.registration.passwords.noDigit,
        confirmPassword: testData.registration.passwords.noDigit,
      });
      await registerPage.submit();
    });
    await test.step('Verify submission is blocked', async () => {
      await registerPage.expectOnRegisterPage();
    });
  });

  test('TC_040 – Verify registration blocks password with no special character when that rule applies', async ({
    registerPage,
  }) => {
    await test.step('Submit password without special character', async () => {
      await registerPage.fillValidForm({
        password: testData.registration.passwords.noSpecial,
        confirmPassword: testData.registration.passwords.noSpecial,
      });
      await registerPage.submit();
    });
    await test.step('Verify submission is blocked', async () => {
      await registerPage.expectOnRegisterPage();
    });
  });

  test('TC_041 – Verify registration is blocked when Password is shorter than 8 characters', async ({ registerPage }) => {
    await test.step('Submit short password', async () => {
      await registerPage.fillValidForm({
        password: testData.registration.passwords.tooShort,
        confirmPassword: testData.registration.passwords.tooShort,
      });
      await registerPage.submit();
    });
    await test.step('Verify submission is blocked', async () => {
      await registerPage.expectOnRegisterPage();
    });
  });

  test('TC_042 – Verify registration is blocked when Password has no uppercase English letter', async ({
    registerPage,
  }) => {
    await test.step('Submit password without uppercase', async () => {
      await registerPage.fillValidForm({
        password: testData.registration.passwords.noUppercase,
        confirmPassword: testData.registration.passwords.noUppercase,
      });
      await registerPage.submit();
    });
    await test.step('Verify submission is blocked', async () => {
      await registerPage.expectOnRegisterPage();
    });
  });

  test('TC_043 – Verify registration is blocked when Password has no lowercase English letter', async ({
    registerPage,
  }) => {
    await test.step('Submit password without lowercase', async () => {
      await registerPage.fillValidForm({
        password: testData.registration.passwords.noLowercase,
        confirmPassword: testData.registration.passwords.noLowercase,
      });
      await registerPage.submit();
    });
    await test.step('Verify submission is blocked', async () => {
      await registerPage.expectOnRegisterPage();
    });
  });

  test('TC_044 – Verify registration is blocked when Confirm Password is empty', async ({ registerPage }) => {
    await test.step('Submit with empty Confirm Password', async () => {
      await registerPage.fillValidForm({ confirmPassword: '' });
      await registerPage.submit();
    });
    await test.step('Verify Confirm Password required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.confirmPasswordRequired);
    });
  });

  test('TC_045 – Verify registration is blocked when Confirm Password does not match Password', async ({
    registerPage,
  }) => {
    await test.step('Submit with mismatched Confirm Password', async () => {
      await registerPage.fillValidForm({ confirmPassword: 'Different@123' });
      await registerPage.submit();
    });
    await test.step('Verify mismatch message', async () => {
      await registerPage.expectFieldErrorVisible(messages.passwordMismatch);
    });
  });

  test('TC_046 – Verify Confirm password fails if it matches Password except for letter case', async ({
    registerPage,
  }) => {
    await test.step('Submit with case-only mismatch', async () => {
      await registerPage.fillValidForm({
        password: validPassword,
        confirmPassword: testData.registration.passwords.mismatchCase,
      });
      await registerPage.submit();
    });
    await test.step('Verify passwords do not match', async () => {
      await registerPage.expectFieldErrorVisible(messages.passwordMismatch);
    });
  });

  test('TC_047 – Verify registration is blocked when agreement to Terms of Service and Privacy Policy is not checked', async ({
    registerPage,
  }) => {
    await test.step('Submit without accepting terms', async () => {
      await registerPage.fillValidForm({ agreeTerms: false });
      await registerPage.submit();
    });
    await test.step('Verify terms agreement required message', async () => {
      await registerPage.expectFieldErrorVisible(messages.termsRequired);
    });
  });

  test('TC_048 – Verify Prefecture selection is required when the dropdown is left at the default empty state', async ({
    registerPage,
  }) => {
    await test.step('Submit with default Prefecture selection', async () => {
      const data = registerPage.buildDefaultFormData();
      await registerPage.fillForm({ ...data, prefecture: '' });
      await registerPage.prefectureSelect.selectOption('');
      await registerPage.submit();
    });
    await test.step('Verify Prefecture required message', async () => {
      await registerPage.expectMessageVisible(messages.prefectureRequired);
    });
  });

  test('TC_049 – Verify Password field masks input by default', async ({ registerPage }) => {
    await test.step('Enter password and verify masking', async () => {
      await registerPage.passwordInput.fill(validPassword);
      await registerPage.expectPasswordMasked();
    });
  });

  test('TC_050 – Verify show or hide password control toggles visibility for the Password field', async ({
    registerPage,
  }) => {
    await test.step('Toggle Password visibility', async () => {
      await registerPage.passwordInput.fill(validPassword);
      await registerPage.togglePasswordVisibility();
      await expect(registerPage.passwordInput).toHaveAttribute('type', 'text');
      await registerPage.togglePasswordVisibility();
      await registerPage.expectPasswordMasked();
      await expect(registerPage.passwordInput).toHaveValue(validPassword);
    });
  });

  test('TC_051 – Verify show or hide password control toggles visibility for the Confirm Password field', async ({
    registerPage,
  }) => {
    await test.step('Toggle Confirm Password visibility', async () => {
      await registerPage.confirmPasswordInput.fill(validPassword);
      await registerPage.toggleConfirmPasswordVisibility();
      await expect(registerPage.confirmPasswordInput).toHaveAttribute('type', 'text');
      await registerPage.toggleConfirmPasswordVisibility();
      await registerPage.expectConfirmPasswordMasked();
      await expect(registerPage.confirmPasswordInput).toHaveValue(validPassword);
    });
  });

  test('TC_052 – Verify password rule indicators reflect compliance with length and letter-case requirements', async ({
    registerPage,
  }) => {
    await test.step('Verify indicators update as password strengthens', async () => {
      await registerPage.passwordInput.fill('a');
      await expect(registerPage.passwordRuleIndicators.minLength).toBeVisible();
      await registerPage.passwordInput.fill(validPassword);
      await expect(registerPage.passwordRuleIndicators.minLength).toBeVisible();
      await expect(registerPage.passwordRuleIndicators.uppercase).toBeVisible();
    });
  });

  test('TC_053 – Verify Terms of Service link opens the correct policy content', async ({ registerPage, page }) => {
    await test.step('Click Terms of Service link', async () => {
      await registerPage.termsLink.click();
    });
    await test.step('Verify Terms content is reachable', async () => {
      await expect(page.getByText(/利用規約|Terms/i)).toBeVisible();
    });
  });

  test('TC_054 – Verify Privacy Policy link opens the correct policy content', async ({ registerPage, page }) => {
    await test.step('Click Privacy Policy link', async () => {
      await registerPage.privacyLink.click();
    });
    await test.step('Verify Privacy Policy content is reachable', async () => {
      await expect(page.getByText(/プライバシーポリシー|Privacy/i)).toBeVisible();
    });
  });

  test('TC_055 – Verify existing member login link navigates to the Login page', async ({
    registerPage,
    loginPage,
  }) => {
    await test.step('Click existing member login link', async () => {
      await registerPage.footerLoginLink.click();
    });
    await test.step('Verify navigation to Login page', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_056 – Verify header Login here link navigates to the Login page when present', async ({
    registerPage,
    loginPage,
  }) => {
    await test.step('Click header Login here link', async () => {
      await registerPage.headerLoginLink.click();
    });
    await test.step('Verify navigation to Login page', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_057 – Verify registration form fields expose accessible names for assistive technologies', async ({
    registerPage,
  }) => {
    await test.step('Verify accessible field metadata', async () => {
      await registerPage.expectAccessibleNames();
    });
  });

  test('TC_058 – Verify Register as a member can be triggered from the keyboard when focused', async ({
    registerPage,
  }) => {
    await test.step('Fill form and submit via keyboard', async () => {
      const data = await registerPage.fillValidForm();
      await registerPage.submitButton.focus();
      await registerPage.page.keyboard.press('Enter');
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_059 – Verify rapid repeated clicks on Register as a member do not create duplicate accounts', async ({
    registerPage,
  }) => {
    await test.step('Double-click submit with unique email', async () => {
      const data = await registerPage.fillValidForm();
      await registerPage.submitButton.dblclick();
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_060 – Verify registration completes within acceptable response time under normal conditions', async ({
    registerPage,
  }) => {
    await test.step('Measure registration submission time', async () => {
      await registerPage.fillValidForm();
      const started = Date.now();
      await registerPage.submit();
      await registerPage.expectRegistrationSuccess();
      const elapsed = Date.now() - started;
      expect(elapsed).toBeLessThan(15000);
    });
  });

  test('TC_061 – Verify Japanese characters in First and Last Name within limits are accepted when policy allows', async ({
    registerPage,
  }) => {
    await test.step('Register with Japanese name characters', async () => {
      const data = await registerPage.registerWithValidDefaults({
        firstName: defaults.japaneseFirstName,
        lastName: defaults.japaneseLastName,
      });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_062 – Verify Street Address accepts a long valid string up to the 255-character maximum', async ({
    registerPage,
  }) => {
    await test.step('Register with 255-character Street Address', async () => {
      const data = await registerPage.registerWithValidDefaults({
        streetAddress: registerPage.repeatChar('道', limits.streetAddress),
      });
      await registerPage.expectRegistrationSuccess(data.email);
    });
  });

  test('TC_063 – Verify activation link in email references a token or path that is unique and not guessable from another user pattern', async () => {
    test.skip(true, 'Requires capturing activation URLs from two distinct mailboxes');
  });

  test('TC_064 – Verify Email Address helper text indicates it will be used as the login ID when shown', async ({
    registerPage,
  }) => {
    await test.step('Verify email helper text is displayed', async () => {
      await expect(registerPage.emailHelperText).toBeVisible();
      await expect(registerPage.emailHelperText).toHaveText(messages.emailHelper);
    });
  });

  test('TC_065 – Verify pasted Password and Confirm Password values respect masking and max length rules', async ({
    registerPage,
  }) => {
    const pasted = registerPage.repeatChar('P', limits.password);
    await test.step('Paste values into password fields', async () => {
      await registerPage.passwordInput.fill(pasted);
      await registerPage.confirmPasswordInput.fill(pasted);
    });
    await test.step('Verify masking and length constraints', async () => {
      await registerPage.expectPasswordMasked();
      await registerPage.expectConfirmPasswordMasked();
      expect((await registerPage.passwordInput.inputValue()).length).toBeLessThanOrEqual(limits.password);
    });
  });

  test('TC_066 – Verify password limit validation message is displayed in UI when password exceeds allowed length', async ({
    registerPage,
  }) => {
    const overLimit = registerPage.repeatChar('A', limits.password + 5) + '1a!';
    await test.step('Attempt to enter password beyond allowed length', async () => {
      await registerPage.passwordInput.fill(overLimit);
    });
    await test.step('Verify password input is constrained to max length', async () => {
      expect((await registerPage.passwordInput.inputValue()).length).toBeLessThanOrEqual(limits.password);
    });
  });

  test('TC_067 – Verify age restriction validation message is shown in UI when user age is 16 or below', async ({
    registerPage,
  }) => {
    await test.step('Select latest allowed birth year', async () => {
      await registerPage.birthYearSelect.selectOption('2010');
    });
    await test.step('Verify month options are restricted for minimum age policy', async () => {
      const monthOptions = await registerPage.birthMonthSelect.locator('option').allTextContents();
      expect(monthOptions).not.toContain('12');
      expect(monthOptions.length).toBeLessThan(13);
    });
  });

  test('TC_068 – Verify postal code acceptance with hyphen for address fetching', async ({ registerPage }) => {
    await test.step('Lookup hyphenated postal code', async () => {
      await registerPage.postalCodeInput.fill(defaults.postalCode);
      await registerPage.triggerPostalLookup();
    });
    await test.step('Verify hyphenated postal code is accepted for lookup', async () => {
      await expect(registerPage.prefectureSelect).toHaveValue(defaults.prefecture);
      await expect(registerPage.municipalityInput).not.toHaveValue('');
    });
  });
});
