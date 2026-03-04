import BasePage from './BasePage.js';

export default class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/';
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
    await this.clickBtn(this.userMenu, 'User menu');
    await this.clickBtn(this.profileSettings, 'Profile settings link');
  }

  async goToOrdersHistory() {
    await this.clickBtn(this.userMenu, 'User menu');
    await this.clickBtn(this.ordersHistory, 'Orders history link');
  }

  async logoutUser() {
    await this.clickBtn(this.userMenu, 'User menu');
    await this.clickBtn(this.logout, 'Logout button');
  }

  async goToAdminPanel() {
    await this.clickBtn(this.adminPanel, 'Admin panel link');
  }
}
