import BasePage from './BasePage.js';

export default class AdminPanelPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/admin';
  }

  get goods() {
    return this.page.locator('a[href="/admin/products"]');
  }

  get storage() {
    return this.page.locator('a[href="/admin/warehouses"]');
  }

  get adminOrders() {
    return this.page.locator('a[href="/admin/orders"]');
  }

  get createProductButton() {
    return this.page.getByRole('button', { name: /создать товар/i });
  }

  get productsTableRows() {
    return this.page.locator('table tbody tr');
  }

  productRowByName(name) {
    return this.page.locator('table tbody tr').filter({ hasText: name });
  }

  deleteButtonInRowByName(name) {
    return this.productRowByName(name).getByRole('button', { name: /удалить/i });
  }

  get createWarehouseButton() {
    return this.page.getByRole('button', { name: /создать склад/i });
  }

  get warehousesTableRows() {
    return this.page.locator('table tbody tr');
  }

  orderRowById(id) {
    return this.page.locator('table tbody tr').filter({ hasText: `#${id} ` });
  }

  statusSelectInOrderRow(id) {
    return this.orderRowById(id).locator('select').or(
      this.orderRowById(id).getByRole('combobox')
    );
  }

  async goToGoods() {
    await this.goods.click();
  }

  async goToStorage() {
    await this.storage.click();
  }

  async goToAdminOrders() {
    await this.adminOrders.click();
  }
}
