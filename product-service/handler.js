'use strict';

const PRODUCTS_MOCK = require('./products-mock');

module.exports.getProductsList = async (_event) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(PRODUCTS_MOCK.PRODUCTS_MOCK),
    };
};


module.exports.getProductsById = async (event) => {
    const id = event.pathParameters.productId;

    const product = PRODUCTS_MOCK.PRODUCTS_MOCK.find(product => product.id === id);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(product),
    };
};

