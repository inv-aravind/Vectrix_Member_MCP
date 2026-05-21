import { expect } from '@playwright/test';
import testData from '../data/testData.json';
import { markVinConsumed, allocateFreshVin } from './vehicleVinPool';
import type { LoginPage } from '../page-objects/Login.page';
import type { DashboardPage } from '../page-objects/Dashboard.page';
import type { NewVehicleRegistrationPage } from '../page-objects/NewVehicleRegistration.page';

const nvr = testData.newVehicleRegistration;
const vr = testData.viewRegistration;
const fields = vr.fields;

export async function loginAs(
  loginPage: LoginPage,
  dashboardPage: DashboardPage,
  email: string,
  password: string,
): Promise<void> {
  await loginPage.goto();
  await loginPage.login(email, password);
  await dashboardPage.expectOnDashboard();
}

export async function clearSession(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(testData.routes.login);
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

export async function openRegisteredVehiclesAs(
  loginPage: LoginPage,
  dashboardPage: DashboardPage,
  vehiclePage: NewVehicleRegistrationPage,
  email: string,
  password: string,
): Promise<void> {
  await loginAs(loginPage, dashboardPage, email, password);
  await vehiclePage.goto();
  await vehiclePage.openRegisteredVehiclesTab();
}

export async function openNewRegistrationAs(
  loginPage: LoginPage,
  dashboardPage: DashboardPage,
  vehiclePage: NewVehicleRegistrationPage,
  email: string,
  password: string,
): Promise<void> {
  await loginAs(loginPage, dashboardPage, email, password);
  await vehiclePage.openNewRegistration();
}

export async function registerFreshVehicle(
  vehiclePage: NewVehicleRegistrationPage,
  reserved: string[] = [],
): Promise<string> {
  const pool = nvr.unregisteredSerialNumbers;
  const firstChoice = allocateFreshVin(reserved);
  const candidates = [firstChoice, ...pool.filter((serial) => serial !== firstChoice && !reserved.includes(serial))];
  for (const serial of candidates) {
    await vehiclePage.openNewRegistrationTab();
    await vehiclePage.searchVin(serial);
    const canRegister = await vehiclePage.registerThisVehicleButton.isVisible().catch(() => false);
    if (!canRegister) continue;
    const response = await vehiclePage.registerThisVehicleAndWait();
    expect(response.status()).toBe(200);
    await vehiclePage.expectConfirmationPage(serial);
    markVinConsumed(serial);
    return serial;
  }
  throw new Error('Unable to register a fresh vehicle from the PSA01 VIN pool');
}

export async function waitForRegisteredListLoaded(
  vehiclePage: NewVehicleRegistrationPage,
): Promise<void> {
  await vehiclePage.openRegisteredVehiclesTab();
  await vehiclePage.page
    .getByText('車両情報を読み込み中')
    .waitFor({ state: 'hidden', timeout: 20000 })
    .catch(() => undefined);
}

export async function captureRegisteredSerials(
  vehiclePage: NewVehicleRegistrationPage,
): Promise<string[]> {
  await waitForRegisteredListLoaded(vehiclePage);
  return vehiclePage.captureRegisteredSerialNumbers();
}

export function cardForSerial(vehiclePage: NewVehicleRegistrationPage, serial: string) {
  return vehiclePage.page.locator(
    `//p[normalize-space()='${fields.serialNumber}']/following-sibling::p[normalize-space()='${serial}']/ancestor::div[contains(@class,'card')][1]`,
  );
}

export async function expectSerialVisibleInRegisteredList(
  vehiclePage: NewVehicleRegistrationPage,
  serial: string,
): Promise<void> {
  await vehiclePage.openRegisteredVehiclesTab();
  await expect(vehiclePage.registeredVehiclesTab).toHaveAttribute('aria-selected', 'true');
  await expect(vehiclePage.page.getByText(serial, { exact: true })).toBeVisible({ timeout: 20000 });
  const card = cardForSerial(vehiclePage, serial);
  await expect(card).toBeVisible();
  await expect(vehiclePage.cardFieldValue(card, fields.serialNumber)).toHaveText(serial);
  await expect(vehiclePage.cardBrandName(card)).not.toHaveText('');
}

export async function expectRegisteredListContainsAll(
  vehiclePage: NewVehicleRegistrationPage,
  serials: string[],
): Promise<void> {
  for (const serial of serials) {
    await expectSerialVisibleInRegisteredList(vehiclePage, serial);
  }
}

export function nextLookupVin(reserved: string[] = []): string {
  return allocateFreshVin(reserved);
}
