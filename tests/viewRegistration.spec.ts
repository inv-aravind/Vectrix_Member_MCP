import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';
import { getCurrentPassword } from '../utils/passwordState';

const validEmail = process.env.VALID_EMAIL ?? '';
const noVehicleEmail = process.env.NO_VEHICLE_EMAIL ?? 'reacharavindh.s14+999@gmail.com';
const noVehiclePassword = process.env.NO_VEHICLE_PASSWORD ?? 'Password@123';
const ownership = testData.viewRegistration.ownership;
const fields = testData.viewRegistration.fields;

test.describe.configure({ mode: 'serial' });

async function loginAs(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
  email: string,
  password: string,
): Promise<void> {
  await loginPage.goto();
  await loginPage.login(email, password);
  await dashboardPage.expectOnDashboard();
}

async function openRegisteredVehicles(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
  viewRegistrationPage: import('../page-objects/ViewRegistration.page').ViewRegistrationPage,
  email = validEmail,
  password?: string,
): Promise<void> {
  await loginAs(loginPage, dashboardPage, email, password ?? getCurrentPassword());
  await viewRegistrationPage.goto();
  await viewRegistrationPage.openRegisteredVehiclesTab();
}

async function clearSession(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(testData.routes.login);
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

test.describe('View Registration Module', () => {
  test('TC_001 – Verify authenticated member can open the Registered vehicles tab and load the vehicle list area', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Sign in and open vehicle registration', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
    });
    await test.step('Verify registered vehicles list is displayed', async () => {
      await viewRegistrationPage.expectRegisteredTabActive();
      await viewRegistrationPage.expectAtLeastOneVehicleCard();
    });
  });

  test('TC_002 – Verify vehicle serial number is displayed for each vehicle in the registered list', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Open Registered vehicles tab', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
    });
    await test.step('Verify serial number on every vehicle card', async () => {
      const count = await viewRegistrationPage.vehicleCards.count();
      for (let i = 0; i < count; i += 1) {
        const serial = viewRegistrationPage.cardFieldValue(
          viewRegistrationPage.vehicleCards.nth(i),
          fields.serialNumber,
        );
        await expect(serial).not.toHaveText('');
      }
    });
  });

  test('TC_003 – Verify purchase date or delivery date is displayed for each registered vehicle', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Open Registered vehicles tab', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
    });
    await test.step('Verify purchase or delivery date on each card', async () => {
      const count = await viewRegistrationPage.vehicleCards.count();
      for (let i = 0; i < count; i += 1) {
        const date = viewRegistrationPage.cardFieldValue(
          viewRegistrationPage.vehicleCards.nth(i),
          fields.purchaseDate,
        );
        await expect(date).not.toHaveText('');
      }
    });
  });

  test('TC_004 – Verify warranty period end date is displayed for each registered vehicle', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Open Registered vehicles tab', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
    });
    await test.step('Verify warranty period field on each card', async () => {
      await viewRegistrationPage.expectAllCardsShowSerialPurchaseAndWarranty();
    });
  });

  test('TC_005 – Verify the vehicle card shows Current owner for the member who most recently registered that vehicle as sole owner', async () => {
    test.skip(true, 'Requires completing a fresh sole-owner registration flow in test data');
  });

  test('TC_006 – Verify the vehicle card shows Previous owner for the prior registrant after another member becomes the current owner', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Open Registered vehicles as prior registrant', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
    });
    await test.step('Verify Previous owner badge and not Current owner', async () => {
      const card = viewRegistrationPage.vehicleCards.first();
      await expect(card.getByText(ownership.previousOwner, { exact: true })).toBeVisible();
      await expect(card.getByText(ownership.currentOwner, { exact: true })).toHaveCount(0);
    });
  });

  test('TC_007 – Verify the vehicle card shows Current owner for the member who holds current ownership after transfer', async () => {
    test.skip(true, 'Requires a dedicated current-owner test account (User B) in environment data');
  });

  test('TC_008 – Verify Current owner and Previous owner badges are not both shown on the same vehicle card for one ownership record', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Inspect ownership badges on listed vehicles', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectSingleOwnershipBadgePerCard();
    });
  });

  test('TC_009 – Verify ownership badge wording matches product labels for Current owner and Previous owner', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Compare badge text to specification labels', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectOwnershipBadgeLabelsValid();
    });
  });

  test('TC_010 – Verify warranty extension callout text is visible on the registered vehicles view', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Open Registered vehicles and read warranty callout', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectWarrantyCalloutVisible();
    });
  });

  test('TC_011 – Verify switching to the New registration tab shows the new registration content', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Switch to New registration tab', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.openNewRegistrationTab();
    });
    await test.step('Verify new registration workflow content', async () => {
      await viewRegistrationPage.expectNewRegistrationTabActive();
      await viewRegistrationPage.expectNewRegistrationContent();
    });
  });

  test('TC_012 – Verify switching back to the Registered vehicles tab restores the registered vehicle list', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    let serialBefore = '';
    await test.step('Capture registered list then switch tabs', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      serialBefore = (await viewRegistrationPage.captureRegisteredSerialNumbers())[0] ?? '';
      await viewRegistrationPage.openNewRegistrationTab();
      await viewRegistrationPage.openRegisteredVehiclesTab();
    });
    await test.step('Verify registered entries restored', async () => {
      await viewRegistrationPage.expectRegisteredTabActive();
      await viewRegistrationPage.expectAtLeastOneVehicleCard();
      if (serialBefore) {
        await expect(
          viewRegistrationPage.cardFieldValue(viewRegistrationPage.vehicleCards.first(), fields.serialNumber),
        ).toHaveText(serialBefore);
      }
    });
  });

  test('TC_013 – Verify Return to My Page navigates back to the member My page or dashboard destination', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Click Return to My Page', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.returnToMyPageLink.click();
    });
    await test.step('Verify dashboard destination', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_014 – Verify Register a new vehicle entry navigates to new vehicle registration flow', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Click Register a new vehicle control', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.clickRegisterNewVehicle();
    });
    await test.step('Verify new registration content is shown', async () => {
      await viewRegistrationPage.expectNewRegistrationTabActive();
      await viewRegistrationPage.expectNewRegistrationContent();
    });
  });

  test('TC_015 – Verify registered vehicles list is empty or shows an appropriate empty state when the member has no registrations', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Sign in with zero-vehicle account and open Registered vehicles', async () => {
      await openRegisteredVehicles(
        loginPage,
        dashboardPage,
        viewRegistrationPage,
        noVehicleEmail,
        noVehiclePassword,
      );
    });
    await test.step('Verify empty-state messaging', async () => {
      await viewRegistrationPage.expectEmptyRegisteredList();
    });
  });

  test('TC_016 – Verify multiple registered vehicles appear as separate list entries when the member has several registrations', async () => {
    test.skip(true, 'Requires a member account with two or more registered vehicles in test data');
  });

  test('TC_017 – Verify the Registered vehicles page is not accessible without authentication when no session exists', async ({
    loginPage,
    page,
  }) => {
    await test.step('Clear session and open vehicle registration URL', async () => {
      await clearSession(page);
      await page.goto(testData.routes.protectedVehicle);
    });
    await test.step('Verify access is blocked', async () => {
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_018 – Verify another member vehicle registrations never appear in the signed-in user list', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
    page,
  }) => {
    let memberASerials: string[] = [];
    await test.step('Capture member A registered serial numbers', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      memberASerials = await viewRegistrationPage.captureRegisteredSerialNumbers();
    });
    await test.step('Sign in as member B and compare lists', async () => {
      await clearSession(page);
      await openRegisteredVehicles(
        loginPage,
        dashboardPage,
        viewRegistrationPage,
        noVehicleEmail,
        noVehiclePassword,
      );
      const memberBSerials = await viewRegistrationPage.captureRegisteredSerialNumbers();
      for (const serial of memberASerials) {
        expect(memberBSerials).not.toContain(serial);
      }
    });
  });

  test('TC_019 – Verify two-year warranty badge or label appears when the registration qualifies under the thirty-day extension rule', async () => {
    test.skip(true, 'Requires documented within-thirty-day registration test vehicle data');
  });

  test('TC_020 – Verify warranty presentation reflects standard coverage when registration is outside the thirty-day extension window', async () => {
    test.skip(true, 'Requires documented outside-thirty-day registration test vehicle data');
  });

  test('TC_021 – Verify displayed warranty period is consistent with the delivery date and configured warranty rules', async () => {
    test.skip(true, 'Requires authoritative expected warranty end dates for test vehicles');
  });

  test('TC_022 – Verify purchase date and warranty period use the intended date format and locale', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Read purchase date formatting on registered vehicles', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectPurchaseDatesFormatted();
    });
  });

  test('TC_023 – Verify browser refresh on the Registered vehicles tab reloads the list without losing authentication', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Refresh Registered vehicles tab', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.page.reload();
    });
    await test.step('Verify session and list remain intact', async () => {
      await viewRegistrationPage.expectOnVehicleRegistrationPage();
      await viewRegistrationPage.expectRegisteredTabActive();
      await viewRegistrationPage.expectAtLeastOneVehicleCard();
    });
  });

  test('TC_024 – Verify direct URL navigation to the registered vehicles view works for a signed-in session', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Navigate directly while signed in', async () => {
      await loginAs(loginPage, dashboardPage, validEmail, getCurrentPassword());
      await viewRegistrationPage.goto();
    });
    await test.step('Verify registered vehicles content', async () => {
      await viewRegistrationPage.expectRegisteredTabActive();
      await viewRegistrationPage.expectAtLeastOneVehicleCard();
    });
  });

  test('TC_025 – Verify keyboard user can move focus between tabs and primary actions', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Tab through primary controls', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.tabUntilFocused(viewRegistrationPage.newRegistrationTab);
      await viewRegistrationPage.page.keyboard.press('Enter');
      await viewRegistrationPage.expectNewRegistrationTabActive();
      await viewRegistrationPage.openRegisteredVehiclesTab();
      await viewRegistrationPage.tabUntilFocused(viewRegistrationPage.returnToMyPageLink);
      await viewRegistrationPage.tabUntilFocused(viewRegistrationPage.registerNewVehicleButton);
    });
  });

  test('TC_026 – Verify direct URL navigation to the registered vehicles view works for a signed-in session', async () => {
    test.skip(true, 'Duplicate of TC_024; backend/API comparison requires permitted server tools');
  });

  test('TC_027 – Verify vehicle brand and model labels are displayed on each registered vehicle card', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Read brand and model on each entry', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectBrandAndModelOnAllCards();
    });
  });

  test('TC_028 – Verify status badges such as current owner and extended warranty appear according to registration data', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Observe ownership badges on listed vehicles', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectOwnershipBadgeLabelsValid();
    });
  });

  test('TC_029 – Verify page title and subtitle for vehicle owner registration are displayed', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Read page title and subtitle', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectPageHeaderVisible();
    });
  });

  test('TC_030 – Verify MOBIPARK header and primary navigation remain available on the registered vehicles view', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Observe global header controls', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectGlobalHeaderVisible();
    });
  });

  test('TC_031 – Verify Japanese labels for global header and navigation render correctly on the registered vehicles view', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Read Japanese navigation labels', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectJapaneseNavigationLabels();
    });
  });

  test('TC_032 – Verify vehicle list layout remains usable at a narrow viewport width', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
    page,
  }) => {
    await test.step('Resize to mobile width and inspect cards', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await page.setViewportSize({ width: 390, height: 844 });
      await viewRegistrationPage.expectAtLeastOneVehicleCard();
      const serial = viewRegistrationPage.cardFieldValue(
        viewRegistrationPage.vehicleCards.first(),
        fields.serialNumber,
      );
      await expect(serial).toBeVisible();
    });
  });

  test('TC_033 – Verify very long brand or model names wrap or truncate without breaking the card layout', async () => {
    test.skip(true, 'Requires a test vehicle record with long brand or model text');
  });

  test('TC_034 – Verify stored vehicle text fields containing angle brackets or script-like content are not executed in the browser', async () => {
    test.skip(true, 'Requires approved security test vehicle record per policy');
  });

  test('TC_035 – Verify vehicle thumbnail or placeholder image loads without broken image icons', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Observe image area on vehicle cards', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectVehicleImagesOrPlaceholders();
    });
  });

  test('TC_036 – Verify switching member context after viewing vehicles updates the list to the new member data', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
    page,
  }) => {
    let memberASerials: string[] = [];
    await test.step('View vehicles as member A', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      await viewRegistrationPage.expectAtLeastOneVehicleCard();
      memberASerials = await viewRegistrationPage.captureRegisteredSerialNumbers();
      expect(memberASerials.length).toBeGreaterThan(0);
    });
    await test.step('Switch to member B and verify isolated list', async () => {
      await clearSession(page);
      await openRegisteredVehicles(
        loginPage,
        dashboardPage,
        viewRegistrationPage,
        noVehicleEmail,
        noVehiclePassword,
      );
      await viewRegistrationPage.expectEmptyRegisteredList();
    });
  });

  test('TC_037 – Verify vehicle details shown in the UI match the Mobipark main site catalog response for the same VIN', async () => {
    test.skip(true, 'Requires Mobipark main site catalog lookup access');
  });

  test('TC_038 – Verify warranty details are not shown on the second and later vehicles in the Registered vehicles list', async () => {
    test.skip(true, 'Requires member account with two or more registered vehicles');
  });

  test('TC_039 – Verify only one-year warranty applies when the main site has no delivery date for that vehicle', async () => {
    test.skip(true, 'Requires main site vehicle record with missing delivery date');
  });

  test('TC_040 – Verify warranty information is not shown for vehicles where the member is only a previous owner or has an earlier ownership history per product rules', async ({
    loginPage,
    dashboardPage,
    viewRegistrationPage,
  }) => {
    await test.step('Inspect warranty on previous-owner vehicle card', async () => {
      await openRegisteredVehicles(loginPage, dashboardPage, viewRegistrationPage);
      const card = viewRegistrationPage.vehicleCards.first();
      await expect(card.getByText(ownership.previousOwner, { exact: true })).toBeVisible();
      const warranty = (
        await viewRegistrationPage.cardFieldValue(card, fields.warrantyEnd).textContent()
      )?.trim();
      expect(warranty === '—' || warranty === '-' || warranty === '').toBeTruthy();
    });
  });

  test('TC_041 – Verify Member Registration Date is updated in MOBIPARK main system inventory when a vehicle is registered on the member site', async () => {
    test.skip(true, 'Requires MOBIPARK main system inventory read access');
  });

  test('TC_042 – Verify delivery date and warranty period on registered vehicle list and details stay consistent with the main site and with registration success messaging', async () => {
    test.skip(true, 'Requires main site delivery date setup and multi-user registration orchestration');
  });
});
