import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly loginHeading: Locator;
  readonly welcomeHeading: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly invalidCredentialsToast: Locator;
  readonly passwordVisibilityToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("//input[@id='email']");
    this.passwordInput = page.locator("//input[@id='password']");
    this.loginButton = page.locator("//button[contains(.,'ログイン')]");
    this.forgotPasswordLink = page.getByRole('link', { name: testData.ui.forgotPasswordLinkText });
    this.registerLink = page.getByRole('link', { name: testData.ui.registerLinkText });
    this.loginHeading = page.getByRole('heading', { name: testData.ui.loginHeading });
    this.welcomeHeading = page.getByRole('heading', { name: testData.ui.welcomeHeading });
    this.emailError = page.locator("//input[@id='email']/following-sibling::*[@role='alert']");
    this.passwordError = page.locator("//input[@id='password']/parent::*/following-sibling::*[@role='alert']");
    this.invalidCredentialsToast = page.getByRole('alert').filter({ hasText: testData.messages.invalidCredentials }).first();
    this.passwordVisibilityToggle = page.locator("//input[@id='password']/following-sibling::button");
    this.memberBenefitsHeading = page.getByRole('heading', { name: '会員特典' });
  }

  async goto(): Promise<void> {
    await this.page.goto(testData.routes.login);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async submitWithEnter(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${testData.routes.login}$`));
    await expect(this.loginHeading).toBeVisible();
  }

  async expectEmailRequiredError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText(testData.messages.emailRequired);
  }

  async expectPasswordRequiredError(): Promise<void> {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText(testData.messages.passwordRequired);
  }

  async expectInvalidEmailFormatError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText(testData.messages.invalidEmailFormat);
  }

  async expectInvalidCredentialsMessage(): Promise<void> {
    await expect(this.invalidCredentialsToast).toBeVisible();
  }

  async expectMandatoryElementsVisible(): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.loginHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.registerLink).toBeVisible();
    await expect(this.memberBenefitsHeading).toBeVisible();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(this.memberBenefitsHeading).toBeInViewport();
  }

  async tabUntilFocused(locator: Locator, maxTabs = 15): Promise<void> {
    for (let i = 0; i < maxTabs; i += 1) {
      if (await locator.evaluate((el) => document.activeElement === el)) {
        return;
      }
      await this.page.keyboard.press('Tab');
    }
    await expect(locator).toBeFocused();
  }

  async expectLoginFormKeyboardOrder(): Promise<void> {
    await this.tabUntilFocused(this.emailInput);
    await this.page.keyboard.press('Tab');
    await expect(this.passwordInput).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.passwordVisibilityToggle).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.forgotPasswordLink).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.loginButton).toBeFocused();
  }
}
