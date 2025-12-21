import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Search Filter', () => {
  test('Search products by keyword', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();

    await expect.poll(async () => {
        const t = await products.getVisibleProductTitles();
        return t.length;
    }).toBeGreaterThan(0);

    const beforeTitles = await products.getVisibleProductTitles();
    const query = await products.pickSearchKeywordFromFirstTitle();
    console.log(`Searching for: ${query}`);

    await products.search(query);

    const afterTitles = await products.getVisibleProductTitles();
    expect(afterTitles.length).toBeGreaterThan(0);
    
    const hasMatch = afterTitles.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    expect(hasMatch).toBeTruthy();

    await products.clearSearch();

    await expect.poll(async () => {
      const finalTitles = await products.getVisibleProductTitles();
      return finalTitles.length;
    }).toBeGreaterThan(0);
  });
});