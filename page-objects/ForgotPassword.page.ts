import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: testData.ui.forgotPasswordHeading });
    this.emailInput = page.locator("//main//input[@id='email' or @name='email']");
    this.submitButton = page.getByRole('button', { name: '確認' });
    this.backToLoginLink = page.getByRole('link', { name: '← ログイン画面に戻る' });
  }

  async expectOnForgotPasswordPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(testData.routes.forgotPassword));
    await expect(this.heading).toBeVisible();
  }
}
