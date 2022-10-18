'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

module.exports = async (event) => {
    const data = JSON.parse(event.body);

    const documentClient = new AWS.DynamoDB.DocumentClient();

    const id = uuidv4();

    const productsTableParams = {
        TableName: "products",
        Item: {
            id: id,
            title: data.title,
            description: data.description,
            price: data.price
        }
    };

    const stocksTableParams = {
        TableName: "stocks",
        Item: {
            product_id: id,
            count: data.count,
        }
    };

    let responseBody;
    let statusCode;

    try {
        statusCode = 200;
        await documentClient.put(productsTableParams).promise();
        await documentClient.put(stocksTableParams).promise();

        responseBody = JSON.stringify({id, message: 'product created successfully'});

    } catch (err) {
        responseBody = `Unable to create product: ${err}`;
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
