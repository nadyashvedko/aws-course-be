'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({region: 'eu-west-1'});
const csv = require('csv-parser');

module.exports = async (event) => {
    const parsedCsv = [];
    const {key} = event.Records[0].s3.object;

    const objectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
    }
    const s3Stream = s3.getObject(objectParams).createReadStream();

    for await (const chunk of (s3Stream).pipe(csv())) {
        parsedCsv.push(chunk)
    }

    parsedCsv.forEach(item => console.log(item));

    const objectCopyParams = {
        Bucket: process.env.BUCKET_NAME,
        CopySource: `${process.env.BUCKET_NAME}/${key}`,
        Key: `${key.replace('uploaded', 'parsed')}`,
    }

    await s3.copyObject(objectCopyParams);
    await s3.deleteObject(objectParams);
}
