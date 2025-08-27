import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Add a specific product to cart
   */
  async addProductToCart(productName: string): Promise<void> {
    await expect(this.page.getByText(productName)).toBeVisible();

    // Find the product and click its Add to Cart button
    if (productName === "Test Product 1") {
      await this.page.getByRole('button', { name: 'Add to Cart' }).first().click();
    } else if (productName === "Test Product 2") {
      await this.page.getByRole('button', { name: 'Add to Cart' }).nth(1).click();
    }

    // Wait for the cart to update - the "Your cart is empty" text should disappear
    await expect(this.page.getByText('Your cart is empty')).not.toBeVisible({ timeout: 10000 });
  }

  /**
   * Check if a product is visible on the page
   */
  async isProductVisible(productName: string): Promise<boolean> {
    try {
      await expect(this.page.getByRole('heading', { name: productName })).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the current cart total
   */
  async getCartTotal(): Promise<string> {
    const totalElement = this.page.getByText(/Total: \$\d+\.\d+/);
    await expect(totalElement).toBeVisible();
    return await totalElement.textContent() || '';
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await this.waitForPageLoad();
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    try {
      await expect(this.page.getByText('Your cart is empty')).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify expected cart total
   */
  async verifyCartTotal(expectedTotal: string): Promise<void> {
    await expect(this.page.getByText(expectedTotal)).toBeVisible();
  }
}
