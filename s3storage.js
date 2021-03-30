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

  fs.readFile(file, async (err, data) => {
//   const fileType = await FileType.fromBuffer(data)
//   console.log('--->filetype', fileType);
//   const formatType = ['text/csv']
   if (err) throw err;
  //  s3.upload(params, function(s3Err, data) {
  //      if (s3Err) throw s3Err
  //      console.log(`File uploaded successfully at ${data.Location}`)
  //  });
  const folder = `${131313131222}/flightInfo`

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
});


//   if (_.indexOf(formatType, fileType.mime) === -1) {
//     fs.unlinkSync(file) // file removed
//     throw new Error('Bad request Error');
//   }

}


module.exports = {
  s3Upload
};
