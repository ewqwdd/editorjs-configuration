import AWS from "aws-sdk"

const SESConfig = {
    apiVersion: 'latest',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    
}
console.log("yo")
AWS.config.update(SESConfig);

export const s3 = new AWS.S3()