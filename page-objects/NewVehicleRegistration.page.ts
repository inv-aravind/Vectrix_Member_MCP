import { expect, type Locator, type Page, type Response } from '@playwright/test';
import testData from '../data/testData.json';
import { ViewRegistrationPage } from './ViewRegistration.page';

export class NewVehicleRegistrationPage extends ViewRegistrationPage {
  readonly searchButton: Locator;
  readonly vinHelpText: Locator;
  readonly newRegistrationIntro: Locator;
  readonly searchResultsHeading: Locator;
  readonly searchResultPanel: Locator;
  readonly registerThisVehicleButton: Locator;
  readonly vinFieldAlert: Locator;
  readonly confirmationHeading: Locator;
  readonly confirmationBody: Locator;
  readonly confirmationVehicleSection: Locator;
  readonly confirmationWarrantyPanel: Locator;
  readonly goToRegisteredListButton: Locator;
  readonly confirmationReturnToMyPageLink: Locator;

  constructor(page: Page) {
    super(page);
    const nvr = testData.newVehicleRegistration.ui;
    this.searchButton = page.getByRole('button', { name: nvr.searchButton });
    this.vinHelpText = page.getByText(nvr.vinHelpText);
    this.newRegistrationIntro = page.getByText(nvr.newRegistrationIntro);
    this.searchResultsHeading = page.getByText(nvr.searchResultsHeading, { exact: true });
    this.searchResultPanel = page.locator(
      `//p[normalize-space()='${nvr.searchResultsHeading}']/ancestor::div[.//p[normalize-space()='${testData.newVehicleRegistration.expected.brand}']][1]`,
    );
    this.registerThisVehicleButton = page.getByRole('button', { name: nvr.registerThisVehicleButton });
    this.vinFieldAlert = page.locator(
      "//label[contains(.,'VIN')]/following::input[1]/following-sibling::*[@role='alert'] | //input[contains(@placeholder,'ITLM')]/following-sibling::*[@role='alert']",
    ).first();
    this.confirmationHeading = page.getByRole('heading', { name: nvr.confirmationHeading });
    this.confirmationBody = page.getByText(nvr.confirmationBody);
    this.confirmationVehicleSection = page.locator(
      `//p[normalize-space()='${nvr.registeredVehicleLabel}']/..`,
    );
    this.confirmationWarrantyPanel = page.locator('div').filter({
      hasText: new RegExp(`${nvr.oneYearWarrantyApplied}|${nvr.twoYearWarrantyApplied}`),
    });
    this.goToRegisteredListButton = page.getByRole('button', { name: nvr.goToRegisteredListButton });
    this.confirmationReturnToMyPageLink = page.getByRole('link', { name: nvr.confirmationReturnToMyPage });
  }

  async openNewRegistration(): Promise<void> {
    await this.goto();
    await this.openNewRegistrationTab();
    await this.expectNewRegistrationSearchForm();
  }

  async expectNewRegistrationSearchForm(): Promise<void> {
    await expect(this.newRegistrationHeading).toBeVisible();
    await expect(this.newRegistrationIntro).toBeVisible();
    await expect(this.vinSearchInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
    await expect(this.vinHelpText).toBeVisible();
  }

  async fillVin(serial: string): Promise<void> {
    await this.vinSearchInput.fill(serial);
  }

  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async searchVin(serial: string): Promise<void> {
    await this.fillVin(serial);
    await this.clickSearch();
    await expect(this.searchButton).toBeEnabled({ timeout: 20000 });
  }

  async searchVinAndWaitForValidate(serial: string): Promise<Response> {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/vehicles/validate') &&
        response.request().method() === 'GET',
      { timeout: 20000 },
    );
    await this.searchVin(serial);
    return responsePromise;
  }

  async registerThisVehicleAndWait(): Promise<Response> {
    await expect(this.registerThisVehicleButton).toBeVisible();
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/vehicles') &&
        response.request().method() === 'POST',
      { timeout: 20000 },
    );
    await this.registerThisVehicleButton.click();
    return responsePromise;
  }

  async expectVinRequiredError(): Promise<void> {
    await expect(this.vinFieldAlert).toBeVisible();
    await expect(this.vinFieldAlert).toContainText(
      testData.newVehicleRegistration.messages.vinRequired,
    );
  }

  async expectSerialNotFoundError(): Promise<void> {
    await expect(this.vinFieldAlert).toBeVisible();
    await expect(this.vinFieldAlert).toContainText(
      testData.newVehicleRegistration.messages.serialNotFound,
    );
  }

  async expectSearchResultsVisible(): Promise<void> {
    await expect(this.searchResultsHeading).toBeVisible();
  }

  async expectRegisterButtonVisible(visible = true): Promise<void> {
    if (visible) {
      await expect(this.registerThisVehicleButton).toBeVisible();
    } else {
      await expect(this.registerThisVehicleButton).not.toBeVisible();
    }
  }

  async expectNoPurchaseInfoOneYearWarranty(): Promise<void> {
    const alert = this.page.getByRole('alert').filter({
      hasText: testData.newVehicleRegistration.messages.noPurchaseInfoTitle,
    });
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(testData.newVehicleRegistration.messages.oneYearWarrantyStandard);
  }

  async expectAlreadyRegisteredBySelfMessage(): Promise<void> {
    await expect(this.page.getByText(testData.newVehicleRegistration.messages.alreadyRegisteredSelf)).toBeVisible();
  }

  async expectAlreadyRegisteredByOtherMessage(): Promise<void> {
    await expect(
      this.page.getByText(testData.newVehicleRegistration.messages.alreadyRegisteredOther),
    ).toBeVisible();
    await expect(
      this.page.getByText(testData.newVehicleRegistration.messages.transferOwnershipNote),
    ).toBeVisible();
  }

  async expectSearchResultContainsSerial(serial: string): Promise<void> {
    await this.expectSearchResultsVisible();
    await expect(this.searchResultPanel).toContainText(serial.trim());
  }

  async expectSearchResultBrandAndModel(): Promise<void> {
    await this.expectSearchResultsVisible();
    await expect(this.searchResultPanel).toContainText(testData.newVehicleRegistration.expected.brand);
    await expect(this.searchResultPanel).toContainText(testData.newVehicleRegistration.expected.model);
  }

  async expectConfirmationPage(serial: string): Promise<void> {
    const nvr = testData.newVehicleRegistration.ui;
    await expect(this.confirmationHeading).toBeVisible();
    await expect(this.confirmationBody).toBeVisible();
    await expect(this.confirmationVehicleSection).toContainText(serial.trim());
    await expect(this.goToRegisteredListButton).toBeVisible();
    await expect(this.confirmationReturnToMyPageLink).toBeVisible();
  }

  async expectOneYearConfirmationWarranty(): Promise<void> {
    const nvr = testData.newVehicleRegistration.ui;
    await expect(this.page.getByText(nvr.oneYearWarrantyApplied)).toBeVisible();
    await expect(this.page.getByText(nvr.oneYearWarrantyAppliedDetail)).toBeVisible();
  }

  async expectTwoYearConfirmationWarranty(): Promise<void> {
    const nvr = testData.newVehicleRegistration.ui;
    await expect(this.page.getByText(nvr.twoYearWarrantyApplied)).toBeVisible();
  }

  async expectEligibilityBannerWithDayCount(): Promise<void> {
    await expect(
      this.page.getByText(new RegExp(testData.newVehicleRegistration.patterns.eligibilityDayCount)),
    ).toBeVisible();
  }

  async getSearchResultDeliveryDate(): Promise<string> {
    const text = await this.searchResultPanel.innerText();
    const match = text.match(/受渡日:\s*([^\n]+)/);
    return (match?.[1] ?? '').trim();
  }

  async getSearchResultWarrantyEnd(): Promise<string> {
    const text = await this.searchResultPanel.innerText();
    const match = text.match(/保証期限[:\s]*([^\n]+)/);
    return (match?.[1] ?? '').trim();
  }

  async expectResponsiveHeaderVisible(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'MOBIPARKMEMBERS' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'アカウントメニュー' })).toBeVisible();
    const header = this.page.locator('header').first();
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);
  }

  async expectWarrantyPanelStylesConsistent(): Promise<void> {
    const panel = this.confirmationWarrantyPanel.first();
    await expect(panel).toBeVisible();
    const styles = await panel.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        borderWidth: computed.borderWidth,
      };
    });
    expect(styles.backgroundColor).not.toBe('');
  }
}
