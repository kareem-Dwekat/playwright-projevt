import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly title: Locator;
  readonly addToCartBtn: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.locator('h1');
    this.addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    this.cartLink = page.locator('[data-test="nav-cart"], a[href="/checkout"]');
  }

  async gotoBySlug(slug: string) {
    await this.page.goto(`/product/${slug}`);
    await expect(this.title).toBeVisible({ timeout: 15000 });
  }

  async getTitle(): Promise<string> {
    return (await this.title.innerText()).trim();
  }

  async addToCart() {
    await expect(this.addToCartBtn).toBeVisible({ timeout: 15000 });
    await this.addToCartBtn.click();
  }

  async openCart() {
    await this.cartLink.first().click();

    await expect(
      this.page.getByText(/^CART$/i)
    ).toBeVisible({ timeout: 15000 });
  }
}