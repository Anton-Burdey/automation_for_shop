import BasePage from './BasePage.js';

export default class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.url = 'http://localhost:5173/';
  }

  get orders() {
    return this.page.locator('a[href="/orders"]');
  }

  get cart() {
    return this.page.locator('a[href="/cart"]');
  }

  get userMenu() {
    return this.page.locator('//a[@href="/cart"]/following-sibling::button');
  }

  get profileSettings() {
    return this.page.locator('a[href="/profile"]');
  }

  get ordersHistory() {
    return this.page.locator('a[href="/profile"]+a');
  }

  get logout() {
    return this.page.locator('//a[@href="/profile"]/following-sibling::div[@role="menuitem"]');
  }

  get adminPanel() {
    return this.page.locator('a[href="/admin"]');
  }

  productCardByName(name) {
    return this.page.locator('a').filter({ hasText: name });
  }

  addToCartButtonByProductName(name) {
    return this.productCardByName(name).getByRole('button', { name: /в корзину/i });
  }

  async goToProfileSettings() {
    await this.userMenu.click();
    await this.profileSettings.click();
  }

  async goToOrdersHistory() {
    await this.userMenu.click();
    await this.ordersHistory.click();
  }

  async logoutUser() {
    await this.userMenu.click();
    await this.logout.click();
  }

  async goToAdminPanel() {
    await this.adminPanel.click();
  }
}
