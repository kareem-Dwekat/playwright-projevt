import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Sort Feature', () => {
  test('User can sort products by Name (A - Z)', async ({ page }) => {
    const products = new ProductsPage(page);

   
    await products.goto();

    await products.sortByNameAZ();

   
    const titles = await products.getVisibleProductTitles();

   
    const sorted = [...titles].sort((a, b) =>
      a.localeCompare(b)
    );

    expect(titles).toEqual(sorted);
  });
});