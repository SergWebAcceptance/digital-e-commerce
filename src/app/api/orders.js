import axiosClient from './GlobalApi';

export const createOrder = (data) => {
    return axiosClient.post('/orders', data);
};

export const getOrders = () => {
    return axiosClient.get('/orders?populate[products][populate]=*').then(res => res.data.data);
};

export const getOrdersByUser = async (email) => {
    const orders = await getOrders();
    const orderByUser = orders.filter(order => order.attributes.email === email);
    return orderByUser;
};