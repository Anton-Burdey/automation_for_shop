const LoginPage =
  require('../pages/LoginPage').default || require('../pages/LoginPage');

async function login(page, email, password) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(email, password);
}

async function loginAsUser(page) {
  await login(
    page,
    process.env.TEST_USER_EMAIL || 'user1@test.com',
    process.env.TEST_USER_PASSWORD || 'user123',
  );
}

async function loginAsAdmin(page) {
  await login(
    page,
    process.env.ADMIN_USER_EMAIL || 'admin@test.com',
    process.env.ADMIN_USER_PASSWORD || 'admin123',
  );
}

module.exports = { login, loginAsUser, loginAsAdmin };

