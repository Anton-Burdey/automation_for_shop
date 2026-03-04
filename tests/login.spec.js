const { test, expect } = require('@playwright/test');
const { BASE_URL, USERS } = require('./constants');
const LoginPage = require('./pages/LoginPage').default || require('./pages/LoginPage');

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('1. Успешный вход с валидными данными', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.user.email, USERS.user.password);

    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(loginPage.toastMessage).toBeVisible();
  });

  test('2. Вход с невалидным email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('not-an-email', USERS.user.password);

    await expect(loginPage.toastMessage).toBeVisible();
  });

  test('3. Вход с пустыми полями', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.clickBtn(loginPage.submitBtn, 'Submit button');

    await expect(loginPage.emailErrorMessage).toBeVisible();
    await expect(loginPage.passwordErrorMessage).toBeVisible();
  });

  test('4. Вход с неверным паролем', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.user.email, 'wrong-password-123');

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
    await loginPage.clickBtn(loginPage.registerLink, 'Register link');

    await expect(page).toHaveURL(/.*register/);
  });
});
