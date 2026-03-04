import BasePage from './BasePage.js';

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/login';
  }

  get submitBtn() {
    return this.page.locator('//button[text()="Войти"]');
  }

  get emailField() {
    return this.page.locator('[name="email"]');
  }

  get passwordField() {
    return this.page.locator('[name="password"]');
  }

  get emailLabel() {
    return this.page.locator('//label[text()="Email"]');
  }

  get passwordLabel() {
    return this.page.locator('//label[text()="Пароль"]');
  }

  get emailErrorMessage() {
    return this.page.locator('//p[text()="Email обязателен"]');
  }

  get passwordErrorMessage() {
    return this.page.locator('//p[text()="Пароль обязателен"]');
  }

  get registerLink() {
    return this.page.locator('a[href="/register"]');
  }

  async login(email, password) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.clickBtn(this.submitBtn, 'Login button');
  }
}
