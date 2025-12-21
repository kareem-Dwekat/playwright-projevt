import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Brand Filter', () => {
  test('Filters products by selected brand', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();

    const beforeTitles = await products.getVisibleProductTitles();
    expect(beforeTitles.length).toBeGreaterThan(0);

    const brand = await products.getFirstAvailableBrandName();

    await products.filterByBrand(brand);

    await expect.poll(async () => {
      return await products.isBrandChecked(brand);
    }, { timeout: 10000 }).toBeTruthy();

    const afterTitles = await products.getVisibleProductTitles();
    expect(afterTitles.length).toBeGreaterThan(0);
    expect(afterTitles.length).toBeLessThanOrEqual(beforeTitles.length);

    await products.unfilterByBrand(brand);

    await expect.poll(async () => {
      const titles = await products.getVisibleProductTitles();
      return titles.length;
    }).toBeGreaterThan(0);
  });
});
