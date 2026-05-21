import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export class ViewRegistrationPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly pageSubtitle: Locator;
  readonly warrantyBanner: Locator;
  readonly warrantyCallout: Locator;
  readonly registeredVehiclesTab: Locator;
  readonly newRegistrationTab: Locator;
  readonly newRegistrationHeading: Locator;
  readonly returnToMyPageLink: Locator;
  readonly emptyStateMessage: Locator;
  readonly emptyStateHint: Locator;
  readonly registerNewVehicleButton: Locator;
  readonly vehicleCards: Locator;
  readonly headerMyPageLink: Locator;
  readonly headerContactLink: Locator;
  readonly vinSearchInput: Locator;

  constructor(page: Page) {
    const vr = testData.viewRegistration;
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: vr.ui.pageHeading, level: 1 });
    this.pageSubtitle = page.getByText(vr.ui.pageSubtitle);
    this.warrantyBanner = page.getByText(vr.ui.warrantyBanner);
    this.warrantyCallout = page.getByText(vr.ui.warrantyCallout);
    this.registeredVehiclesTab = page.getByRole('tab', { name: vr.ui.registeredTab });
    this.newRegistrationTab = page.getByRole('tab', { name: vr.ui.newRegistrationTab });
    this.newRegistrationHeading = page.getByRole('heading', { name: vr.ui.newRegistrationHeading });
    this.returnToMyPageLink = page.getByRole('link', { name: vr.ui.returnToMyPage });
    this.emptyStateMessage = page.getByText(vr.messages.emptyState);
    this.emptyStateHint = page.getByText(vr.messages.emptyStateHint);
    this.registerNewVehicleButton = page.getByRole('button', {
      name: new RegExp(`${vr.ui.registerNewVehicleWithList}|${vr.ui.registerNewVehicleEmpty}`),
    });
    this.vehicleCards = page.locator(
      `//p[normalize-space()='${vr.fields.serialNumber}']/ancestor::div[contains(@class,'card')][1]`,
    );
    this.headerMyPageLink = page.locator(
      "//a[normalize-space()='マイページ' and not(contains(normalize-space(.),'戻る'))]",
    );
    this.headerContactLink = page.getByRole('link', { name: 'お問い合わせ' }).first();
    this.vinSearchInput = page.getByRole('textbox', { name: vr.ui.vinSearchLabel });
  }

  cardFieldValue(card: Locator, label: string): Locator {
    return card.locator(`xpath=.//p[normalize-space()='${label}']/following-sibling::p[1]`);
  }

  cardBrandName(card: Locator): Locator {
    return card.locator('.vehicle-registered__brand-name');
  }

  cardModelName(card: Locator): Locator {
    return card.locator("[class*='vehicle-registered__model'], [class*='model-name']").first();
  }

  cardOwnershipBadge(card: Locator): Locator {
    const { currentOwner, previousOwner } = testData.viewRegistration.ownership;
    return card.getByText(new RegExp(`${currentOwner}|${previousOwner}`));
  }

  cardImage(card: Locator): Locator {
    return card.locator('img').first();
  }

  async goto(): Promise<void> {
    await this.page.goto(testData.routes.protectedVehicle);
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.pageHeading).toBeVisible();
  }

  async openRegisteredVehiclesTab(): Promise<void> {
    await this.registeredVehiclesTab.click();
    await expect(this.registeredVehiclesTab).toHaveAttribute('aria-selected', 'true');
  }

  async openNewRegistrationTab(): Promise<void> {
    await this.newRegistrationTab.click();
    await expect(this.newRegistrationTab).toHaveAttribute('aria-selected', 'true');
  }

  async clickRegisterNewVehicle(): Promise<void> {
    await this.registerNewVehicleButton.click();
  }

  async expectOnVehicleRegistrationPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${testData.routes.protectedVehicle}$`));
    await expect(this.pageHeading).toBeVisible();
  }

  async expectRegisteredTabActive(): Promise<void> {
    await expect(this.registeredVehiclesTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectNewRegistrationTabActive(): Promise<void> {
    await expect(this.newRegistrationTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectNewRegistrationContent(): Promise<void> {
    await expect(this.newRegistrationHeading).toBeVisible();
    await expect(this.vinSearchInput).toBeVisible();
  }

  async expectAtLeastOneVehicleCard(): Promise<void> {
    await expect(this.vehicleCards.first()).toBeVisible();
    expect(await this.vehicleCards.count()).toBeGreaterThan(0);
  }

  async expectEmptyRegisteredList(): Promise<void> {
    await expect(this.emptyStateMessage).toBeVisible();
    await expect(this.emptyStateHint).toBeVisible();
    await expect(this.vehicleCards).toHaveCount(0);
  }

  async expectWarrantyCalloutVisible(): Promise<void> {
    await expect(this.warrantyBanner).toBeVisible();
    await expect(this.warrantyCallout).toBeVisible();
  }

  async expectPageHeaderVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageSubtitle).toBeVisible();
  }

  async expectGlobalHeaderVisible(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'MOBIPARKMEMBERS' })).toBeVisible();
    await expect(this.headerMyPageLink).toBeVisible();
    await expect(this.headerContactLink).toBeVisible();
  }

  async expectJapaneseNavigationLabels(): Promise<void> {
    await expect(this.headerMyPageLink).toHaveText('マイページ');
    await expect(this.headerContactLink).toHaveText('お問い合わせ');
    await expect(this.returnToMyPageLink).toHaveText('マイページに戻る');
  }

  async expectAllCardsShowSerialPurchaseAndWarranty(): Promise<void> {
    const count = await this.vehicleCards.count();
    const fields = testData.viewRegistration.fields;
    for (let i = 0; i < count; i += 1) {
      const card = this.vehicleCards.nth(i);
      await expect(this.cardFieldValue(card, fields.serialNumber)).not.toHaveText('');
      await expect(this.cardFieldValue(card, fields.purchaseDate)).not.toHaveText('');
      await expect(this.cardFieldValue(card, fields.warrantyEnd)).toBeVisible();
    }
  }

  async expectSingleOwnershipBadgePerCard(): Promise<void> {
    const count = await this.vehicleCards.count();
    const { currentOwner, previousOwner } = testData.viewRegistration.ownership;
    for (let i = 0; i < count; i += 1) {
      const card = this.vehicleCards.nth(i);
      const currentCount = await card.getByText(currentOwner, { exact: true }).count();
      const previousCount = await card.getByText(previousOwner, { exact: true }).count();
      expect(currentCount + previousCount).toBe(1);
      expect(currentCount === 0 || previousCount === 0).toBeTruthy();
    }
  }

  async expectOwnershipBadgeLabelsValid(): Promise<void> {
    const count = await this.vehicleCards.count();
    const { currentOwner, previousOwner } = testData.viewRegistration.ownership;
    for (let i = 0; i < count; i += 1) {
      await expect(this.cardOwnershipBadge(this.vehicleCards.nth(i))).toHaveText(
        new RegExp(`^(${currentOwner}|${previousOwner})$`),
      );
    }
  }

  async expectBrandAndModelOnAllCards(): Promise<void> {
    const count = await this.vehicleCards.count();
    for (let i = 0; i < count; i += 1) {
      const card = this.vehicleCards.nth(i);
      await expect(this.cardBrandName(card)).not.toHaveText('');
      const model = this.cardModelName(card);
      if ((await model.count()) > 0) {
        await expect(model).not.toHaveText('');
      } else {
        const cardText = await card.innerText();
        expect(cardText.split('\n').filter(Boolean).length).toBeGreaterThan(2);
      }
    }
  }

  async expectPurchaseDatesFormatted(): Promise<void> {
    const count = await this.vehicleCards.count();
    const pattern = new RegExp(testData.viewRegistration.patterns.deliveryDate);
    for (let i = 0; i < count; i += 1) {
      const value = await this.cardFieldValue(
        this.vehicleCards.nth(i),
        testData.viewRegistration.fields.purchaseDate,
      ).textContent();
      expect((value ?? '').trim()).toMatch(pattern);
    }
  }

  async expectVehicleImagesOrPlaceholders(): Promise<void> {
    const count = await this.vehicleCards.count();
    for (let i = 0; i < count; i += 1) {
      const image = this.cardImage(this.vehicleCards.nth(i));
      if ((await image.count()) > 0) {
        const box = await image.boundingBox();
        expect(box?.width ?? 0).toBeGreaterThan(0);
      }
    }
  }

  async captureRegisteredSerialNumbers(): Promise<string[]> {
    const count = await this.vehicleCards.count();
    const serials: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const value = await this.cardFieldValue(
        this.vehicleCards.nth(i),
        testData.viewRegistration.fields.serialNumber,
      ).textContent();
      if (value) serials.push(value.trim());
    }
    return serials;
  }

  async tabUntilFocused(locator: Locator, maxTabs = 25): Promise<void> {
    for (let i = 0; i < maxTabs; i += 1) {
      if (await locator.evaluate((el) => document.activeElement === el)) {
        return;
      }
      await this.page.keyboard.press('Tab');
    }
    await expect(locator).toBeFocused();
  }
}
