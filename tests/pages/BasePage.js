import { expect } from '@playwright/test';

export default class BasePage {
  constructor(page) {
    this.page = page;
  }

  get toastMessage() {
    return this.page.locator('section li');
  }

  async navigate() {
    await this.page.goto(this.url);
    await expect(this.page).toHaveURL(this.url);
  }

  async open() {
    await this.page.goto(this.url);
  }

  async clickBtn(locator) {
    await locator.click();
  }
}
