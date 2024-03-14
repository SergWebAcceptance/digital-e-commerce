import qs from 'qs';
import axiosClient from './GlobalApi';

const PRODUCTS_URL = `/products?` + qs.stringify({
    fields: ['id', 'slug', 'title', 'description', 'price', 'category'],
    populate: {banner: {fields: ['url']}, files: {fields: ['url']}},
    pagination: { pageSize: 9999},
});

export const getProducts = () => {
    return axiosClient.get(PRODUCTS_URL).then(res => res.data.data);
};

export const getProductsByCategory = async (category) => {
    const products = await getProducts();
    const categoryProducts = products.filter(product => product.attributes.category === category);
    return categoryProducts;
}

export const getProduct = async (slug) => {
    const products = await getProducts();
    
    const product = products.find((product) => product.attributes.slug === slug);
    return product;
} 