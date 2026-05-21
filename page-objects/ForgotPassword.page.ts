import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly descriptionText: Locator;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly submitButton: Locator;
  readonly backToLoginLink: Locator;
  readonly resetAcknowledgementToast: Locator;

  constructor(page: Page) {
    const fp = testData.forgotPassword;
    this.page = page;
    this.heading = page.getByRole('heading', { name: testData.ui.forgotPasswordHeading });
    this.descriptionText = page.getByText(fp.ui.descriptionSnippet);
    this.emailInput = page.locator("//input[@id='forgot-email']");
    this.emailError = page.locator(
      "//input[@id='forgot-email']/following-sibling::*[@role='alert']",
    );
    this.submitButton = page.getByRole('button', { name: fp.ui.submitButton });
    this.backToLoginLink = page.getByRole('link', { name: fp.ui.backToLoginLink });
    this.resetAcknowledgementToast = page
      .getByRole('alert')
      .filter({ hasText: fp.messages.resetAcknowledgement })
      .first();
  }

  async goto(): Promise<void> {
    await this.page.goto(testData.routes.forgotPassword);
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.heading).toBeVisible();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async requestReset(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.submit();
  }

  async expectOnForgotPasswordPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(testData.routes.forgotPassword));
    await expect(this.heading).toBeVisible();
    await expect(this.descriptionText).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectEmailRequiredError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText(testData.forgotPassword.messages.emailRequired);
  }

  async expectInvalidEmailFormatError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText(testData.forgotPassword.messages.emailInvalid);
  }

  async expectResetAcknowledgementVisible(): Promise<void> {
    await expect(this.resetAcknowledgementToast).toBeVisible();
  }

  async expectNoResetTokenOnScreen(): Promise<void> {
    const bodyText = await this.page.locator('body').innerText();
    expect(bodyText).not.toMatch(/https?:\/\/[^\s]+reset/i);
    expect(bodyText).not.toMatch(/token=/i);
  }

  async expectUnregisteredExplicitErrorHidden(): Promise<void> {
    await expect(this.page.getByText(/登録されていません|未登録/i)).toBeHidden();
  }
}
