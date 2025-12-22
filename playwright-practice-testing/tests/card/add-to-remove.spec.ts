import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test('Add then remove (same session)', async ({ page }) => {
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  const slug = '01KD3XSRCPM568CRHZQTR75HQJ';

  await product.gotoBySlug(slug);
  const title = await product.getTitle();

  await product.addToCart();
  await product.openCart();

  await expect(page.locator('[data-test="product-title"]', { hasText: title }))
    .toBeVisible({ timeout: 10000 });

  await cart.removeProductByTitle(title);
  await cart.expectProductNotInCart(title);
});