import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';
import {
  getNoVehicleCredentials,
  getVehicleRegistrationAccount,
} from '../utils/vehicleRegistrationAccounts';
import {
  clearSession,
  loginAs,
  openNewRegistrationAs,
  openRegisteredVehiclesAs,
  registerFreshVehicle,
  captureRegisteredSerials,
  expectSerialVisibleInRegisteredList,
  expectRegisteredListContainsAll,
  nextLookupVin,
} from '../utils/vehicleRegistrationRegression';

const nvr = testData.newVehicleRegistration;
const vr = testData.viewRegistration;
const fields = vr.fields;
const ownership = vr.ownership;
const noVehicle = getNoVehicleCredentials();
const account1000 = getVehicleRegistrationAccount('user1000');
const account1001 = getVehicleRegistrationAccount('user1001');
const account1002 = getVehicleRegistrationAccount('user1002');
const account1003 = getVehicleRegistrationAccount('user1003');

test.describe.configure({ mode: 'serial' });

test.describe('Vehicle Registration Regression (New Registration + Registered Vehicles)', () => {
  test('REG_SETUP – Verify vehicle registration page exposes both co-dependent tabs and baseline access', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Sign in and open vehicle registration', async () => {
      await loginAs(loginPage, dashboardPage, noVehicle.email, noVehicle.password);
      await newVehicleRegistrationPage.goto();
    });
    await test.step('Verify Registered vehicles and New registration tabs are available', async () => {
      await expect(newVehicleRegistrationPage.registeredVehiclesTab).toBeVisible();
      await expect(newVehicleRegistrationPage.newRegistrationTab).toBeVisible();
      await newVehicleRegistrationPage.expectPageHeaderVisible();
      await newVehicleRegistrationPage.expectWarrantyCalloutVisible();
    });
    await test.step('Verify Registered vehicles tab loads list or empty state', async () => {
      await newVehicleRegistrationPage.openRegisteredVehiclesTab();
      const hasCards = (await newVehicleRegistrationPage.vehicleCards.count()) > 0;
      if (hasCards) {
        await newVehicleRegistrationPage.expectAtLeastOneVehicleCard();
      } else {
        await newVehicleRegistrationPage.expectEmptyRegisteredList();
      }
    });
    await test.step('Verify New registration tab exposes VIN search workflow', async () => {
      await newVehicleRegistrationPage.openNewRegistrationTab();
      await newVehicleRegistrationPage.expectNewRegistrationSearchForm();
    });
  });

  test('REG_E2E_001 – Register a fresh PSA01 VIN and verify it appears on the Registered vehicles tab', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    let registeredSerial = '';
    await test.step('Register a fresh VIN under dedicated account +1000', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1000.email,
        account1000.password,
      );
      registeredSerial = await registerFreshVehicle(newVehicleRegistrationPage);
    });
    await test.step('Open Registered vehicles tab and verify newly registered vehicle is listed', async () => {
      await newVehicleRegistrationPage.goToRegisteredListButton.click();
      await expectSerialVisibleInRegisteredList(newVehicleRegistrationPage, registeredSerial);
    });
    await test.step('Verify card shows current owner badge and core fields', async () => {
      const card = newVehicleRegistrationPage.vehicleCards.filter({ hasText: registeredSerial }).first();
      await expect(newVehicleRegistrationPage.cardOwnershipBadge(card)).toHaveText(ownership.currentOwner);
      await expect(newVehicleRegistrationPage.cardFieldValue(card, fields.purchaseDate)).toBeVisible();
      await expect(newVehicleRegistrationPage.cardFieldValue(card, fields.warrantyEnd)).toBeVisible();
    });
  });

  test('REG_E2E_002 – Complete registration confirmation flow and validate registered list via 登録車両一覧へ', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    let registeredSerial = '';
    await test.step('Register vehicle and land on confirmation page', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1001.email,
        account1001.password,
      );
      registeredSerial = await registerFreshVehicle(newVehicleRegistrationPage);
      await newVehicleRegistrationPage.expectOneYearConfirmationWarranty();
    });
    await test.step('Navigate to registered list from confirmation and verify dependency', async () => {
      await newVehicleRegistrationPage.goToRegisteredListButton.click();
      await expectSerialVisibleInRegisteredList(newVehicleRegistrationPage, registeredSerial);
    });
  });

  test('REG_E2E_003 – Verify tab switching keeps New registration input while Registered tab reflects persisted vehicles', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const lookupVin = nextLookupVin();
    let baselineSerials: string[] = [];
    await test.step('Capture registered list baseline', async () => {
      await openRegisteredVehiclesAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1001.email,
        account1001.password,
      );
      baselineSerials = await captureRegisteredSerials(newVehicleRegistrationPage);
      if (baselineSerials.length === 0) {
        await openNewRegistrationAs(
          loginPage,
          dashboardPage,
          newVehicleRegistrationPage,
          account1001.email,
          account1001.password,
        );
        const serial = await registerFreshVehicle(newVehicleRegistrationPage);
        await newVehicleRegistrationPage.goToRegisteredListButton.click();
        baselineSerials = [serial];
      }
      expect(baselineSerials.length).toBeGreaterThan(0);
    });
    await test.step('Search on New registration tab without registering', async () => {
      await newVehicleRegistrationPage.openNewRegistrationTab();
      const response = await newVehicleRegistrationPage.searchVinAndWaitForValidate(lookupVin);
      expect(response.status()).toBe(200);
      await newVehicleRegistrationPage.expectSearchResultContainsSerial(lookupVin);
    });
    await test.step('Switch to Registered vehicles and back; list unchanged, VIN input retained', async () => {
      await newVehicleRegistrationPage.openRegisteredVehiclesTab();
      await expectRegisteredListContainsAll(newVehicleRegistrationPage, baselineSerials);
      await newVehicleRegistrationPage.openNewRegistrationTab();
      await expect(newVehicleRegistrationPage.vinSearchInput).toHaveValue(lookupVin);
      await newVehicleRegistrationPage.expectRegisterButtonVisible(true);
    });
  });

  test('REG_E2E_004 – Verify duplicate registration on New tab is blocked while vehicle remains visible in Registered list', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    let registeredSerial = '';
    await test.step('Ensure account +1002 has a registered vehicle', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1002.email,
        account1002.password,
      );
      registeredSerial = await registerFreshVehicle(newVehicleRegistrationPage);
      await newVehicleRegistrationPage.goToRegisteredListButton.click();
      await expectSerialVisibleInRegisteredList(newVehicleRegistrationPage, registeredSerial);
    });
    await test.step('Search same serial on New registration tab', async () => {
      await newVehicleRegistrationPage.openNewRegistrationTab();
      await newVehicleRegistrationPage.searchVin(registeredSerial);
      await newVehicleRegistrationPage.expectAlreadyRegisteredBySelfMessage();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
    await test.step('Registered vehicles tab still lists the vehicle', async () => {
      await newVehicleRegistrationPage.openRegisteredVehiclesTab();
      await expectSerialVisibleInRegisteredList(newVehicleRegistrationPage, registeredSerial);
    });
  });

  test('REG_E2E_005 – Verify cross-account ownership guidance on New tab without removing vehicle from original Registered list', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    let ownerSerial = '';
    await test.step('Primary account registers a fresh VIN', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1002.email,
        account1002.password,
      );
      ownerSerial = await registerFreshVehicle(newVehicleRegistrationPage);
      await newVehicleRegistrationPage.goToRegisteredListButton.click();
      await expectSerialVisibleInRegisteredList(newVehicleRegistrationPage, ownerSerial);
    });
    await test.step('Secondary account sees transfer guidance on New registration search', async () => {
      await dashboardPage.logout();
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1003.email,
        account1003.password,
      );
      await newVehicleRegistrationPage.searchVin(ownerSerial);
      await newVehicleRegistrationPage.expectAlreadyRegisteredByOtherMessage();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(true);
    });
    await test.step('Original owner Registered list still contains the vehicle', async () => {
      await dashboardPage.logout();
      await openRegisteredVehiclesAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1002.email,
        account1002.password,
      );
      await expectSerialVisibleInRegisteredList(newVehicleRegistrationPage, ownerSerial);
    });
  });

  test('REG_E2E_006 – Verify failed VIN lookup on New tab does not alter Registered vehicles list', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    let beforeSerials: string[] = [];
    await test.step('Capture Registered vehicles baseline for +1001', async () => {
      await openRegisteredVehiclesAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account1001.email,
        account1001.password,
      );
      beforeSerials = await captureRegisteredSerials(newVehicleRegistrationPage);
    });
    await test.step('Run invalid lookup on New registration tab', async () => {
      await newVehicleRegistrationPage.openNewRegistrationTab();
      await newVehicleRegistrationPage.searchVin(nvr.invalidSerials.notInCatalog);
      await newVehicleRegistrationPage.expectSerialNotFoundError();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
    await test.step('Registered vehicles list remains unchanged', async () => {
      await newVehicleRegistrationPage.openRegisteredVehiclesTab();
      const afterSerials = await captureRegisteredSerials(newVehicleRegistrationPage);
      expect(afterSerials.sort()).toEqual(beforeSerials.sort());
    });
  });

  test('REG_E2E_007 – Verify validate API and UI stay aligned for fresh PSA01 lookup before registration', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const lookupVin = nextLookupVin();
    await test.step('Search fresh PSA01 serial and compare API with UI', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      const response = await newVehicleRegistrationPage.searchVinAndWaitForValidate(lookupVin);
      expect(response.status()).toBe(200);
      expect(response.url()).toContain(nvr.patterns.validateApi);
      const body = (await response.json()) as { brand?: string; name?: string; serialNumber?: string };
      const panelText = await newVehicleRegistrationPage.searchResultPanel.innerText();
      if (body.brand) expect(panelText).toContain(body.brand);
      if (body.name) expect(panelText).toContain(body.name);
      expect(panelText).toContain(lookupVin);
      await newVehicleRegistrationPage.expectNoPurchaseInfoOneYearWarranty();
    });
  });

  test('REG_E2E_008 – Verify empty-state account can reach New registration from Registered tab CTA', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Open Registered vehicles as no-vehicle account', async () => {
      await openRegisteredVehiclesAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.expectEmptyRegisteredList();
    });
    await test.step('Use register CTA and verify New registration workflow opens', async () => {
      await newVehicleRegistrationPage.clickRegisterNewVehicle();
      await newVehicleRegistrationPage.expectNewRegistrationTabActive();
      await newVehicleRegistrationPage.expectNewRegistrationSearchForm();
    });
  });

  test('REG_CLEANUP – Verify session teardown blocks co-dependent vehicle routes without authentication', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
    page,
  }) => {
    await test.step('Sign in and open vehicle registration', async () => {
      await openRegisteredVehiclesAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
    });
    await test.step('Logout from vehicle registration context', async () => {
      await dashboardPage.logout();
      await loginPage.expectOnLoginPage();
    });
    await test.step('Protected vehicle route requires login for both tabs', async () => {
      await page.goto(testData.routes.protectedVehicle);
      await loginPage.expectOnLoginPage();
      await expect(newVehicleRegistrationPage.vinSearchInput).toHaveCount(0);
      await expect(newVehicleRegistrationPage.registeredVehiclesTab).toHaveCount(0);
    });
    await test.step('Clear client session state for subsequent runs', async () => {
      await clearSession(page);
    });
  });
});
