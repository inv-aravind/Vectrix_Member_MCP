import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../data/testData.json';
import { buildRegistrationEmail } from '../utils/registrationEmail';

export type RegistrationFormData = {
  firstName?: string;
  lastName?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  gender?: string;
  email?: string;
  phone?: string;
  postalCode?: string;
  prefecture?: string;
  municipality?: string;
  streetAddress?: string;
  buildingName?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
};

export class RegisterPage {
  readonly page: Page;
  readonly registrationHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthYearSelect: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthDaySelect: Locator;
  readonly emailInput: Locator;
  readonly emailHelperText: Locator;
  readonly phoneInput: Locator;
  readonly postalCodeInput: Locator;
  readonly postalLookupButton: Locator;
  readonly prefectureSelect: Locator;
  readonly municipalityInput: Locator;
  readonly streetAddressInput: Locator;
  readonly buildingNameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly confirmPasswordVisibilityToggle: Locator;
  readonly termsCheckbox: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly submitButton: Locator;
  readonly headerLoginLink: Locator;
  readonly footerLoginLink: Locator;
  readonly successHeading: Locator;
  readonly passwordRuleIndicators: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.registrationHeading = page.getByRole('heading', { name: '新規会員登録' });
    this.firstNameInput = page.locator("//input[@id='input-firstName']");
    this.lastNameInput = page.locator("//input[@id='input-lastName']");
    this.birthYearSelect = page.locator("//select[@name='birthYear']");
    this.birthMonthSelect = page.locator("//select[@name='birthMonth']");
    this.birthDaySelect = page.locator("//select[@name='birthDay']");
    this.emailInput = page.locator("//input[@id='reg-email']");
    this.emailHelperText = page.getByText(testData.registration.messages.emailHelper);
    this.phoneInput = page.locator("//input[@id='reg-phone']");
    this.postalCodeInput = page.locator("//input[@name='postalCode']");
    this.postalLookupButton = page.getByRole('button', { name: testData.registration.ui.postalLookupButton });
    this.prefectureSelect = page.locator("//select[@name='prefecture']");
    this.municipalityInput = page.locator("//input[@id='input-city']");
    this.streetAddressInput = page.locator("//input[@id='input-address1']");
    this.buildingNameInput = page.locator("//input[@id='input-address2']");
    this.passwordInput = page.locator("//input[@id='reg-password']");
    this.confirmPasswordInput = page.locator("//input[@id='reg-confirm']");
    this.passwordVisibilityToggle = page.locator("//input[@id='reg-password']/following-sibling::button");
    this.confirmPasswordVisibilityToggle = page.locator("//input[@id='reg-confirm']/following-sibling::button");
    this.termsCheckbox = page.locator("//input[@id='agree']");
    this.termsLink = page.getByRole('link', { name: testData.registration.ui.termsLink });
    this.privacyLink = page.getByRole('link', { name: testData.registration.ui.privacyLink });
    this.submitButton = page.locator(`//button[contains(.,'${testData.registration.ui.submitButton}')]`);
    this.headerLoginLink = page.getByRole('link', { name: testData.registration.ui.headerLoginLink });
    this.footerLoginLink = page.getByRole('link', { name: testData.registration.ui.footerLoginLink, exact: true });
    this.successHeading = page.getByRole('heading', { name: testData.registration.messages.successHeading });
    this.passwordRuleIndicators = {
      minLength: page.getByText(testData.registration.passwordRules.minLength),
      lowercase: page.getByText(testData.registration.passwordRules.lowercase),
      uppercase: page.getByText(testData.registration.passwordRules.uppercase),
      digit: page.getByText(testData.registration.passwordRules.digit),
      special: page.getByText(testData.registration.passwordRules.special),
    };
  }

  genderRadio(label: string): Locator {
    return this.page.getByRole('radio', { name: label });
  }

  fieldError(message: string): Locator {
    return this.page.locator(`//*[@role='alert' and contains(.,'${message}')] | //*[contains(@class,'text-danger') and contains(.,'${message}')]`).first();
  }

  sectionMessage(message: string): Locator {
    return this.page.getByText(message, { exact: false }).first();
  }

  buildDefaultFormData(overrides: RegistrationFormData = {}): Required<RegistrationFormData> {
    const defaults = testData.registration.defaults;
    const password = process.env.REGISTRATION_PASSWORD ?? testData.registration.validPassword;
    return {
      firstName: defaults.firstName,
      lastName: defaults.lastName,
      birthYear: defaults.birthYear,
      birthMonth: defaults.birthMonth,
      birthDay: defaults.birthDay,
      gender: defaults.gender,
      email: buildRegistrationEmail(),
      phone: defaults.phone,
      postalCode: defaults.postalCode,
      prefecture: defaults.prefecture,
      municipality: defaults.municipality,
      streetAddress: defaults.streetAddress,
      buildingName: defaults.buildingName,
      password,
      confirmPassword: password,
      agreeTerms: true,
      ...overrides,
    };
  }

  async goto(): Promise<void> {
    await this.page.goto(testData.routes.register);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillForm(data: RegistrationFormData): Promise<void> {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.birthYear) await this.birthYearSelect.selectOption(data.birthYear);
    if (data.birthMonth) await this.birthMonthSelect.selectOption(data.birthMonth);
    if (data.birthDay) await this.birthDaySelect.selectOption(data.birthDay);
    if (data.gender) await this.genderRadio(data.gender).check();
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.postalCode !== undefined) await this.postalCodeInput.fill(data.postalCode);
    if (data.prefecture) await this.prefectureSelect.selectOption(data.prefecture);
    if (data.municipality !== undefined) await this.municipalityInput.fill(data.municipality);
    if (data.streetAddress !== undefined) await this.streetAddressInput.fill(data.streetAddress);
    if (data.buildingName !== undefined) await this.buildingNameInput.fill(data.buildingName);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.confirmPassword !== undefined) await this.confirmPasswordInput.fill(data.confirmPassword);
    if (data.agreeTerms !== undefined) {
      await this.termsCheckbox.setChecked(data.agreeTerms);
    }
  }

  async fillValidForm(overrides: RegistrationFormData = {}): Promise<Required<RegistrationFormData>> {
    const data = this.buildDefaultFormData(overrides);
    await this.fillForm(data);
    return data;
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async register(data: RegistrationFormData): Promise<void> {
    await this.fillForm(data);
    await this.submit();
  }

  async registerWithValidDefaults(overrides: RegistrationFormData = {}): Promise<Required<RegistrationFormData>> {
    const data = await this.fillValidForm(overrides);
    await this.submit();
    return data;
  }

  async triggerPostalLookup(): Promise<void> {
    await this.postalLookupButton.click();
  }

  async expectOnRegisterPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(testData.routes.register));
    await expect(this.registrationHeading).toBeVisible();
  }

  async expectScrolledToTop(): Promise<void> {
    const scrollY = await this.page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  }

  async expectRegistrationSuccess(email?: string): Promise<void> {
    await expect(this.successHeading).toBeVisible();
    await expect(this.page.getByText(testData.registration.messages.successBodySnippet)).toBeVisible();
    if (email) {
      await expect(this.page.getByText(email)).toBeVisible();
    }
  }

  async expectMessageVisible(message: string): Promise<void> {
    await expect(this.sectionMessage(message)).toBeVisible();
  }

  async expectFieldErrorVisible(message: string): Promise<void> {
    await this.page.waitForTimeout(10000);
    await expect(this.fieldError(message)).toBeVisible();
  }

  async expectNoGenderSelected(): Promise<void> {
    for (const gender of ['男性', '女性', 'その他', '回答しない']) {
      await expect(this.genderRadio(gender)).not.toBeChecked();
    }
  }

  async expectLatestBirthYear(expectedYear: string): Promise<void> {
    const options = await this.birthYearSelect.locator('option').allTextContents();
    const years = options.filter((value) => /^\d{4}$/.test(value.trim()));
    expect(years[0]).toBe(expectedYear);
  }

  async expectPasswordMasked(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  async expectConfirmPasswordMasked(): Promise<void> {
    await expect(this.confirmPasswordInput).toHaveAttribute('type', 'password');
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordVisibilityToggle.click();
  }

  async toggleConfirmPasswordVisibility(): Promise<void> {
    await this.confirmPasswordVisibilityToggle.click();
  }

  async expectAccessibleNames(): Promise<void> {
    await expect(this.firstNameInput).toHaveAttribute('placeholder', /名/);
    await expect(this.lastNameInput).toHaveAttribute('placeholder', /姓/);
    await expect(this.emailInput).toHaveAttribute('type', 'email');
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    await expect(this.confirmPasswordInput).toHaveAttribute('type', 'password');
  }

  repeatChar(char: string, count: number): string {
    return char.repeat(count);
  }
}
