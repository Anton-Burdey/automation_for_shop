const { test, expect } = require('@playwright/test');
const RegistrationPage =
  require('./pages/RegistrationPage').default || require('./pages/RegistrationPage');

function uniqueEmail() {
  return `user_${Date.now()}@test.com`;
}

function uniqueUsername() {
  return `user_${Date.now()}`;
}

const EXISTING_EMAIL = 'user1@test.com';
const EXISTING_USERNAME = 'user1';

test.describe('Registration page', () => {
  test.beforeEach(async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.navigate();
  });

  test('TC1: Успешная регистрация с валидными данными', async ({ page }) => {
    const reg = new RegistrationPage(page);

    await reg.register({
      firstName: 'Test',
      lastName: 'User',
      email: uniqueEmail(),
      username: uniqueUsername(),
      phone: '+79991234567',
      password: 'Password123!',
    });

    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC2: Регистрация с невалидным Email', async ({ page }) => {
    const reg = new RegistrationPage(page);

    await reg.register({
      firstName: 'Test',
      lastName: 'User',
      email: 'not-an-email',
      username: uniqueUsername(),
      phone: '+79991234567',
      password: 'Password123!',
    });

    await expect(reg.toastMessage).toBeVisible();
    await expect(reg.toastMessage).toContainText('email must be an email');
  });

  test('TC3: Регистрация с существующим Email', async ({ page }) => {
    const reg = new RegistrationPage(page);

    await reg.register({
      firstName: 'Test',
      lastName: 'User',
      email: EXISTING_EMAIL,
      username: uniqueUsername(),
      phone: '+79991234567',
      password: 'Password123!',
    });

    await expect(reg.toastMessage).toBeVisible();
    await expect(reg.toastMessage).toContainText('already exists');
  });

  test('TC4: Регистрация с существующим Username', async ({ page }) => {
    const reg = new RegistrationPage(page);

    await reg.register({
      firstName: 'Test',
      lastName: 'User',
      email: uniqueEmail(),
      username: EXISTING_USERNAME,
      phone: '+79991234567',
      password: 'Password123!',
    });

    await expect(reg.toastMessage).toBeVisible();
  });

  test('TC5: Проверка минимальной длины пароля', async ({ page }) => {
    const reg = new RegistrationPage(page);

    await reg.register({
      firstName: 'Test',
      lastName: 'User',
      email: uniqueEmail(),
      username: uniqueUsername(),
      phone: '+79991234567',
      password: '123',
    });

    await expect(reg.passwordField).toHaveAttribute('aria-invalid', 'true');
  });

  test('TC6: Проверка формата номера телефона', async ({ page }) => {
    const reg = new RegistrationPage(page);

    await reg.register({
      firstName: 'Test',
      lastName: 'User',
      email: uniqueEmail(),
      username: uniqueUsername(),
      phone: '12345',
      password: 'Password123!',
    });

    await expect(reg.toastMessage).toBeVisible();
  });

  test('TC7: Проверка допустимых символов в Username', async ({ page }) => {
    const reg = new RegistrationPage(page);

    await reg.register({
      firstName: 'Test',
      lastName: 'User',
      email: uniqueEmail(),
      username: '@@@###$$$',
      phone: '+79991234567',
      password: 'Password123!',
    });

    await expect(reg.toastMessage).toBeVisible();
  });
});
