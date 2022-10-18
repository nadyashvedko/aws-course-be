'use strict';

const AWS = require('aws-sdk');

module.exports = async (event) => {
    const id = event.pathParameters.productId;
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const productsTableParams = {
        TableName: "products",
        Key: {
            "id": id
        }
    };

    const stocksTableParams = {
        TableName: "stocks",
        Key: {
            "product_id": id
        }
    };

    let responseBody;
    let statusCode;

    try {
        statusCode = 200;
        const productsData = await documentClient.get(productsTableParams).promise();
        const stocksData = await documentClient.get(stocksTableParams).promise();

        const filtered = await Promise.all([productsData, stocksData]).then(values => {
            return {...values[0].Item, count: values[1].Item.count}
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
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true
        },
        body: responseBody
    };
};
