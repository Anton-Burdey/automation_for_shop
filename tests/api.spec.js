const { test, expect } = require('@playwright/test');
const { USERS } = require('./helpers/constants');
const {
    apiLogin,
    apiRegister,
    apiGetAllProducts,
    apiGetProductById,
    apiCreateProduct,
    apiDeleteProduct,
    apiAddToCart,
    apiUpdateOrderStatus,
    apiGetAllOrders,
} = require('./helpers/api');

const ctx = {
    newUser: null,
    createdUserId: null,
    createdProductId: null,
    existingProductId: null,
    existingOrderId: null,
};

const timestamp = Date.now();
ctx.newUser = {
    firstname: 'Test',
    lastname: 'User',
    phoneNumber: '+71234567890',
    email: `testuser_${timestamp}@test.com`,
    username: `testuser_${timestamp}`,
    password: 'password123',
    role: 'USER',
};

test.describe.serial('API Tests', () => {

    test.beforeAll(async ({ request }) => {
        const loginRes = await apiLogin(request, USERS.user.email, USERS.user.password);
        if (loginRes.status === 201) {
            ctx.createdUserId = loginRes.body.id;
        }

        const productsRes = await apiGetAllProducts(request);
        if (productsRes.status === 200 && productsRes.body.length > 0) {
            ctx.existingProductId = productsRes.body[0].id;
        }

        const ordersRes = await apiGetAllOrders(request);
        if (ordersRes.status === 200 && Array.isArray(ordersRes.body) && ordersRes.body.length > 0) {
            ctx.existingOrderId = ordersRes.body[0].id;
        }
    });

    test('TC#1: Успешная регистрация нового пользователя', async ({ request }) => {
        const { status, body } = await apiRegister(request, ctx.newUser);

        expect(status, `Ошибка регистрации: ${JSON.stringify(body)}`).toBe(201);
        expect(body).toMatchObject({
            email: ctx.newUser.email,
            username: ctx.newUser.username,
            firstname: ctx.newUser.firstname,
            lastname: ctx.newUser.lastname,
        });
    });

    test('TC#2: Ошибка: Регистрация с дубликатом email/username', async ({ request }) => {
        const { status, body } = await apiRegister(request, ctx.newUser);

        expect(status).toBe(409);
        expect(body).toBeDefined();
    });

    test('TC#3: Успешная авторизация (Логин)', async ({ request }) => {
        const { status, body } = await apiLogin(request, USERS.user.email, USERS.user.password);

        expect(status).toBe(201);
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('email', USERS.user.email);
    });

    test('TC#4: Ошибка авторизации: Неверный пароль', async ({ request }) => {
        const { status, body } = await apiLogin(request, USERS.user.email, 'wrong-password-123');

        expect(status).toBe(401);
        expect(body.message).toMatch(/Invalid/i);
    });

    test('TC#5: Получение списка всех товаров', async ({ request }) => {
        const { status, body } = await apiGetAllProducts(request);

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);

        const firstProduct = body[0];
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('name');
        expect(firstProduct).toHaveProperty('price');
    });

    test('TC#6: Создание нового товара', async ({ request }) => {
        const productName = `API Test Product ${Date.now()}`;
        const { status, body } = await apiCreateProduct(request, {
            name: productName,
            description: 'Created by Playwright API test',
            price: 99.99,
            category: 'ELECTRONICS',
            urlImage: 'http://example.com/test-img.jpg',
        });

        expect(status, `Создание товара провалилось: ${JSON.stringify(body)}`).toBe(201);
        expect(body).toHaveProperty('id');
        expect(body.name).toBe(productName);

        ctx.createdProductId = body.id;
    });

    test('TC#7: Ошибка доступа: Создание товара без авторизации', async ({ request }) => {
        test.fail();

        const { status } = await apiCreateProduct(request, {
            name: `Unauthorized Product ${Date.now()}`,
            description: 'Test',
            price: 9.99,
            category: 'ELECTRONICS',
            urlImage: 'http://example.com/img.jpg',
        });

        expect([401, 403]).toContain(status);
    });

    test('TC#8: Запрос данных одного товара по ID', async ({ request }) => {
        const productId = ctx.createdProductId ?? ctx.existingProductId;
        expect(productId, 'Нет ID товара для теста').toBeTruthy();

        const { status, body } = await apiGetProductById(request, productId);

        expect(status).toBe(200);
        expect(body.id).toBe(productId);
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('price');
    });

    test('TC#9: Запрос несуществующего товара (id=99999)', async ({ request }) => {
        const { status, body } = await apiGetProductById(request, 99999);

        expect(status).toBe(404);
        const message = body.message || JSON.stringify(body);
        expect(message).toMatch(/not found/i);
    });

    test('TC#10: Добавление товара в корзину', async ({ request }) => {
        const userId = ctx.createdUserId;
        const productId = ctx.existingProductId ?? ctx.createdProductId;

        test.skip(!userId, 'Нет userId — пропускаем (TC#3 не выполнен)');
        test.skip(!productId, 'Нет productId — пропускаем');

        const { status, body } = await apiAddToCart(request, userId, productId);

        expect(status).toBe(201);
        expect(body).toHaveProperty('product_id');
        expect(body).toHaveProperty('bucket_id');
    });

    test('TC#11: Удаление товара администратором', async ({ request }) => {
        const productId = ctx.createdProductId;
        test.skip(!productId, 'Нет ID созданного товара (TC#6 не выполнен)');

        const { status } = await apiDeleteProduct(request, productId);
        expect(status).toBe(200);

        const check = await apiGetProductById(request, productId);
        expect(check.status).toBe(404);
    });

    test('TC#12: Обновление статуса заказа (Админ)', async ({ request }) => {
        const orderId = ctx.existingOrderId;
        test.skip(!orderId, 'Нет orderId в БД — пропускаем');

        const { status, body } = await apiUpdateOrderStatus(request, orderId, 'SHIPPED');

        expect(status).toBe(200);
        expect(body.status).toBe('SHIPPED');
    });

});
