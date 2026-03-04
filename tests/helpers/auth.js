const { expect } = require('@playwright/test');
const { BASE_URL } = require('../constants');
const LoginPage = require('../pages/LoginPage').default || require('../pages/LoginPage');

/**
 * Universal login function
 * @param {import('@playwright/test').Page} page
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 */
async function login(page, credentials) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(credentials.email, credentials.password);
  await expect(page).toHaveURL(`${BASE_URL}/`);
}

module.exports = { login };

