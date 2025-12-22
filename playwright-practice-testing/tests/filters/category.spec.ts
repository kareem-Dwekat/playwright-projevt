import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Category Filter', () => {
  test('Filters products by selected category', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();

    const category = 'Hammer'; 

    const beforeTitles = await products.getVisibleProductTitles();

    await products.filterByCategory(category);

    await expect.poll(async () => {
        const t = await products.getVisibleProductTitles();
        return t.length;
    }).toBeGreaterThan(0);

    const afterTitles = await products.getVisibleProductTitles();
    expect(afterTitles.length).toBeLessThanOrEqual(beforeTitles.length);

    await products.unfilterByCategory(category);

    await expect.poll(async () => {
        const titles = await products.getVisibleProductTitles();
        return titles.length;
    }).toBeGreaterThan(0);
  });
});