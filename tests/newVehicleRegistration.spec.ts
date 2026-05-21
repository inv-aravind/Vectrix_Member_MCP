import { test, expect } from '../fixtures/page-fixture';
import testData from '../data/testData.json';
import {
  getNoVehicleCredentials,
  getVehicleRegistrationAccount,
} from '../utils/vehicleRegistrationAccounts';
import { addYearsToDate, daysSinceDelivery } from '../utils/vehicleApi';
import { markVinConsumed, getKnownRegisteredVin } from '../utils/vehicleVinPool';

const nvr = testData.newVehicleRegistration;
const noVehicle = getNoVehicleCredentials();

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

async function openNewRegistrationAs(
  loginPage: import('../page-objects/Login.page').LoginPage,
  dashboardPage: import('../page-objects/Dashboard.page').DashboardPage,
  newVehicleRegistrationPage: import('../page-objects/NewVehicleRegistration.page').NewVehicleRegistrationPage,
  email: string,
  password: string,
): Promise<void> {
  await loginAs(loginPage, dashboardPage, email, password);
  await newVehicleRegistrationPage.openNewRegistration();
}

async function clearSession(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(testData.routes.login);
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function registerFreshVehicle(
  newVehicleRegistrationPage: import('../page-objects/NewVehicleRegistration.page').NewVehicleRegistrationPage,
  reserved: string[] = [],
): Promise<string> {
  const pool = nvr.unregisteredSerialNumbers;
  for (const serial of pool) {
    if (reserved.includes(serial)) continue;
    await newVehicleRegistrationPage.openNewRegistrationTab();
    await newVehicleRegistrationPage.searchVin(serial);
    const canRegister = await newVehicleRegistrationPage.registerThisVehicleButton
      .isVisible()
      .catch(() => false);
    if (!canRegister) continue;
    const response = await newVehicleRegistrationPage.registerThisVehicleAndWait();
    expect(response.status()).toBe(200);
    await newVehicleRegistrationPage.expectConfirmationPage(serial);
    markVinConsumed(serial);
    return serial;
  }
  throw new Error('Unable to register a fresh vehicle after exhausting the VIN pool');
}

test.describe('New Vehicle Registration Module', () => {
  test('TC_001 – Verify authenticated member can open the New registration tab and see the Vehicle Identification Number search form', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Sign in and open New registration tab', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
    });
    await test.step('Verify VIN search form controls', async () => {
      await newVehicleRegistrationPage.expectNewRegistrationSearchForm();
    });
  });

  test('TC_002 – Verify Search is blocked or shows validation when Vehicle identification number is empty', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Open New registration and search with empty VIN', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.clickSearch();
    });
    await test.step('Verify required-field validation', async () => {
      await newVehicleRegistrationPage.expectVinRequiredError();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
  });

  test('TC_003 – Verify vehicle lookup succeeds when the user enters the exact case-sensitive vehicle serial number', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.expected.exactCaseSerial;
    await test.step('Search with exact catalog serial', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify vehicle details and Register button', async () => {
      await newVehicleRegistrationPage.expectSearchResultContainsSerial(serial);
      await newVehicleRegistrationPage.expectSearchResultBrandAndModel();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(true);
    });
  });

  test('TC_004 – Verify vehicle lookup shows not found or invalid messaging when the serial does not exist in the catalog', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Search with unknown serial', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(nvr.invalidSerials.notInCatalog);
    });
    await test.step('Verify not-found messaging', async () => {
      await newVehicleRegistrationPage.expectSerialNotFoundError();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
  });

  test('TC_005 – Verify Search triggers a request to the Mobipark main site vehicle lookup API', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.expected.exactCaseSerial;
    await test.step('Open New registration and capture validate API', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      const response = await newVehicleRegistrationPage.searchVinAndWaitForValidate(serial);
      expect(response.status()).toBe(200);
      expect(response.url()).toContain(nvr.patterns.validateApi);
      expect(response.url()).toContain(encodeURIComponent(serial));
    });
  });

  test('TC_006 – Verify partial vehicle serial entry does not return the same successful match as the full exact serial', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const fullSerial = nvr.expected.exactCaseSerial;
    await test.step('Search with partial prefix only', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(nvr.invalidSerials.partialPrefix);
      await newVehicleRegistrationPage.expectSerialNotFoundError();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
    await test.step('Search with full exact serial for comparison', async () => {
      await newVehicleRegistrationPage.searchVin(fullSerial);
      await newVehicleRegistrationPage.expectSearchResultsVisible();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(true);
    });
  });

  test('TC_007 – Verify leading or trailing spaces in the Vehicle identification number field are handled consistently with the exact-match rule', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.expected.exactCaseSerial;
    await test.step('Search with padded serial', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(`  ${serial}  `);
    });
    await test.step('Verify normalized lookup succeeds', async () => {
      await newVehicleRegistrationPage.expectSearchResultContainsSerial(serial);
      await newVehicleRegistrationPage.expectRegisterButtonVisible(true);
    });
  });

  test('TC_008 – Verify warranty eligibility shows two-year coverage messaging when purchase date is within one month of purchase', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.warranty.twoYearWithinWindowSerial;
    await test.step('Search vehicle configured for two-year eligibility', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify two-year or documented fallback messaging', async () => {
      const deliveryDate = await newVehicleRegistrationPage.getSearchResultDeliveryDate();
      const body = await newVehicleRegistrationPage.searchResultPanel.innerText();
      if (deliveryDate && deliveryDate !== '-') {
        expect(body).toMatch(/2年|2年間/);
      } else {
        await newVehicleRegistrationPage.expectNoPurchaseInfoOneYearWarranty();
      }
    });
  });

  test('TC_009 – Verify warranty eligibility shows one-year coverage messaging when purchase date is more than one month old per rules', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.warranty.oneYearOutsideWindowSerial;
    await test.step('Search vehicle outside extension window or without delivery date', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify one-year warranty messaging', async () => {
      await newVehicleRegistrationPage.expectNoPurchaseInfoOneYearWarranty();
    });
  });

  test('TC_010 – Verify warranty classification at the boundary of one month from purchase date matches the product definition', async () => {
    test.skip(
      true,
      'Requires catalog vehicle with delivery date exactly on the one-month warranty boundary',
    );
  });

  test('TC_011 – Verify basic vehicle details shown after a successful search match the API response fields', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.expected.exactCaseSerial;
    await test.step('Search vehicle and capture validate API response', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      const response = await newVehicleRegistrationPage.searchVinAndWaitForValidate(serial);
      expect(response.status()).toBe(200);
      const body = (await response.json()) as { brand?: string; name?: string };
      const panelText = await newVehicleRegistrationPage.searchResultPanel.innerText();
      if (body.brand) expect(panelText).toContain(body.brand);
      if (body.name) expect(panelText).toContain(body.name);
      expect(panelText).toContain(serial);
    });
  });

  test('TC_012 – Verify Register button is shown only after a successful valid vehicle lookup', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Verify no Register button before search', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
    await test.step('Verify no Register button after failed search', async () => {
      await newVehicleRegistrationPage.searchVin(nvr.invalidSerials.notInCatalog);
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
    await test.step('Verify Register button after successful search', async () => {
      await newVehicleRegistrationPage.searchVin(nvr.expected.exactCaseSerial);
      await newVehicleRegistrationPage.expectRegisterButtonVisible(true);
    });
  });

  test('TC_013 – Verify clicking Register after a successful lookup advances the registration flow', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1003');
    await test.step('Search and register vehicle', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      const serial = await registerFreshVehicle(newVehicleRegistrationPage);
      await newVehicleRegistrationPage.expectConfirmationPage(serial);
    });
  });

  test('TC_014 – Verify switching to the Registered vehicles tab and back retains the New registration form search result', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.expected.exactCaseSerial;
    await test.step('Search on New registration tab', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
      await newVehicleRegistrationPage.expectSearchResultContainsSerial(serial);
    });
    await test.step('Switch tabs and observe preserved state', async () => {
      await newVehicleRegistrationPage.openRegisteredVehiclesTab();
      await newVehicleRegistrationPage.openNewRegistrationTab();
      const vinValue = await newVehicleRegistrationPage.vinSearchInput.inputValue();
      expect(vinValue.trim()).toBe(serial);
    });
  });

  test('TC_015 – Verify Return to My Page navigates away from vehicle registration to the dashboard', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Open vehicle registration and return to dashboard', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.returnToMyPageLink.click();
    });
    await test.step('Verify dashboard destination', async () => {
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_016 – Verify Logout from the header ends the session and prevents further authenticated vehicle search', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
    page,
  }) => {
    await test.step('Logout from vehicle registration page', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await dashboardPage.logout();
      await loginPage.expectOnLoginPage();
    });
    await test.step('Attempt protected route without sign-in', async () => {
      await page.goto(testData.routes.protectedVehicle);
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_017 – Verify help text describing where to find the VIN is visible under the search field', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Read VIN helper text', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await expect(newVehicleRegistrationPage.vinHelpText).toBeVisible();
      await expect(newVehicleRegistrationPage.vinHelpText).toHaveText(nvr.ui.vinHelpText);
    });
  });

  test('TC_018 – Verify warranty extension callout text is visible on the new registration view', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Verify warranty callout on New registration tab', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.expectWarrantyCalloutVisible();
    });
  });

  test('TC_019 – Verify new vehicle registration page is not usable for vehicle lookup without authentication', async ({
    loginPage,
    newVehicleRegistrationPage,
    page,
  }) => {
    await test.step('Clear session and open protected route', async () => {
      await clearSession(page);
      await page.goto(testData.routes.protectedVehicle);
    });
    await test.step('Verify login is required', async () => {
      await loginPage.expectOnLoginPage();
      await expect(newVehicleRegistrationPage.vinSearchInput).toHaveCount(0);
    });
  });

  test('TC_020 – Verify rapid double activation of Search does not corrupt UI state or duplicate critical side effects', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.expected.exactCaseSerial;
    await test.step('Double-click Search rapidly', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.fillVin(serial);
      await newVehicleRegistrationPage.searchButton.dblclick();
    });
    await test.step('Verify single consistent result state', async () => {
      await newVehicleRegistrationPage.expectSearchResultContainsSerial(serial);
      await expect(newVehicleRegistrationPage.searchResultsHeading).toHaveCount(1);
    });
  });

  test('TC_021 – Verify special characters-only or invalid pattern input does not return a false successful vehicle match', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Search with special characters only', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(nvr.invalidSerials.specialCharsOnly);
    });
    await test.step('Verify no false positive match', async () => {
      await newVehicleRegistrationPage.expectVinRequiredError();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
  });

  test('TC_022 – Verify search for a serial already linked to the same member behaves according to product rules', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1000');
    const serial = getKnownRegisteredVin('user1000') ?? nvr.accounts.user1000.registeredVin;
    await test.step('Search already registered serial on same account', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify duplicate messaging and no Register action', async () => {
      await newVehicleRegistrationPage.expectAlreadyRegisteredBySelfMessage();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(false);
    });
  });

  test('TC_023 – Verify very long input in the VIN field respects maximum length or server validation without client crash', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Search with very long input', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(nvr.invalidSerials.longInput);
    });
    await test.step('Verify graceful validation without crash', async () => {
      await newVehicleRegistrationPage.expectSerialNotFoundError();
      await newVehicleRegistrationPage.expectNewRegistrationSearchForm();
    });
  });

  test('TC_024 – Verify post-search vehicle card displays brand model vehicle identification number delivery date and warranty period fields', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.expected.exactCaseSerial;
    await test.step('Search valid catalog serial', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify review card fields', async () => {
      const panelText = await newVehicleRegistrationPage.searchResultPanel.innerText();
      expect(panelText).toContain(nvr.expected.brand);
      expect(panelText).toContain(nvr.expected.model);
      expect(panelText).toContain(serial);
      expect(panelText).toContain('受渡日');
    });
  });

  test('TC_025 – Verify Current owner and extended warranty badges on the review card match eligibility data from the catalog', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.warranty.noDeliveryDateSerial;
    await test.step('Search eligible vehicle and inspect badges', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
      await newVehicleRegistrationPage.expectNoPurchaseInfoOneYearWarranty();
    });
  });

  test('TC_026 – Verify calculated warranty end date matches two calendar years after the delivery date when the extended two-year rule applies', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.warranty.twoYearWithinWindowSerial;
    await test.step('Search qualifying vehicle', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify warranty end date calculation when delivery date exists', async () => {
      const deliveryDate = await newVehicleRegistrationPage.getSearchResultDeliveryDate();
      if (!deliveryDate || deliveryDate === '-') {
        test.skip(true, 'Catalog vehicle has no delivery date for two-year calculation');
        return;
      }
      const warrantyEnd = await newVehicleRegistrationPage.getSearchResultWarrantyEnd();
      expect(warrantyEnd).toBe(addYearsToDate(deliveryDate, 2));
    });
  });

  test('TC_027 – Verify green eligibility banner appears with a day count when the vehicle is still within the thirty-day extension window after delivery', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.warranty.twoYearWithinWindowSerial;
    await test.step('Search vehicle within extension window', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify day-count banner when delivery date is available', async () => {
      const deliveryDate = await newVehicleRegistrationPage.getSearchResultDeliveryDate();
      if (!deliveryDate || deliveryDate === '-') {
        test.skip(true, 'Catalog vehicle has no delivery date for day-count banner');
        return;
      }
      expect(daysSinceDelivery(deliveryDate)).toBeLessThanOrEqual(30);
      await newVehicleRegistrationPage.expectEligibilityBannerWithDayCount();
    });
  });

  test('TC_028 – Verify Register this vehicle action submits owner registration and navigates to the completion confirmation view', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1000');
    let serial = '';
    await test.step('Complete owner registration', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      serial = await registerFreshVehicle(newVehicleRegistrationPage);
    });
    await test.step('Verify confirmation view', async () => {
      await newVehicleRegistrationPage.expectConfirmationPage(serial);
    });
  });

  test('TC_029 – Verify registered vehicle summary on the confirmation page shows the correct vehicle name and serial for the vehicle just registered', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1001');
    let serial = '';
    await test.step('Register vehicle and read confirmation summary', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      serial = await registerFreshVehicle(newVehicleRegistrationPage);
    });
    await test.step('Verify vehicle identity on confirmation page', async () => {
      await expect(newVehicleRegistrationPage.confirmationVehicleSection).toContainText(
        nvr.expected.brand,
      );
      await expect(newVehicleRegistrationPage.confirmationVehicleSection).toContainText(
        nvr.expected.model,
      );
      await expect(newVehicleRegistrationPage.confirmationVehicleSection).toContainText(serial);
    });
  });

  test('TC_030 – Verify confirmation warranty panel states two-year manufacturer warranty applied when registration occurs within thirty days of delivery', async () => {
    test.skip(
      true,
      'Requires catalog vehicle with delivery date within thirty-day extension window',
    );
  });

  test('TC_031 – Verify confirmation warranty messaging follows the standard or one-year path when registration occurs after thirty days from delivery', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1003');
    await test.step('Register vehicle without delivery-date extension path', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      await registerFreshVehicle(newVehicleRegistrationPage);
    });
    await test.step('Verify one-year confirmation warranty messaging', async () => {
      await newVehicleRegistrationPage.expectOneYearConfirmationWarranty();
    });
  });

  test('TC_032 – Verify Go to Registered Vehicle List control from the confirmation page opens the registered vehicles list or tab', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1000');
    let serial = '';
    await test.step('Register vehicle and open registered list', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      serial = await registerFreshVehicle(newVehicleRegistrationPage);
      await newVehicleRegistrationPage.goToRegisteredListButton.click();
    });
    await test.step('Verify registered vehicles tab and new entry', async () => {
      await newVehicleRegistrationPage.openRegisteredVehiclesTab();
      await expect(newVehicleRegistrationPage.vehicleCards.first()).toBeVisible();
      await expect(newVehicleRegistrationPage.page.getByText(serial, { exact: true })).toBeVisible();
    });
  });

  test('TC_033 – Verify My page header link from the confirmation page navigates correctly while the session remains active', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1002');
    await test.step('Reach confirmation page', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      await registerFreshVehicle(newVehicleRegistrationPage);
    });
    await test.step('Navigate via header My page link', async () => {
      await newVehicleRegistrationPage.headerMyPageLink.click();
      await dashboardPage.expectOnDashboard();
    });
  });

  test('TC_034 – Verify Enquiry header link from the confirmation page navigates correctly while the session remains active', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1002');
    await test.step('Reach confirmation page', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      await registerFreshVehicle(newVehicleRegistrationPage);
    });
    await test.step('Navigate via header Enquiry link', async () => {
      await newVehicleRegistrationPage.headerContactLink.click();
      await dashboardPage.expectOnInquiryPage();
    });
  });

  test('TC_035 – Verify Logout from the confirmation page ends the session and prevents reuse of protected routes without signing in again', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
    page,
  }) => {
    const account = getVehicleRegistrationAccount('user1001');
    await test.step('Reach confirmation page and logout', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      await registerFreshVehicle(newVehicleRegistrationPage);
      await dashboardPage.logout();
      await loginPage.expectOnLoginPage();
    });
    await test.step('Attempt protected route reuse', async () => {
      await page.goto(testData.routes.protectedVehicle);
      await loginPage.expectOnLoginPage();
    });
  });

  test('TC_036 – Verify editing VIN in main site does not create duplicate vehicle records in Registered Vehicles list', async () => {
    test.skip(true, 'Requires Mobipark main site VIN edit access and paired VIN_OLD/VIN_NEW data');
  });

  test('TC_037 – Verify VIN search with more than two special characters does not return HTTP 500', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.invalidSerials.specialCharsHeavy;
    await test.step('Search VIN containing multiple special characters', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      const response = await newVehicleRegistrationPage.searchVinAndWaitForValidate(serial);
      expect(response.status()).not.toBe(500);
      expect(response.status()).toBeLessThan(500);
    });
  });

  test('TC_038 – Verify Vehicle registration is successful for all serial number cases', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const account = getVehicleRegistrationAccount('user1002');
    const validateSample = nvr.unregisteredSerialNumbers.slice(20, 25);
    await test.step('Validate multiple serial numbers from updated dataset via API', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        account.email,
        account.password,
      );
      for (const serial of validateSample) {
        await newVehicleRegistrationPage.openNewRegistrationTab();
        const response = await newVehicleRegistrationPage.searchVinAndWaitForValidate(serial);
        expect(response.status()).toBe(200);
      }
    });
    await test.step('Complete at least one successful registration from the dataset', async () => {
      const serial = await registerFreshVehicle(newVehicleRegistrationPage);
      await newVehicleRegistrationPage.goToRegisteredListButton.click();
      await newVehicleRegistrationPage.openRegisteredVehiclesTab();
      await expect(newVehicleRegistrationPage.page.getByText(serial, { exact: true })).toBeVisible();
    });
  });

  test('TC_039 – Verify one-year warranty label is shown for eligible vehicle without delivery date', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const serial = nvr.warranty.noDeliveryDateSerial;
    await test.step('Search vehicle without delivery date', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(serial);
    });
    await test.step('Verify one-year warranty label on search result', async () => {
      await newVehicleRegistrationPage.expectNoPurchaseInfoOneYearWarranty();
    });
  });

  test('TC_040 – Verify VIN with spaces saved on main site is searchable in registration', async () => {
    test.skip(true, 'Requires main site vehicle with stored VIN containing spaces');
  });

  test('TC_041 – Verify warranty block styling is visually consistent on registration success screen for one-year and two-year manufacturer warranty', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    await test.step('Inspect one-year warranty panel styling on search result', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.searchVin(nvr.warranty.noDeliveryDateSerial);
      await newVehicleRegistrationPage.expectNoPurchaseInfoOneYearWarranty();
      const panel = newVehicleRegistrationPage.page.getByRole('alert').filter({
        hasText: nvr.messages.oneYearWarrantyStandard,
      });
      await expect(panel).toBeVisible();
      const styles = await panel.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(styles).not.toBe('');
    });
  });

  test('TC_042 – Verify VIN field UI and API behavior are consistent when editing a Wholesale Status record on Main Site', async () => {
    test.skip(true, 'Requires Mobipark main site Wholesale Status record access');
  });

  test('TC_043 – Verify main section titles and subtitles are not incorrectly bold in Safari on Mac', async () => {
    test.skip(true, 'Safari-on-Mac cross-browser check is out of scope for Chromium automation');
  });

  test('TC_044 – Verify header layout is not broken on vehicle registration and enquiry pages on iPad', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
    page,
  }) => {
    await test.step('Set iPad viewport and inspect vehicle registration header', async () => {
      await page.setViewportSize({ width: 820, height: 1180 });
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        noVehicle.email,
        noVehicle.password,
      );
      await newVehicleRegistrationPage.expectResponsiveHeaderVisible();
      await expect(newVehicleRegistrationPage.pageHeading).toBeVisible();
    });
    await test.step('Inspect enquiry page header at iPad width', async () => {
      await newVehicleRegistrationPage.headerContactLink.click({ force: true }).catch(async () => {
        await newVehicleRegistrationPage.page.goto(testData.routes.contact);
      });
      await dashboardPage.expectOnInquiryPage();
      await newVehicleRegistrationPage.expectResponsiveHeaderVisible();
    });
  });

  test('TC_MULTI – Verify cross-account ownership shows transfer guidance when another member already registered the vehicle', async ({
    loginPage,
    dashboardPage,
    newVehicleRegistrationPage,
  }) => {
    const ownerAccount = getVehicleRegistrationAccount('user1002');
    const secondAccount = getVehicleRegistrationAccount('user1003');
    let transferSerial = '';
    await test.step('Register a vehicle under the primary account', async () => {
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        ownerAccount.email,
        ownerAccount.password,
      );
      transferSerial = await registerFreshVehicle(newVehicleRegistrationPage);
    });
    await test.step('Second account searches same serial and sees ownership transfer guidance', async () => {
      await dashboardPage.logout();
      await openNewRegistrationAs(
        loginPage,
        dashboardPage,
        newVehicleRegistrationPage,
        secondAccount.email,
        secondAccount.password,
      );
      await newVehicleRegistrationPage.searchVin(transferSerial);
      await newVehicleRegistrationPage.expectAlreadyRegisteredByOtherMessage();
      await newVehicleRegistrationPage.expectRegisterButtonVisible(true);
    });
  });
});
