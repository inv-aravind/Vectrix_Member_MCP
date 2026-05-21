import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export class DashboardPage {
  readonly page: Page;
  readonly greetingHeading: Locator;
  readonly membershipNumberLine: Locator;
  readonly accountMenuButton: Locator;
  readonly logoutMenuItem: Locator;
  readonly changePasswordMenuItem: Locator;
  readonly memberInfoSection: Locator;
  readonly memberNameValue: Locator;
  readonly memberEmailValue: Locator;
  readonly memberRegistrationDateValue: Locator;
  readonly vehicleRegistrationCard: Locator;
  readonly inquiryCard: Locator;
  readonly accountSettingsCard: Locator;
  readonly memberPanelAccountSettingsLink: Locator;
  readonly vehicleRegistrationLink: Locator;

  constructor(page: Page) {
    const dashboardUi = testData.dashboard.ui;
    this.page = page;
    this.greetingHeading = page.locator(`//h1[contains(.,'${testData.ui.dashboardGreetingPrefix}')]`);
    this.membershipNumberLine = page.locator(
      `//h1[contains(.,'${testData.ui.dashboardGreetingPrefix}')]/following-sibling::p[contains(.,'${dashboardUi.membershipNumberPrefix}')]`,
    );
    this.accountMenuButton = page.getByRole('button', { name: 'アカウントメニュー' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: testData.ui.logoutMenuText });
    this.changePasswordMenuItem = page.getByRole('menuitem', { name: testData.changePassword.ui.menuItem });
    this.memberInfoSection = page.getByText('会員情報', { exact: true });
    this.memberNameValue = page.locator("//p[text()='お名前']/following-sibling::p[1]");
    this.memberEmailValue = page.locator("//p[text()='メールアドレス']/following-sibling::p[1]");
    this.memberRegistrationDateValue = page.locator(
      `//p[text()='${testData.accountSettings.ui.membershipDateLabel}']/following-sibling::p[1]`,
    );
    this.vehicleRegistrationCard = page.getByRole('link', { name: dashboardUi.vehicleCardLinkName });
    this.inquiryCard = page.getByRole('link', { name: dashboardUi.inquiryCardLinkName });
    this.accountSettingsCard = page.getByRole('link', { name: dashboardUi.accountSettingsCardLinkName });
    this.memberPanelAccountSettingsLink = page.locator(
      "//div[.//text()[normalize-space()='会員情報']]//a[normalize-space()='アカウント設定']",
    );
    this.vehicleRegistrationLink = page.getByRole('link', { name: /車両登録/ });
  }

  async goto(): Promise<void> {
    await this.page.goto(testData.routes.dashboard);
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.greetingHeading).toBeVisible();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${testData.routes.dashboard}$`));
    await expect(this.greetingHeading).toBeVisible();
  }

  async expectLayoutLoaded(): Promise<void> {
    await this.expectOnDashboard();
    await expect(this.membershipNumberLine).toBeVisible();
    await expect(this.memberInfoSection).toBeVisible();
    await expect(this.vehicleRegistrationCard).toBeVisible();
    await expect(this.inquiryCard).toBeVisible();
    await expect(this.accountSettingsCard).toBeVisible();
  }

  async getMembershipNumber(): Promise<string> {
    const text = (await this.membershipNumberLine.textContent())?.trim() ?? '';
    return text.replace(testData.dashboard.ui.membershipNumberPrefix, '').trim();
  }

  async openAccountMenu(): Promise<void> {
    await this.accountMenuButton.click();
    await expect(this.logoutMenuItem).toBeVisible();
  }

  async openChangePasswordModal(): Promise<void> {
    await this.openAccountMenu();
    await this.changePasswordMenuItem.click();
  }

  async logout(): Promise<void> {
    await this.openAccountMenu();
    await this.logoutMenuItem.click();
  }

  async clickVehicleRegistrationCard(): Promise<void> {
    await this.vehicleRegistrationCard.click();
  }

  async clickInquiryCard(): Promise<void> {
    await this.inquiryCard.click();
  }

  async clickAccountSettingsCard(): Promise<void> {
    await this.accountSettingsCard.click();
  }

  async clickMemberPanelAccountSettingsLink(): Promise<void> {
    await this.memberPanelAccountSettingsLink.click();
  }

  async navigateToProtectedVehiclePage(): Promise<void> {
    await this.page.goto(testData.routes.protectedVehicle);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectProtectedContentAccessible(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(testData.routes.protectedVehicle));
    await expect(this.page).not.toHaveURL(new RegExp(`${testData.routes.login}$`));
  }

  async expectMembershipNumberDisplayed(): Promise<void> {
    const value = await this.getMembershipNumber();
    expect(value).toMatch(new RegExp(testData.dashboard.patterns.membershipNumber));
  }

  async expectMembershipNumberEquals(expected: string): Promise<void> {
    await expect(this.membershipNumberLine).toContainText(expected);
  }

  async expectMemberRegistrationDateDisplayed(): Promise<void> {
    await expect(this.memberRegistrationDateValue).toBeVisible();
    const value = (await this.memberRegistrationDateValue.textContent())?.trim() ?? '';
    expect(value).toMatch(/\d{4}年\d{1,2}月/);
  }

  async expectRegistrationDateMatchesSettingsDate(settingsDate: string): Promise<void> {
    const dashboardDate = (await this.memberRegistrationDateValue.textContent())?.trim() ?? '';
    const parsed = new Date(settingsDate);
    const expected = `${parsed.getFullYear()}年${parsed.getMonth() + 1}月`;
    expect(dashboardDate).toBe(expected);
  }

  async expectGreetingFullName(firstName: string, lastName: string): Promise<void> {
    await expect(this.greetingHeading).toContainText(firstName);
    await expect(this.greetingHeading).toContainText(lastName);
    await expect(this.greetingHeading).toContainText('さん');
  }

  async expectMemberNameFullName(firstName: string, lastName: string): Promise<void> {
    await expect(this.memberNameValue).toHaveText(`${firstName} ${lastName}`);
  }

  async expectMemberNameContains(firstName: string, lastName: string): Promise<void> {
    await expect(this.memberNameValue).toContainText(firstName);
    await expect(this.memberNameValue).toContainText(lastName);
  }

  async expectMemberEmail(email: string): Promise<void> {
    await expect(this.memberEmailValue).toHaveText(email);
  }

  async expectGreetingContains(firstName: string): Promise<void> {
    await expect(this.greetingHeading).toContainText(firstName);
  }

  async expectOnVehicleRegistrationPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${testData.routes.protectedVehicle}$`));
    await expect(
      this.page.getByRole('heading', { name: testData.dashboard.ui.vehiclePageHeading }),
    ).toBeVisible();
  }

  async expectOnInquiryPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${testData.routes.contact}$`));
    await expect(
      this.page.getByRole('heading', { level: 1, name: testData.dashboard.ui.inquiryPageHeading }),
    ).toBeVisible();
  }

  async expectOnAccountSettingsPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${testData.routes.settings}$`));
    await expect(
      this.page.getByRole('heading', { level: 1, name: testData.accountSettings.ui.pageHeading }),
    ).toBeVisible();
  }
}
