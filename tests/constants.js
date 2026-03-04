const BASE_URL = 'http://localhost:5173';

const USERS = {
    admin: {
        email: process.env.ADMIN_USER_EMAIL || 'admin@test.com',
        password: process.env.ADMIN_USER_PASSWORD || 'admin123',
    },
    user: {
        email: process.env.TEST_USER_EMAIL || 'user1@test.com',
        password: process.env.TEST_USER_PASSWORD || 'user123',
    },
    existing: {
        email: 'user1@test.com',
        username: 'user1',
    }
};

module.exports = { BASE_URL, USERS };
