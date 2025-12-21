import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearSearchButton: Locator;
  readonly priceSliders: Locator;
  readonly filtersHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.card').filter({ has: page.locator('.card-img-top') });
    this.searchInput = page.getByPlaceholder('Search');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.clearSearchButton = page.getByRole('button', { name: /^x$/i });
    this.priceSliders = page.locator('.ngx-slider-pointer');
    this.filtersHeading = page.getByRole('heading', { name: /filters/i });
  }

  async goto() {
    const baseUrl = process.env.BASE_URL || 'https://practicesoftwaretesting.com';
    await this.page.goto(baseUrl, { waitUntil: 'networkidle' });
    await this.waitForProducts();
  }

  async waitForProducts() {
    await expect(this.filtersHeading).toBeVisible({ timeout: 30000 });
    await this.page.waitForTimeout(500);
    await expect(this.productCards.first()).toBeVisible({ timeout: 30000 });
  }

  async getVisibleProductTitles(): Promise<string[]> {
    await expect(this.productCards.first()).toBeVisible();
    const titles = this.productCards.locator('.card-title, h5');
    const count = await titles.count();
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      out.push((await titles.nth(i).innerText()).trim());
    }
    return out;
  }

  async getVisibleProductPrices(): Promise<number[]> {
    await expect(this.productCards.first()).toBeVisible();
    const prices = this.productCards.locator('[data-test="product-price"], .card-body .card-text');
    
    if (await prices.count() === 0) {
        await this.page.waitForTimeout(1000);
    }

    const count = await prices.count();
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await prices.nth(i).innerText()).trim();
      const num = Number(text.replace(/[^0-9.]/g, ''));
      if (!Number.isNaN(num)) out.push(num);
    }
    return out;
  }

  private async adjustSlider(slider: Locator, targetValue: number) {
    await slider.focus();
    const currentVal = Number(await slider.getAttribute('aria-valuenow'));
    
    let steps = targetValue - currentVal;
    if (steps === 0) return;

    const key = steps > 0 ? 'ArrowRight' : 'ArrowLeft';
    steps = Math.abs(steps);

    for (let i = 0; i < steps; i++) {
        await this.page.keyboard.press(key);
        if (i % 10 === 0) await this.page.waitForTimeout(10);
    }
    await this.page.waitForTimeout(500); 
  }

  async setPriceRange(minValue: number, maxValue: number) {
    await expect(this.priceSliders).toHaveCount(2, { timeout: 30000 });
    const minSlider = this.priceSliders.first();
    const maxSlider = this.priceSliders.nth(1);

    await this.adjustSlider(minSlider, minValue);
    await this.adjustSlider(maxSlider, maxValue);

    await this.waitForProducts();
  }

  private escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private getCheckboxByLabel(text: string): Locator {
    const safe = this.escapeRegExp(text);
    return this.page
      .locator('label')
      .filter({ hasText: new RegExp(`^\\s*${safe}\\s*$`, 'i') })
      .locator('input[type="checkbox"]')
      .first();
  }

  async filterByBrand(brandName: string) {
    const checkbox = this.getCheckboxByLabel(brandName);
    
    if (!(await checkbox.isChecked())) {
        await checkbox.check({ force: true });
    }
    
    await this.waitForProducts();
  }

  async unfilterByBrand(brandName: string) {
    const checkbox = this.getCheckboxByLabel(brandName);
    
    if (await checkbox.isChecked()) {
        await checkbox.uncheck({ force: true });
    }
    
    await this.waitForProducts();
  }

  async isBrandChecked(brandName: string): Promise<boolean> {
    const checkbox = this.getCheckboxByLabel(brandName);
    return await checkbox.isChecked();
  }

  async filterByCategory(categoryName: string) {
     const checkbox = this.page.getByRole('checkbox', { name: categoryName });
     await checkbox.check({ force: true });
     await this.waitForProducts();
  }

  async unfilterByCategory(categoryName: string) {
    const checkbox = this.page.getByRole('checkbox', { name: categoryName });
    await checkbox.uncheck({ force: true });
    await this.waitForProducts();
  }

  async getFirstAvailableBrandName(): Promise<string> {
    const labels = this.page.locator('.checkbox label');
    const count = await labels.count();
    
    for(let i=0; i<count; i++) {
        const txt = (await labels.nth(i).innerText()).trim();
        if(txt && txt !== 'Search' && txt.length > 2) {
            return txt;
        }
    }
    return 'Hand Tools';
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click({ force: true });
    await this.waitForProducts();
  }

  async clearSearch() {
    await this.clearSearchButton.click({ force: true });
    await this.waitForProducts();
  }

  async pickSearchKeywordFromFirstTitle(): Promise<string> {
    const titles = await this.getVisibleProductTitles();
    const first = (titles[0] || '').trim();
    const parts = first.split(/\s+/).filter(Boolean);
    const pick = parts.find((w) => w.length >= 4) || parts[parts.length - 1] || 'pliers';
    return pick.toLowerCase();
  }
}