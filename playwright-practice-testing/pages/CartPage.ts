import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForCart() {
    await expect(this.page).toHaveURL(/\/checkout/i, { timeout: 15000 });
    await expect(this.page.locator('table')).toBeVisible({ timeout: 15000 });
  }

  async removeProductByTitle(title: string) {
    await this.waitForCart();

    // الصف الذي يحتوي اسم المنتج
    const row = this.page.locator('tr', {
      has: this.page.locator('[data-test="product-title"]', { hasText: title }),
    });

    await expect(row).toBeVisible({ timeout: 15000 });

    // زر الحذف (a.btn.btn-danger)
    const removeBtn = row.locator('a.btn.btn-danger');

    await expect(removeBtn).toBeVisible({ timeout: 15000 });
    await removeBtn.click();
  }

  async expectProductNotInCart(title: string) {
    await expect(
      this.page.locator('[data-test="product-title"]', { hasText: title })
    ).toHaveCount(0, { timeout: 15000 });
  }
}