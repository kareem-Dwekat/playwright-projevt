import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // عناصر الصفحة
    this.emailInput = page.getByLabel(/email address/i);
    this.passwordInput = page.getByLabel(/^password/i);
    this.loginButton = page.getByRole('button', { name: /^login$/i });
  }

  // فتح صفحة Login
  async goto() {
    await this.page.goto('/auth/login');
    await expect(
      this.page.getByRole('heading', { name: /login/i })
    ).toBeVisible();
  }

  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

 
  async submit() {
    await this.loginButton.click();
  }


  async loginAs(email: string, password: string) {
    await this.goto();
    await this.login(email, password);
    await this.submit();
  }
}