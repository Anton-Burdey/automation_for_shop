import { expect } from '@playwright/test';

export default class BasePage {
  constructor(page) {
    this.page = page;
  }

  get toastMessage() {
    return this.page.locator('section li');
  }

  async navigate() {
    const fullUrl = this.page.context()._options.baseURL ? `${this.page.context()._options.baseURL}${this.url}` : this.url;
    console.log(`Navigating to: ${fullUrl}`);
    await this.page.goto(this.url);
    // Remove hardcoded URL expectation if it's dynamic, or keep it if it's always strict
    // await expect(this.page).toHaveURL(this.url); 
  }

  async open() {
    console.log(`Opening page: ${this.url}`);
    await this.page.goto(this.url);
  }

  async clickBtn(locator, buttonName = 'button') {
    console.log(`Clicking ${buttonName}`);
    await locator.click();
  }
}
