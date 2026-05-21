import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';
import { getCurrentPassword } from '../utils/passwordState';
import type { ProfileSnapshot } from '../page-objects/AccountSettings.page';

const validEmail = process.env.VALID_EMAIL ?? '';

test.describe.configure({ mode: 'serial' });

let memberRecord: ProfileSnapshot | null = null;

async function loginMember(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
): Promise<void> {
  await loginPage.goto();
  await loginPage.login(validEmail, getCurrentPassword());
  await dashboardPage.expectOnDashboard();
}

async function loadMemberRecord(
  accountSettingsPage: import('../page-objects/AccountSettings.page').AccountSettingsPage,
): Promise<ProfileSnapshot> {
  if (!memberRecord) {
    await accountSettingsPage.goto();
    memberRecord = await accountSettingsPage.readProfileSnapshot();
  }
  return memberRecord;
}

test.describe('Dashboard Module', () => {
  test('TC_001 – Verify authenticated member can open the Dashboard page successfully', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Navigate to Login page and sign in', async () => {
      await loginMember(loginPage, dashboardPage);
    });
    await test.step('Verify Dashboard layout loads without authentication errors', async () => {
      await dashboardPage.expectLayoutLoaded();
    });
  });

  test('TC_002 – Verify membership number is displayed on the Dashboard', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Dashboard and read membership number', async () => {
      await loginMember(loginPage, dashboardPage);
      await dashboardPage.expectMembershipNumberDisplayed();
    });
    await test.step('Compare with authoritative member record from Account Settings', async () => {
      const record = await loadMemberRecord(accountSettingsPage);
      await dashboardPage.goto();
      await dashboardPage.expectMembershipNumberEquals(record.membershipNumber);
    });
  });

  test('TC_003 – Verify membership registration date is displayed in the member information area', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Dashboard and read registration date', async () => {
      await loginMember(loginPage, dashboardPage);
      await dashboardPage.expectMemberRegistrationDateDisplayed();
    });
    await test.step('Compare with member record from Account Settings', async () => {
      const record = await loadMemberRecord(accountSettingsPage);
      await dashboardPage.goto();
      await dashboardPage.expectRegistrationDateMatchesSettingsDate(record.membershipRegistrationDate);
    });
  });

  test('TC_004 – Verify member fullname appears in the greeting section', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Dashboard and read greeting', async () => {
      await loginMember(loginPage, dashboardPage);
    });
    await test.step('Verify greeting uses registered first and last name', async () => {
      const record = await loadMemberRecord(accountSettingsPage);
      await dashboardPage.goto();
      await dashboardPage.expectGreetingFullName(record.firstName, record.lastName);
    });
  });

  test('TC_005 – Verify member name appears in the member information panel', async ({
    loginPage,
    dashboardPage,
    accountSettingsPage,
  }) => {
    await test.step('Open Dashboard member information panel', async () => {
      await loginMember(loginPage, dashboardPage);
      await expect(dashboardPage.memberInfoSection).toBeVisible();
    });
    await test.step('Verify name matches signed-in account profile', async () => {
      const record = await loadMemberRecord(accountSettingsPage);
      await dashboardPage.goto();
      await dashboardPage.expectMemberNameFullName(record.firstName, record.lastName);
    });
  });

  test('TC_006 – Verify registered email address is displayed in the member information panel', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Open Dashboard and locate member information panel', async () => {
      await loginMember(loginPage, dashboardPage);
      await expect(dashboardPage.memberInfoSection).toBeVisible();
    });
    await test.step('Verify registered email is displayed', async () => {
      await dashboardPage.expectMemberEmail(validEmail);
    });
  });

  test('TC_007 – Verify Vehicle Registration card navigates to the vehicle registration flow or page', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Click Vehicle Registration card on Dashboard', async () => {
      await loginMember(loginPage, dashboardPage);
      await dashboardPage.clickVehicleRegistrationCard();
    });
    await test.step('Verify vehicle registration destination', async () => {
      await dashboardPage.expectOnVehicleRegistrationPage();
    });
  });

  test('TC_008 – Verify Inquiry card navigates to the enquiry or contact flow', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Return to Dashboard and click Inquiry card', async () => {
      await loginMember(loginPage, dashboardPage);
      await dashboardPage.clickInquiryCard();
    });
    await test.step('Verify enquiry destination', async () => {
      await dashboardPage.expectOnInquiryPage();
    });
  });

  test('TC_009 – Verify Account Settings card navigates to account settings', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Return to Dashboard and click Account Settings card', async () => {
      await loginMember(loginPage, dashboardPage);
      await dashboardPage.clickAccountSettingsCard();
    });
    await test.step('Verify account settings destination', async () => {
      await dashboardPage.expectOnAccountSettingsPage();
    });
  });

  test('TC_010 – Verify Account Settings button in the member information panel navigates to account settings', async ({
    loginPage,
    dashboardPage,
  }) => {
    await test.step('Return to Dashboard and click Account Settings in member panel', async () => {
      await loginMember(loginPage, dashboardPage);
      await dashboardPage.clickMemberPanelAccountSettingsLink();
    });
    await test.step('Verify account settings destination', async () => {
      await dashboardPage.expectOnAccountSettingsPage();
    });
  });

  test('TC_011 – Verify Dashboard is not accessible without authentication when a session is absent', async ({
    loginPage,
    page,
  }) => {
    await test.step('Clear session and open Dashboard URL directly', async () => {
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
});
