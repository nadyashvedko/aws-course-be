'use strict';

const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports = async (_event) => {
    const productsTableParams = {
        TableName: "products"
    };

    const stocksTableParams = {
        TableName: "stocks"
    };

    let responseBody;
    let statusCode;

    try {
        statusCode = 200;
        const productsData = await documentClient.scan(productsTableParams).promise();
        const stocksData = await documentClient.scan(stocksTableParams).promise();

        const filtered = await Promise.all([productsData, stocksData]).then(values => {
            return values[0].Items.map(product => {
                return {...product, count: values[1].Items.find(item => item.product_id === product.id).count}
            })
        });

        responseBody = JSON.stringify(filtered);

    } catch (err) {
        responseBody = `Unable to get Products: ${err}`;
        statusCode = 403;
    }

    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true
        },
        body: responseBody
    };
};
