import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dob: Locator;
  readonly street: Locator;
  readonly postalCode: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly phone: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly registerBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstName = page.getByLabel(/first name/i);
    this.lastName = page.getByLabel(/last name/i);
    this.dob = page.getByLabel(/date of birth/i);
    this.street = page.getByLabel(/street/i);
    this.postalCode = page.getByLabel(/postal code/i);
    this.city = page.getByLabel(/^city$/i);
    this.state = page.getByLabel(/state/i);
    this.country = page.locator('#country');
    this.phone = page.getByLabel(/phone/i);
    this.email = page.getByLabel(/email/i);
    this.password = page.getByLabel(/password/i);

    this.registerBtn = page.getByRole('button', { name: /register/i });
  }

  async goto() {
    await this.page.goto('/auth/register');
    await expect(this.page.getByRole('heading', { name: /customer registration/i })).toBeVisible();
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    dob: string;           
    street: string;
    postalCode: string;
    city: string;
    state: string;
    countryIndex?: number; 
    phone: string;
    email: string;
    password: string;
  }) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.dob.fill(data.dob);
    await this.street.fill(data.street);
    await this.postalCode.fill(data.postalCode);
    await this.city.fill(data.city);
    await this.state.fill(data.state);

    if (data.countryIndex !== undefined) {
      await this.country.selectOption({ index: data.countryIndex });
    } else {
      await this.country.selectOption({ index: 1 }); // أول دولة بعد placeholder
    }

    await this.phone.fill(data.phone);
    await this.email.fill(data.email);
    await this.password.fill(data.password);
  }

  async submit() {
    await this.registerBtn.click();
  }
}