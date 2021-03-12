const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config()
AWS.config.update({ region: "us-east-1" });
const spacesEndpoint = new AWS.Endpoint('https://nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
});

const UpLoadFileImage = (fileName) => {
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
        ACL: "private"
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        fs.unlinkSync(fileName);
        console.log(`File uploaded successfully. ${data.Location}`);
    });
}

module.exports = UpLoadFileImage;
