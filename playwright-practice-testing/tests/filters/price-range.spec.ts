import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Price Range', () => {
  test('Filters products within selected range', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.goto();

    await expect.poll(async () => {
      const p = await products.getVisibleProductPrices();
      return p.length;
    }, { timeout: 10000 }).toBeGreaterThan(0);

    const beforePrices = await products.getVisibleProductPrices();
    
    const target = beforePrices[0];
    
    const min = Math.floor(target);
    const max = Math.ceil(target + 20); 

    await products.setPriceRange(min, max);

    await expect.poll(async () => {
        const p = await products.getVisibleProductPrices();
        return p.length > 0 && p.every(price => price >= min && price <= max);
    }, {
        message: `Prices should be between ${min} and ${max}`,
        timeout: 10000 
    }).toBeTruthy();

    const prices = await products.getVisibleProductPrices();

    for (const p of prices) {
      expect(p).toBeGreaterThanOrEqual(min);
      expect(p).toBeLessThanOrEqual(max);
    }
  });
});