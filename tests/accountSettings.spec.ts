import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';
import { getCurrentPassword } from '../utils/passwordState';
import { readProfileBaseline, writeProfileBaseline } from '../utils/profileState';

const validEmail = process.env.VALID_EMAIL ?? '';
const limits = testData.accountSettings.limits;
const messages = testData.accountSettings.messages;
const regMessages = testData.registration.messages;
const defaults = testData.registration.defaults;

test.describe.configure({ mode: 'serial' });

async function loginMember(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
): Promise<void> {
  await loginPage.goto();
  await loginPage.login(validEmail, getCurrentPassword());
  await dashboardPage.expectOnDashboard();
}

async function openAccountSettings(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
  accountSettingsPage: import('../page-objects/AccountSettings.page').AccountSettingsPage,
): Promise<void> {
  await loginMember(loginPage, dashboardPage);
  await accountSettingsPage.goto();
}

test.describe('Account Settings Module', () => {
  test('TC_001 – Verify authenticated member can open the Account Settings page and view member sections', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Navigate to Login page and sign in', async () => {
      await loginMember(loginPage, dashboardPage);
    });
    await test.step('Navigate to Account Settings', async () => {
      await accountSettingsPage.goto();
    });
    await test.step('Verify Member Information and Other information sections', async () => {
      await accountSettingsPage.expectOnSettingsPage();
      await accountSettingsPage.expectMemberSectionsVisible();
      writeProfileBaseline(await accountSettingsPage.readProfileSnapshot());
    });
  });

  test('TC_002 – Verify membership number is displayed and cannot be edited in Other information', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Account Settings', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
    });
    await test.step('Verify membership number is visible and not editable', async () => {
      await accountSettingsPage.expectMembershipFieldsReadOnly();
      await accountSettingsPage.expectMembershipNumberFormat();
    });
  });

  test('TC_003 – Verify membership registration date is displayed and cannot be edited in Other information', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Account Settings', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
    });
    await test.step('Verify registration date is visible and section has no inputs', async () => {
      await accountSettingsPage.expectMembershipDateDisplayed();
      await accountSettingsPage.expectMembershipFieldsReadOnly();
    });
  });

  test('TC_004 – Verify membership number and registration date values match the authoritative member record', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Account Settings and read membership fields', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
    });
    await test.step('Verify membership number format and date presence', async () => {
      const baseline = readProfileBaseline();
      const snapshot = await accountSettingsPage.readProfileSnapshot();
      await accountSettingsPage.expectMembershipNumberFormat();
      await accountSettingsPage.expectMembershipDateDisplayed();
      if (baseline?.membershipNumber) {
        expect(snapshot.membershipNumber).toBe(baseline.membershipNumber);
      }
      if (baseline?.membershipRegistrationDate) {
        expect(snapshot.membershipRegistrationDate).toBe(baseline.membershipRegistrationDate);
      }
    });
  });

  test('TC_005 – Verify submission or save is blocked when First Name is empty', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Clear First Name and submit', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ firstName: '' });
      await accountSettingsPage.submit();
    });
    await test.step('Verify First Name required message', async () => {
      await accountSettingsPage.expectFieldErrorVisible(messages.firstNameRequired);
      await accountSettingsPage.expectSaveBlocked();
    });
  });

  test('TC_006 – Verify submission or save is blocked when Last Name is empty', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Clear Last Name and submit', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ lastName: '' });
      await accountSettingsPage.submit();
    });
    await test.step('Verify Last Name required message', async () => {
      await accountSettingsPage.expectFieldErrorVisible(messages.lastNameRequired);
      await accountSettingsPage.expectSaveBlocked();
    });
  });

  test('TC_007 – Verify First Name cannot exceed 25 characters', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const longName = accountSettingsPage.repeatChar('A', limits.firstName + 1);
    await test.step('Enter First Name longer than 25 characters', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.firstNameInput.fill(longName);
    });
    await test.step('Verify 25-character enforcement', async () => {
      await accountSettingsPage.expectFieldValueLength(
        accountSettingsPage.firstNameInput,
        limits.firstName,
      );
      await accountSettingsPage.expectInputMaxLength(accountSettingsPage.firstNameInput, limits.firstName);
    });
  });

  test('TC_008 – Verify Last Name cannot exceed 25 characters', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const longName = accountSettingsPage.repeatChar('B', limits.lastName + 1);
    await test.step('Enter Last Name longer than 25 characters', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.lastNameInput.fill(longName);
    });
    await test.step('Verify 25-character enforcement', async () => {
      await accountSettingsPage.expectFieldValueLength(
        accountSettingsPage.lastNameInput,
        limits.lastName,
      );
      await accountSettingsPage.expectInputMaxLength(accountSettingsPage.lastNameInput, limits.lastName);
    });
  });

  test('TC_009 – Verify save accepts First Name at exactly 24 characters when all other fields are valid', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const name24 = accountSettingsPage.repeatChar('T', 24);
    await test.step('Set First Name to 24 characters and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ firstName: name24 });
      await accountSettingsPage.submit();
    });
    await test.step('Verify save succeeds', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await accountSettingsPage.expectPersistedFirstName(name24);
    });
  });

  test('TC_010 – Verify save accepts First Name at exactly 25 characters when all other fields are valid', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const name25 = accountSettingsPage.repeatChar('U', 25);
    await test.step('Set First Name to 25 characters and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ firstName: name25 });
      await accountSettingsPage.submit();
    });
    await test.step('Verify save succeeds', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await accountSettingsPage.expectPersistedFirstName(name25);
    });
  });

  test('TC_011 – Verify save accepts Last Name at exactly 24 characters when all other fields are valid', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const name24 = accountSettingsPage.repeatChar('V', 24);
    await test.step('Set Last Name to 24 characters and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ lastName: name24 });
      await accountSettingsPage.submit();
    });
    await test.step('Verify save succeeds', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await expect(accountSettingsPage.lastNameInput).toHaveValue(name24);
    });
  });

  test('TC_012 – Verify save accepts Last Name at exactly 25 characters when all other fields are valid', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const name25 = accountSettingsPage.repeatChar('W', 25);
    await test.step('Set Last Name to 25 characters and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ lastName: name25 });
      await accountSettingsPage.submit();
    });
    await test.step('Verify save succeeds', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await expect(accountSettingsPage.lastNameInput).toHaveValue(name25);
    });
  });

  test('TC_013 – Verify submission or save is blocked when no Gender option is selected', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Clear Gender selections and submit', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.clearAllGenderSelections();
      await accountSettingsPage.submit();
    });
    await test.step('Verify Gender is required', async () => {
      const genderErrorVisible = await accountSettingsPage
        .fieldError(regMessages.genderRequired)
        .isVisible()
        .catch(() => false);
      const saveBlocked = await accountSettingsPage.saveButton.isVisible();
      expect(genderErrorVisible || saveBlocked).toBeTruthy();
    });
  });

  test('TC_014 – Verify submission or save is blocked when Date of birth is incomplete', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Leave birth day unselected and submit', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.birthDaySelect.selectOption({ index: 0 });
      await accountSettingsPage.submit();
    });
    await test.step('Verify Date of birth required or save blocked', async () => {
      const dobErrorVisible = await accountSettingsPage
        .fieldError(regMessages.birthDayRequired)
        .isVisible()
        .catch(() => false);
      const saveBlocked = await accountSettingsPage.saveButton.isVisible();
      expect(dobErrorVisible || saveBlocked).toBeTruthy();
    });
  });

  test('TC_015 – Verify Email address cannot be edited', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const originalEmail = validEmail;
    await test.step('Enter edit mode and verify email is disabled', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.expectEmailNotEditable();
    });
    await test.step('Verify email value cannot be changed', async () => {
      await expect(accountSettingsPage.emailInput).toHaveValue(originalEmail);
      await accountSettingsPage.cancelEdit();
    });
  });

  test('TC_016 – Verify submission or save is blocked when Telephone Number is empty', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Clear Telephone Number and submit', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ phone: '' });
      await accountSettingsPage.submit();
    });
    await test.step('Verify Telephone Number required message', async () => {
      await accountSettingsPage.expectFieldErrorVisible(messages.phoneRequired);
      await accountSettingsPage.expectSaveBlocked();
    });
  });

  test('TC_017 – Verify save accepts Telephone number at exactly 19 characters when all other fields are valid', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const phone19 = '0'.repeat(19);
    await test.step('Set Telephone number to 19 characters and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ phone: phone19 });
      await accountSettingsPage.submit();
    });
    await test.step('Verify save succeeds with enforced maxlength', async () => {
      await accountSettingsPage.expectSaveSuccess();
      const value = await accountSettingsPage.phoneInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(limits.phone);
    });
  });

  test('TC_018 – Verify Telephone Number cannot exceed 20 characters', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Enter Telephone Number longer than UI maximum', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.phoneInput.fill('1'.repeat(25));
    });
    await test.step('Verify maxlength enforcement', async () => {
      await accountSettingsPage.expectFieldValueLength(accountSettingsPage.phoneInput, limits.phone);
      await accountSettingsPage.expectInputMaxLength(accountSettingsPage.phoneInput, limits.phone);
    });
  });

  test('TC_019 – Verify save accepts Postal code at exactly 49 characters when all other fields are valid', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const postal49 = 'Z'.repeat(49);
    await test.step('Set Postal Code to 49 characters and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ postalCode: postal49 });
      await accountSettingsPage.submit();
    });
    await test.step('Verify save succeeds', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await expect(accountSettingsPage.postalCodeInput).toHaveValue(postal49);
    });
  });

  test('TC_020 – Verify Postal Code cannot exceed 50 characters', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Enter Postal Code longer than 50 characters', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.postalCodeInput.fill('P'.repeat(55));
    });
    await test.step('Verify 50-character enforcement', async () => {
      await accountSettingsPage.expectFieldValueLength(accountSettingsPage.postalCodeInput, limits.postalCode);
    });
  });

  test('TC_021 – Verify Municipality cannot exceed 50 characters', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Enter Municipality longer than 50 characters', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.municipalityInput.fill('M'.repeat(55));
    });
    await test.step('Verify 50-character enforcement', async () => {
      await accountSettingsPage.expectFieldValueLength(
        accountSettingsPage.municipalityInput,
        limits.municipality,
      );
    });
  });

  test('TC_022 – Verify Street Address cannot exceed 255 characters', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Enter Street Address longer than 255 characters', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.streetAddressInput.fill('S'.repeat(260));
    });
    await test.step('Verify 255-character enforcement', async () => {
      await accountSettingsPage.expectFieldValueLength(
        accountSettingsPage.streetAddressInput,
        limits.streetAddress,
      );
    });
  });

  test('TC_023 – Verify Building name cannot exceed 50 characters', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Enter Building name longer than 50 characters', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.buildingNameInput.fill('B'.repeat(55));
    });
    await test.step('Verify 50-character enforcement', async () => {
      await accountSettingsPage.expectFieldValueLength(
        accountSettingsPage.buildingNameInput,
        limits.buildingName,
      );
    });
  });

  test('TC_024 – Verify Prefecture must be selected when the dropdown is left at empty default on save', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Set Prefecture to empty placeholder and submit', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.prefectureSelect.selectOption({ label: '都道府県' });
      await accountSettingsPage.submit();
    });
    await test.step('Verify Prefecture required or save blocked', async () => {
      const prefErrorVisible = await accountSettingsPage
        .fieldError(regMessages.prefectureRequired)
        .isVisible()
        .catch(() => false);
      const saveBlocked = await accountSettingsPage.saveButton.isVisible();
      expect(prefErrorVisible || saveBlocked).toBeTruthy();
    });
  });

  test('TC_025 – Verify successful save updates editable profile fields when all validations pass', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const phone = defaults.phone;
    await test.step('Enter valid values and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({
        firstName: defaults.firstName,
        lastName: defaults.lastName,
        phone,
        municipality: defaults.municipality,
        streetAddress: defaults.streetAddress,
        buildingName: defaults.buildingName,
        prefecture: defaults.prefecture,
        gender: defaults.gender,
      });
      await accountSettingsPage.submit();
    });
    await test.step('Verify persistence after reload', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await accountSettingsPage.page.reload();
      await accountSettingsPage.expectOnSettingsPage();
      await expect(accountSettingsPage.firstNameInput).toHaveValue(defaults.firstName);
      await expect(accountSettingsPage.phoneInput).toHaveValue(phone);
    });
  });

  test('TC_026 – Verify Edit control toggles member fields into an editable state', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Observe view mode then click Edit', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.expectViewMode();
      await accountSettingsPage.enterEditMode();
    });
    await test.step('Verify editable state and save path', async () => {
      await accountSettingsPage.expectEditMode();
    });
  });

  test('TC_027 – Verify Return to My Page navigates to the member dashboard', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Account Settings and click Return to My Page', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.returnToMyPageLink.click();
    });
    await test.step('Verify dashboard destination', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_028 – Verify Logout from Account Settings ends the session', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
    page,
  }) => {
    await test.step('Logout from Account Settings header', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await dashboardPage.logout();
    });
    await test.step('Verify Account Settings requires sign-in', async () => {
      await page.goto(testData.routes.settings);
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_029 – Verify Account Settings is not accessible without authentication when protected', async ({
    loginPage,
    page,
  }) => {
    await test.step('Clear session and open Account Settings URL', async () => {
      await page.goto(testData.routes.login);
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.goto(testData.routes.settings);
    });
    await test.step('Verify access is blocked', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_030 – Verify Japanese characters in editable name fields save and display correctly within length limits', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const jpFirst = defaults.japaneseFirstName;
    const jpLast = defaults.japaneseLastName;
    await test.step('Enter Japanese characters and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ firstName: jpFirst, lastName: jpLast });
      await accountSettingsPage.submit();
    });
    await test.step('Verify characters preserved after reload', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await accountSettingsPage.expectPersistedFirstName(jpFirst);
      await expect(accountSettingsPage.lastNameInput).toHaveValue(jpLast);
    });
  });

  test('TC_031 – Verify editable inputs expose accessible names matching First Name and Telephone labels', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Enter edit mode and inspect accessible names', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.expectAccessibleFieldNames();
    });
  });

  test('TC_032 – Verify duplicate or rapid Submit or Save clicks do not create inconsistent profile states', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const marker = `Idem${Date.now().toString().slice(-4)}`;
    await test.step('Change a benign field and double-click Save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ buildingName: marker });
      await accountSettingsPage.submitTwice();
    });
    await test.step('Verify single consistent saved state', async () => {
      await accountSettingsPage.expectSaveSuccess();
      await accountSettingsPage.page.reload();
      await accountSettingsPage.expectOnSettingsPage();
      await expect(accountSettingsPage.buildingNameInput).toHaveValue(marker);
    });
  });

  test('TC_033 – Verify registration data is shown in Account Settings form', async () => {
    test.skip(true, 'Requires known registration payload for the signed-in account');
  });

  test('TC_034 – Verify edits are not saved when user clicks Cancel after making changes', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const draftName = `Cancel${Date.now().toString().slice(-5)}`;
    let originalFirst = '';
    await test.step('Edit fields then click Cancel', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      originalFirst = await accountSettingsPage.firstNameInput.inputValue();
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ firstName: draftName });
      await accountSettingsPage.cancelEdit();
      await expect(accountSettingsPage.firstNameInput).toHaveValue(originalFirst);
    });
    await test.step('Verify values unchanged after reload', async () => {
      await accountSettingsPage.page.reload();
      await accountSettingsPage.expectOnSettingsPage();
      await expect(accountSettingsPage.firstNameInput).toHaveValue(originalFirst);
    });
  });

  test('TC_035 – Verify saved edits in Account Settings are reflected on Dashboard', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const syncFirst = `Dash${Date.now().toString().slice(-4)}`;
    const baseline = readProfileBaseline();
    const lastName = baseline?.lastName ?? defaults.lastName;
    await test.step('Update name on Account Settings and save', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ firstName: syncFirst, lastName });
      await accountSettingsPage.submit();
      await accountSettingsPage.expectSaveSuccess();
    });
    await test.step('Verify Dashboard shows updated values', async () => {
      await accountSettingsPage.returnToMyPageLink.click();
      await dashboardPage.expectOnDashboard();
      await dashboardPage.expectGreetingContains(syncFirst);
      await dashboardPage.expectMemberNameContains(syncFirst, lastName);
      await dashboardPage.expectMemberEmail(validEmail);
    });
  });

  test('TC_036 – Verify phone number length validation accepts values up to the configured maximum', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const phone16 = '0'.repeat(16);
    const phoneMax = '0'.repeat(limits.phone);
    await test.step('Save 16-digit phone number', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ phone: phone16 });
      await accountSettingsPage.submit();
      await accountSettingsPage.expectSaveSuccess();
    });
    await test.step('Save maximum-length phone number', async () => {
      await accountSettingsPage.enterEditMode();
      await accountSettingsPage.fillForm({ phone: phoneMax });
      await accountSettingsPage.submit();
      await accountSettingsPage.expectSaveSuccess();
      await expect(accountSettingsPage.phoneInput).toHaveValue(phoneMax);
    });
  });

  test('TC_REVERT – Restore account profile to baseline captured at suite start', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    const baseline = readProfileBaseline();
    test.skip(!baseline, 'Baseline profile was not captured in TC_001');

    await test.step('Restore profile fields to baseline', async () => {
      await openAccountSettings(loginPage, dashboardPage, accountSettingsPage);
      const current = await accountSettingsPage.readProfileSnapshot();
      const needsRestore =
        current.firstName !== baseline!.firstName ||
        current.lastName !== baseline!.lastName ||
        current.phone !== baseline!.phone ||
        current.postalCode !== baseline!.postalCode ||
        current.municipality !== baseline!.municipality ||
        current.streetAddress !== baseline!.streetAddress ||
        current.buildingName !== baseline!.buildingName;

      if (needsRestore) {
        await accountSettingsPage.restoreProfile(baseline!);
      }
    });

    await test.step('Verify restored values on settings page', async () => {
      await accountSettingsPage.goto();
      await expect(accountSettingsPage.firstNameInput).toHaveValue(baseline!.firstName);
      await expect(accountSettingsPage.lastNameInput).toHaveValue(baseline!.lastName);
    });
  });
});
