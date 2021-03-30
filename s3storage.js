require('dotenv').config()
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const FileType = require('file-type');
// import * as _ from 'lodash';
const _ = require('lodash');
// import path from 'path';
// import { commonLocale } from '../../locales';
// import config from '../../configs';
AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
})
const mainParams = {
  Bucket: process.env.AWS_BUCKET,
};
const s3 = new AWS.S3()

const s3Upload = async (flightId, file) => {
  const data = fs.readFileSync(file);
  const formatType = ['text/csv']
  const fileType = await FileType.fromFile(file);
  console.log('--->file', file);
  console.log('--->fileType', fileType);
//   if (_.indexOf(formatType, fileType.mime) === -1) {
//     fs.unlinkSync(file) // file removed
//     throw new Error('Bad request Error');
//   }
  const folder = `${flightId}/flightInfo`
  const params = {
    ...mainParams,
    Body: data,
    Key: `${folder}/${Date.now()}${path.extname(file)}`,
    // ContentType: fileType.mime,
  }
  return new Promise((resolve, reject) => {
    s3.upload(params, (s3Err, responseData) => {
      if (s3Err) {
        reject(s3Err);
      }
      fs.unlinkSync(file) // file removed
      resolve(responseData);
    });
  })
}


module.exports = {
  s3Upload
};
