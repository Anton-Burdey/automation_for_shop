const BASE_API_URL = 'http://localhost:3000';

async function apiLogin(request, email, password) {
    const response = await request.post(`${BASE_API_URL}/auth/login`, {
        data: { email, password },
    });
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiRegister(request, userData) {
    const response = await request.post(`${BASE_API_URL}/auth/register`, {
        data: userData,
    });
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiGetAllProducts(request) {
    const response = await request.get(`${BASE_API_URL}/product`);
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiGetProductById(request, productId) {
    const response = await request.get(`${BASE_API_URL}/product/${productId}`);
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiCreateProduct(request, productData) {
    const response = await request.post(`${BASE_API_URL}/product`, {
        data: productData,
    });
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiDeleteProduct(request, productId) {
    const response = await request.delete(`${BASE_API_URL}/product/${productId}`);
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiAddToCart(request, userId, productId) {
    const response = await request.post(`${BASE_API_URL}/bucket/${userId}/addProduct`, {
        data: { productId },
    });
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiUpdateOrderStatus(request, orderId, status) {
    const response = await request.patch(`${BASE_API_URL}/order/${orderId}/status`, {
        data: { status },
    });
    const body = await response.json();
    return { status: response.status(), body };
}

async function apiGetAllOrders(request) {
    const response = await request.get(`${BASE_API_URL}/order`);
    const body = await response.json();
    return { status: response.status(), body };
}

module.exports = {
    BASE_API_URL,
    apiLogin,
    apiRegister,
    apiGetAllProducts,
    apiGetProductById,
    apiCreateProduct,
    apiDeleteProduct,
    apiAddToCart,
    apiUpdateOrderStatus,
    apiGetAllOrders,
};
