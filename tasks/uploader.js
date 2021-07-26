const AWS = require('aws-sdk');
const fs = require('fs').promises;
require('dotenv').config()
AWS.config.update({ region: "us-east-1" });
const spacesEndpoint = new AWS.Endpoint('https://leftrightjs.nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
});

const UpLoadFileImage = async (fileName) => {
    const fileContent = await fs.readFile(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
        ACL: "private"
    };
    try {
        // Uploading files to the bucket
        await s3.upload(params).promise()
        await fs.unlink(fileName);
    } catch (error) {
        console.log("Failed to upload")
    }

}

module.exports = UpLoadFileImage;
