const { test, expect } = require('@playwright/test');
const HomePage = require('./pages/HomePage').default || require('./pages/HomePage');
const AdminPanelPage =
  require('./pages/AdminPanelPage').default || require('./pages/AdminPanelPage');
const { loginAsUser, loginAsAdmin } = require('./helpers/auth');

test.describe('Shop & Admin panel', () => {
  test('TC1: Добавление товара в корзину из Каталога', async ({ page }) => {
    await loginAsUser(page);

    const homePage = new HomePage(page);
    const productName = 'iPhone 15 Pro';

    await homePage.addToCartButtonByProductName(productName).click();

    await expect(homePage.cart).toBeVisible();
  });

  test('TC2: Переход в панель управления (Админ-панель)', async ({ page }) => {
    await loginAsAdmin(page);

    const homePage = new HomePage(page);
    await homePage.goToAdminPanel();

    const adminPanel = new AdminPanelPage(page);
    await expect(page).toHaveURL(/\/admin/);
    await expect(adminPanel.goods).toBeVisible();
    await expect(adminPanel.storage).toBeVisible();
    await expect(adminPanel.adminOrders).toBeVisible();
  });

  test('TC3: Создание нового товара', async ({ page }) => {
    await loginAsAdmin(page);

    const adminPanel = new AdminPanelPage(page);
    await adminPanel.navigate();
    await adminPanel.goToGoods();

    await adminPanel.createProductButton.click();

    const timestamp = Date.now();
    const name = `Test Product ${timestamp}`;

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Название').fill(name);
    await dialog.getByLabel('Описание').fill('Test Description');
    await dialog.getByLabel('Цена').fill('');
    await dialog.getByLabel('Цена').fill('999');
    await dialog.getByLabel('URL Изображения').fill('http://example.com/image.jpg');

    await dialog.getByRole('combobox').first().click();
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    await page.getByRole('option').first().click();
    await page.getByRole('listbox').waitFor({ state: 'hidden' });

    await dialog.getByRole('button', { name: /сохранить/i }).click({ force: true });

    await expect(page.getByText('Товар успешно создан')).toBeVisible();

    await expect(adminPanel.productRowByName(name)).toBeVisible({ timeout: 15000 });
  });

  test('TC4: Удаление товара из списка', async ({ page }) => {
    await loginAsAdmin(page);

    const adminPanel = new AdminPanelPage(page);
    await adminPanel.navigate();
    await adminPanel.goToGoods();

    // Создаем тестовый товар для удаления, чтобы не зависеть от состояния
    await adminPanel.createProductButton.click();

    const timestamp = Date.now();
    const productName = `Product for deletion ${timestamp}`;

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('Название').fill(productName);
    await dialog.getByLabel('Описание').fill('Test Description');
    await dialog.getByLabel('Цена').fill('');
    await dialog.getByLabel('Цена').fill('999');
    await dialog.getByLabel('URL Изображения').fill('http://example.com/image.jpg');

    await dialog.getByRole('combobox').first().click();
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    await page.getByRole('option').first().click();
    await page.getByRole('listbox').waitFor({ state: 'hidden' });

    await dialog.getByRole('button', { name: /сохранить/i }).click({ force: true });
    await expect(page.getByText('Товар успешно создан')).toBeVisible();

    // Находим созданный товар и удаляем его
    const productRow = adminPanel.productRowByName(productName);
    await expect(productRow).toBeVisible({ timeout: 15000 });

    await adminPanel.deleteButtonInRowByName(productName).click();

    const confirmButton = page.getByRole('button', { name: /подтвердить|да|ok/i });
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }

    await expect(productRow).toHaveCount(0);
  });

  test('TC5: Создание нового склада', async ({ page }) => {
    await loginAsAdmin(page);

    const adminPanel = new AdminPanelPage(page);
    await adminPanel.navigate();
    await adminPanel.goToStorage();

    await adminPanel.createWarehouseButton.click();

    const timestamp = Date.now();
    const name = `Склад ${timestamp}`;
    const address = `Тестовый адрес ${timestamp}`;

    await page.getByLabel('Название склада').fill(name);
    await page.getByLabel('Адрес').fill(address);
    await page.getByRole('button', { name: /сохранить/i }).click({ force: true });

    await expect(page.getByText('Склад создан')).toBeVisible();

    await expect(adminPanel.warehousesTableRows.filter({ hasText: name })).toBeVisible();
  });

  test('TC6: Изменение статуса заказа', async ({ page }) => {
    await loginAsAdmin(page);

    const adminPanel = new AdminPanelPage(page);
    await adminPanel.navigate();
    await adminPanel.goToAdminOrders();

    const orderId = '2';
    const targetStatus = 'DELIVERED';

    const orderRow = adminPanel.orderRowById(orderId);
    await expect(orderRow).toBeVisible();

    const statusCombobox = orderRow.getByRole('combobox');
    await statusCombobox.click();
    await page.getByRole('option', { name: targetStatus }).click();

    await expect(orderRow.filter({ hasText: targetStatus })).toBeVisible();

    await page.reload();
    await expect(adminPanel.orderRowById(orderId).filter({ hasText: targetStatus })).toBeVisible();
  });
});
