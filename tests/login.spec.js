const { test, expect } = require('@playwright/test');
const LoginPage = require('./pages/LoginPage').default || require('./pages/LoginPage');

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('1. Успешный вход с валидными данными', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('user1@test.com', 'user123');

    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(loginPage.toastMessage).toBeVisible();
  });

  test('2. Вход с невалидным email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('not-an-email', 'user123');

    await expect(loginPage.toastMessage).toBeVisible();
  });

  test('3. Вход с пустыми полями', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.submitBtn.click();

    await expect(loginPage.emailErrorMessage).toBeVisible();
    await expect(loginPage.passwordErrorMessage).toBeVisible();
  });

  test('4. Вход с неверным паролем', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('user1@test.com', 'wrong-password-123');

    await expect(loginPage.toastMessage).toBeVisible();
  });

  test('5. Проверка кнопки "Войти"', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await expect(loginPage.submitBtn).toBeVisible();
    await expect(loginPage.submitBtn).toBeEnabled();
  });

  test('6. Переход на страницу регистрации', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await expect(loginPage.registerLink).toBeVisible();
    await loginPage.registerLink.click();

    await expect(page).toHaveURL(/.*register/);
  });
});
