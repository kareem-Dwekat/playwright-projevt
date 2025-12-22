import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login Feature', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('User can login successfully', async ({ page }) => {
    await login.loginAs(
      process.env.LOGIN_EMAIL!,
      process.env.LOGIN_PASSWORD!
    );

    await expect(
      page.getByRole('link', { name: /sign in/i })
    ).toBeHidden();
  });

  test('Validation: empty login shows errors', async () => {
    await login.submit();

    const errors = login.page.locator(
      '.invalid-feedback:visible, .text-danger:visible, .alert:visible, [role="alert"]:visible'
    );

    await expect(errors.first()).toBeVisible();
  });
});