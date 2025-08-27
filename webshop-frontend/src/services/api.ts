import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Configure axios to include cookies with all requests
axios.defaults.withCredentials = true;

// Shopping Cart API
export const createCart = async (userEmail: string) => {
    const response = await axios.post(`${API_BASE_URL}/cart`, null, {
        params: { userEmail }
    });
    return response.data;
};

export const getCart = async (cartId: number) => {
    const response = await axios.get(`${API_BASE_URL}/cart/${cartId}`);
    return response.data;
};

export const addProductToCart = async (cartId: number, productId: number, quantity: number) => {
    const response = await axios.post(`${API_BASE_URL}/cart/add`, null, {
        params: { cartId, productId, quantity }
    });
    return response.data;
};

export const removeProductFromCart = async (cartId: number, productId: number) => {
    const response = await axios.post(`${API_BASE_URL}/cart/remove`, null, {
        params: { cartId, productId }
    });
    return response.data;
};

export const updateProductQuantity = async (cartId: number, productId: number, quantity: number) => {
    const response = await axios.post(`${API_BASE_URL}/cart/update`, null, {
        params: { cartId, productId, quantity }
    });
    return response.data;
};

export const clearCart = async (cartId: number) => {
    await axios.post(`${API_BASE_URL}/cart/clear`, null, {
        params: { cartId }
    });
};

// Product API
export const getAllProducts = async () => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
};

export const searchProducts = async (name?: string, category?: string) => {
    const params: { [key: string]: string | undefined } = {};
    if (name) params.name = name;
    if (category) params.category = category;

    const response = await axios.get(`${API_BASE_URL}/products/search`, { params });
    return response.data;
};

// Type definitions for API responses
interface OrderResponse {
    id: number;
    customerEmail: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    orderLines: any[];
}

// Order API
export const confirmOrder = async (cartId: number, userEmail: string): Promise<OrderResponse> => {
    const response = await axios.post(`${API_BASE_URL}/orders/confirm`, null, {
        params: { cartId, userEmail }
    });
    return response.data;
};

// Order Summary API
export const getOrderSummary = async (orderId: string) => {
    const response = await axios.get(`${API_BASE_URL}/order-summary/${orderId}`);
    return response.data;
};

// Auth API
export const login = async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/login`, null, {
        params: { email }
    });
    return response.data;
};
