import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';

function uniqueEmail() {
  const ts = Date.now();
  return `kareem.${ts}@test.com`;
}

test.describe('Register Feature', () => {
  test('Validation: submit empty shows errors', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();

    await register.submit();

    const errors = page.locator(
      '.invalid-feedback:visible, .text-danger:visible, .alert:visible, [role="alert"]:visible'
    );
    await expect(errors.first()).toBeVisible();
  });

  test('User can register successfully (happy path)', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();

    await register.fillForm({
      firstName: process.env.REGISTER_FIRST_NAME!,
      lastName: process.env.REGISTER_LAST_NAME!,
      dob: process.env.REGISTER_DOB!,
      street: process.env.REGISTER_STREET!,
      postalCode: process.env.REGISTER_POSTAL_CODE!,
      city: process.env.REGISTER_CITY!,
      state: process.env.REGISTER_STATE!,
      countryIndex: Number(process.env.REGISTER_COUNTRY_INDEX),
      phone: process.env.REGISTER_PHONE!,
      email: uniqueEmail(),
      password: process.env.REGISTER_PASSWORD!,
    });

    await register.submit();

    await expect(page).toHaveURL(
      /\/auth\/login|\/auth\/register|\/$/i,
      { timeout: 10000 }
    );

    await expect(
      page.locator('.alert-success, [role="status"], .toast-body, .alert:visible')
    ).toBeVisible({ timeout: 10000 });
  });

  test('Validation: invalid email format', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();

    await register.fillForm({
      firstName: process.env.REGISTER_FIRST_NAME!,
      lastName: process.env.REGISTER_LAST_NAME!,
      dob: process.env.REGISTER_DOB!,
      street: process.env.REGISTER_STREET!,
      postalCode: process.env.REGISTER_POSTAL_CODE!,
      city: process.env.REGISTER_CITY!,
      state: process.env.REGISTER_STATE!,
      countryIndex: Number(process.env.REGISTER_COUNTRY_INDEX),
      phone: process.env.REGISTER_PHONE!,
      email: 'ddd',
      password: process.env.REGISTER_PASSWORD!,
    });

    

    await register.submit();

   await expect(page).toHaveURL(/\/auth\/register/i);

const errors = page.locator(
  '.invalid-feedback:visible, .text-danger:visible, .alert:visible, [role="alert"]:visible'
);
await expect(errors.first()).toBeVisible();
  });
});