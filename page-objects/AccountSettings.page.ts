import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';

export type ProfileFormData = {
  firstName?: string;
  lastName?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  gender?: string;
  phone?: string;
  postalCode?: string;
  prefecture?: string;
  municipality?: string;
  streetAddress?: string;
  buildingName?: string;
};

export type ProfileSnapshot = Required<ProfileFormData> & {
  email: string;
  membershipNumber: string;
  membershipRegistrationDate: string;
};

export class AccountSettingsPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly memberInfoSection: Locator;
  readonly otherInfoSection: Locator;
  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly returnToMyPageLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthYearSelect: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthDaySelect: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly postalCodeInput: Locator;
  readonly postalLookupButton: Locator;
  readonly prefectureSelect: Locator;
  readonly municipalityInput: Locator;
  readonly streetAddressInput: Locator;
  readonly buildingNameInput: Locator;
  readonly membershipNumberValue: Locator;
  readonly membershipDateValue: Locator;

  constructor(page: Page) {
    const ui = testData.accountSettings.ui;
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: ui.pageHeading });
    this.memberInfoSection = page.getByText(ui.memberInfoSection, { exact: true });
    this.otherInfoSection = page.getByText(ui.otherInfoSection, { exact: true });
    this.editButton = page.getByRole('button', { name: ui.editButton });
    this.saveButton = page.getByRole('button', { name: ui.saveButton });
    this.cancelButton = page.getByRole('button', { name: ui.cancelButton });
    this.returnToMyPageLink = page.getByRole('link', { name: ui.returnToMyPageLink });
    this.firstNameInput = page.locator("//input[@id='input-firstName']");
    this.lastNameInput = page.locator("//input[@id='input-lastName']");
    this.birthYearSelect = page.locator("//select[@name='birthYear']");
    this.birthMonthSelect = page.locator("//select[@name='birthMonth']");
    this.birthDaySelect = page.locator("//select[@name='birthDay']");
    this.emailInput = page.locator("//input[@id='settings-email']");
    this.phoneInput = page.locator("//input[@id='settings-phone']");
    this.postalCodeInput = page.locator("//input[@name='postalCode']");
    this.postalLookupButton = page.getByRole('button', { name: testData.registration.ui.postalLookupButton });
    this.prefectureSelect = page.locator("//select[@name='prefecture']");
    this.municipalityInput = page.locator("//input[@id='input-city']");
    this.streetAddressInput = page.locator("//input[@id='input-address1']");
    this.buildingNameInput = page.locator("//input[@id='input-address2']");
    this.membershipNumberValue = page
      .locator(`//p[text()='${ui.membershipNumberLabel}']/following-sibling::p[1]`);
    this.membershipDateValue = page
      .locator(`//p[text()='${ui.membershipDateLabel}']/following-sibling::p[1]`);
  }

  genderRadio(label: string): Locator {
    return this.page.locator(`//input[@id='settings-gender-${label}']`);
  }

  fieldError(message: string): Locator {
    return this.page.locator(`//*[@role='alert' and contains(.,'${message}')]`).first();
  }

  successToast(): Locator {
    return this.page.getByRole('alert').filter({
      hasText: testData.accountSettings.messages.success,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto(testData.routes.settings);
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.pageHeading).toBeVisible();
  }

  async enterEditMode(): Promise<void> {
    if (await this.saveButton.isVisible()) {
      return;
    }
    await this.editButton.click();
    await expect(this.saveButton).toBeVisible();
  }

  async cancelEdit(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.editButton).toBeVisible();
  }

  async fillForm(data: ProfileFormData): Promise<void> {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.birthYear) await this.birthYearSelect.selectOption(data.birthYear);
    if (data.birthMonth) await this.birthMonthSelect.selectOption(data.birthMonth);
    if (data.birthDay) await this.birthDaySelect.selectOption(data.birthDay);
    if (data.gender) await this.genderRadio(data.gender).check();
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.postalCode !== undefined) await this.postalCodeInput.fill(data.postalCode);
    if (data.prefecture) await this.prefectureSelect.selectOption(data.prefecture);
    if (data.municipality !== undefined) await this.municipalityInput.fill(data.municipality);
    if (data.streetAddress !== undefined) await this.streetAddressInput.fill(data.streetAddress);
    if (data.buildingName !== undefined) await this.buildingNameInput.fill(data.buildingName);
  }

  async clearAllGenderSelections(): Promise<void> {
    await this.page.evaluate(() => {
      document.querySelectorAll<HTMLInputElement>('input[name="gender"]').forEach((el) => {
        el.checked = false;
      });
    });
  }

  async submit(): Promise<void> {
    await this.saveButton.click();
  }

  async submitTwice(): Promise<void> {
    await this.saveButton.dblclick();
  }

  async readProfileSnapshot(): Promise<ProfileSnapshot> {
    const genderLabels = ['男性', '女性', 'その他', '回答しない'];
    let gender = '';
    for (const label of genderLabels) {
      if (await this.genderRadio(label).isChecked()) {
        gender = label;
        break;
      }
    }
    return {
      firstName: await this.firstNameInput.inputValue(),
      lastName: await this.lastNameInput.inputValue(),
      birthYear: await this.birthYearSelect.inputValue(),
      birthMonth: await this.birthMonthSelect.inputValue(),
      birthDay: await this.birthDaySelect.inputValue(),
      gender,
      email: await this.emailInput.inputValue(),
      phone: await this.phoneInput.inputValue(),
      postalCode: await this.postalCodeInput.inputValue(),
      prefecture: await this.prefectureSelect.locator('option:checked').textContent() ?? '',
      municipality: await this.municipalityInput.inputValue(),
      streetAddress: await this.streetAddressInput.inputValue(),
      buildingName: await this.buildingNameInput.inputValue(),
      membershipNumber: (await this.membershipNumberValue.textContent())?.trim() ?? '',
      membershipRegistrationDate: (await this.membershipDateValue.textContent())?.trim() ?? '',
    };
  }

  async restoreProfile(data: ProfileSnapshot): Promise<void> {
    await this.goto();
    await this.enterEditMode();
    await this.fillForm({
      firstName: data.firstName,
      lastName: data.lastName,
      birthYear: data.birthYear,
      birthMonth: data.birthMonth,
      birthDay: data.birthDay,
      gender: data.gender,
      phone: data.phone,
      postalCode: data.postalCode,
      prefecture: data.prefecture,
      municipality: data.municipality,
      streetAddress: data.streetAddress,
      buildingName: data.buildingName,
    });
    await this.submit();
    await this.expectSaveSuccess();
  }

  repeatChar(char: string, count: number): string {
    return char.repeat(count);
  }

  async expectOnSettingsPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(testData.routes.settings));
    await expect(this.pageHeading).toBeVisible();
  }

  async expectMemberSectionsVisible(): Promise<void> {
    await expect(this.memberInfoSection).toBeVisible();
    await expect(this.otherInfoSection).toBeVisible();
    await expect(this.editButton).toBeVisible();
    await this.page.waitForTimeout(10000);
  }

  async expectViewMode(): Promise<void> {
    await expect(this.editButton).toBeVisible();
    await expect(this.saveButton).toBeHidden();
  }

  async expectEditMode(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.firstNameInput).not.toHaveAttribute('readonly', '');
  }

  async expectMembershipFieldsReadOnly(): Promise<void> {
    await expect(this.membershipNumberValue).toBeVisible();
    await expect(this.membershipDateValue).toBeVisible();
    const otherSectionInputs = this.otherInfoSection.locator('input, select, textarea');
    await expect(otherSectionInputs).toHaveCount(0);
  }

  async expectMembershipNumberFormat(): Promise<void> {
    const value = (await this.membershipNumberValue.textContent())?.trim() ?? '';
    expect(value).toMatch(new RegExp(testData.accountSettings.patterns.membershipNumber));
  }

  async expectMembershipDateDisplayed(): Promise<void> {
    const value = (await this.membershipDateValue.textContent())?.trim() ?? '';
    expect(value.length).toBeGreaterThan(0);
  }

  async expectFieldErrorVisible(message: string): Promise<void> {
    await expect(this.fieldError(message)).toBeVisible();
  }

  async expectSaveSuccess(): Promise<void> {
    await expect(this.successToast()).toBeVisible();
    await expect(this.editButton).toBeVisible();
  }

  async expectSaveBlocked(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
    await expect(this.successToast()).toBeHidden();
    await this.page.waitForTimeout(10000);
  }

  async expectEmailNotEditable(): Promise<void> {
    await expect(this.emailInput).toBeDisabled();
  }

  async expectInputMaxLength(locator: Locator, max: number): Promise<void> {
    await expect(locator).toHaveAttribute('maxlength', String(max));
  }

  async expectFieldValueLength(locator: Locator, max: number): Promise<void> {
    const value = await locator.inputValue();
    expect(value.length).toBeLessThanOrEqual(max);
  }

  async expectAccessibleFieldNames(): Promise<void> {
    await expect(this.firstNameInput).toHaveAttribute('placeholder', /名/);
    await expect(this.lastNameInput).toHaveAttribute('placeholder', /姓/);
    await expect(this.phoneInput).toHaveAttribute('placeholder', /090/);
    await expect(this.emailInput).toHaveAccessibleName(/メールアドレス/);
    await expect(this.phoneInput).toHaveAccessibleName(/電話番号/);
  }

  async expectPersistedFirstName(expected: string): Promise<void> {
    await this.page.reload();
    await this.expectOnSettingsPage();
    await expect(this.firstNameInput).toHaveValue(expected);
  }
}
