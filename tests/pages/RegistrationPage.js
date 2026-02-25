import BasePage from './BasePage.js';

export default class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = 'http://localhost:5173/register';
  }

  get firstNameField() {
    return this.page.getByLabel('Имя');
  }

  get lastNameField() {
    return this.page.getByLabel('Фамилия');
  }

  get emailField() {
    return this.page.getByLabel('Email');
  }

  get usernameField() {
    return this.page.getByLabel('Username');
  }

  get phoneField() {
    return this.page.getByLabel('Телефон');
  }

  get passwordField() {
    return this.page.getByLabel('Пароль');
  }

  get submitBtn() {
    return this.page.getByRole('button', { name: /зарегистрироваться/i });
  }

  async register({ firstName, lastName, email, username, phone, password }) {
    if (firstName !== undefined) await this.firstNameField.fill(firstName);
    if (lastName !== undefined) await this.lastNameField.fill(lastName);
    if (email !== undefined) await this.emailField.fill(email);
    if (username !== undefined) await this.usernameField.fill(username);
    if (phone !== undefined) await this.phoneField.fill(phone);
    if (password !== undefined) await this.passwordField.fill(password);
    await this.submitBtn.click();
  }
}
