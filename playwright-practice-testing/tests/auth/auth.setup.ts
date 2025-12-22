import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';

const authDir = 'playwright/.auth';
const authFile = `${authDir}/user.json`;

setup('login and save session', async ({ page }) => {
  // ✅ تأكد إن مجلد التخزين موجود
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });

  // ✅ تأكد إن الحقول ظهرت قبل التعبئة
  await expect(page.locator('#email')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#password')).toBeVisible({ timeout: 15000 });

  // ✅ تأكد إن المتغيرات موجودة
  expect(process.env.LOGIN_EMAIL, 'LOGIN_EMAIL is missing in .env').toBeTruthy();
  expect(process.env.LOGIN_PASSWORD, 'LOGIN_PASSWORD is missing in .env').toBeTruthy();

  await page.locator('#email').fill(process.env.LOGIN_EMAIL!);
  await page.locator('#password').fill(process.env.LOGIN_PASSWORD!);

  await page.getByRole('button', { name: /login/i }).click();

  
  await expect(page.locator('[data-test="nav-sign-in"]')).toBeHidden({ timeout: 15000 });


  await page.context().storageState({ path: authFile });

 
  expect(fs.existsSync(authFile), `Auth file not created at: ${authFile}`).toBeTruthy();
});