'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({region: 'eu-west-1'});

module.exports = async (event) => {
    let url;

    const {queryStringParameters} = event;
    const {name} = queryStringParameters;

    if (!name) {
        return {
            statusCode: 400,
            headers: {'Access-Control-Allow-Origin': '*'},
            body: 'Bad request. Please provide file name'
        }
    }

    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `uploaded/${name}`,
        Expires: 60
    };

    url = s3.getSignedUrl('getObject', params);

    if (url) {
        return {
            statusCode: 200,
            headers: {'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify(url)
        }
    }
    else {
        return {
            statusCode: 500,
            headers: {'Access-Control-Allow-Origin': '*'},
            body: 'Bad request'
        }
    }


}
