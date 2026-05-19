import { test as base } from '@playwright/test';
import { LoginPage } from '../page-objects/Login.page';
import { DashboardPage } from '../page-objects/Dashboard.page';
import { ForgotPasswordPage } from '../page-objects/ForgotPassword.page';
import { RegisterPage } from '../page-objects/Register.page';

import { ChangePasswordPage } from '../page-objects/ChangePassword.page';
import { AccountSettingsPage } from '../page-objects/AccountSettings.page';

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  forgotPasswordPage: ForgotPasswordPage;
  registerPage: RegisterPage;
  changePasswordPage: ChangePasswordPage;
  accountSettingsPage: AccountSettingsPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  changePasswordPage: async ({ page }, use) => {
    await use(new ChangePasswordPage(page));
  },
  accountSettingsPage: async ({ page }, use) => {
    await use(new AccountSettingsPage(page));
  },
});

export { expect } from '@playwright/test';
