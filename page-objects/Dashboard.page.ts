import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export class DashboardPage {
  readonly page: Page;
  readonly greetingHeading: Locator;
  readonly accountMenuButton: Locator;
  readonly logoutMenuItem: Locator;
  readonly changePasswordMenuItem: Locator;
  readonly memberInfoSection: Locator;
  readonly vehicleRegistrationLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.greetingHeading = page.locator(`//h1[contains(.,'${testData.ui.dashboardGreetingPrefix}')]`);
    this.accountMenuButton = page.getByRole('button', { name: 'アカウントメニュー' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: testData.ui.logoutMenuText });
    this.changePasswordMenuItem = page.getByRole('menuitem', { name: testData.changePassword.ui.menuItem });
    this.memberInfoSection = page.getByText('会員情報', { exact: true });
    this.vehicleRegistrationLink = page.getByRole('link', { name: /車両登録/ });
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${testData.routes.dashboard}`));
    await expect(this.greetingHeading).toBeVisible();
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

  async navigateToProtectedVehiclePage(): Promise<void> {
    await this.page.goto(testData.routes.protectedVehicle);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectProtectedContentAccessible(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(testData.routes.protectedVehicle));
    await expect(this.page).not.toHaveURL(new RegExp(`${testData.routes.login}$`));
  }
}
