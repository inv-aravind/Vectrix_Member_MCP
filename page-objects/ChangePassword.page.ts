import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export class ChangePasswordPage {
  readonly page: Page;
  readonly modalHeading: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly currentPasswordToggle: Locator;
  readonly newPasswordToggle: Locator;
  readonly confirmPasswordToggle: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly passwordRuleIndicators: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.modalHeading = page.getByRole('heading', { name: testData.changePassword.ui.modalHeading });
    this.currentPasswordInput = page.locator("//input[@id='chg-current-pw']");
    this.newPasswordInput = page.locator("//input[@id='chg-new-pw']");
    this.confirmPasswordInput = page.locator("//input[@id='chg-confirm-pw']");
    this.currentPasswordToggle = page.locator("//input[@id='chg-current-pw']/following-sibling::button");
    this.newPasswordToggle = page.locator("//input[@id='chg-new-pw']/following-sibling::button");
    this.confirmPasswordToggle = page.locator("//input[@id='chg-confirm-pw']/following-sibling::button");
    this.cancelButton = page.getByRole('button', { name: testData.changePassword.ui.cancelButton });
    this.saveButton = page.getByRole('button', { name: testData.changePassword.ui.saveButton });
    this.passwordRuleIndicators = {
      minLength: page.getByText(testData.registration.passwordRules.minLength),
      lowercase: page.getByText(testData.registration.passwordRules.lowercase),
      uppercase: page.getByText(testData.registration.passwordRules.uppercase),
      digit: page.getByText(testData.registration.passwordRules.digit),
      special: page.getByText(testData.registration.passwordRules.special),
    };
  }

  fieldError(message: string): Locator {
    return this.page.locator(`//*[@role='alert' and contains(.,'${message}')]`).first();
  }

  toastMessage(message: string): Locator {
    return this.page.getByRole('alert').filter({ hasText: message }).first();
  }

  async expectModalVisible(): Promise<void> {
    await expect(this.modalHeading).toBeVisible();
    await expect(this.currentPasswordInput).toBeVisible();
    await expect(this.newPasswordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
  }

  async fillForm(currentPassword: string, newPassword: string, confirmPassword?: string): Promise<void> {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword ?? newPassword);
  }

  async submit(): Promise<void> {
    await this.saveButton.click();
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword?: string): Promise<void> {
    await this.fillForm(currentPassword, newPassword, confirmPassword);
    await this.submit();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.toastMessage(testData.changePassword.messages.success)).toBeVisible();
  }

  async expectFieldErrorVisible(message: string): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.fieldError(message)).toBeVisible();
  }

  async expectToastVisible(message: string): Promise<void> {
    await expect(this.toastMessage(message)).toBeVisible();
  }

  async expectPasswordFieldsMasked(): Promise<void> {
    await expect(this.currentPasswordInput).toHaveAttribute('type', 'password');
    await expect(this.newPasswordInput).toHaveAttribute('type', 'password');
    await expect(this.confirmPasswordInput).toHaveAttribute('type', 'password');
  }

  async toggleCurrentPasswordVisibility(): Promise<void> {
    await this.currentPasswordToggle.click();
  }

  async toggleNewPasswordVisibility(): Promise<void> {
    await this.newPasswordToggle.click();
  }

  async toggleConfirmPasswordVisibility(): Promise<void> {
    await this.confirmPasswordToggle.click();
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

  async expectKeyboardOrder(): Promise<void> {
    await this.tabUntilFocused(this.currentPasswordInput);
    await this.page.keyboard.press('Tab');
    await expect(this.currentPasswordToggle).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.newPasswordInput).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.newPasswordToggle).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.confirmPasswordInput).toBeFocused();
  }
}
