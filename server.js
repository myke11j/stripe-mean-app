/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const chalk = require('chalk')
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: `.env` });
const config = require('./config');

/**
 * Create Express server.
 */

const app = express();

/**
 * Express configuration.
 */

app.use(express.static('public/'))
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

app.get('/getBuckets', (req, res) => {
  const buckets = [];
  Object.keys(process.env).map((elm) => {
    if (elm.substring(0, 9) === 'S3_BUCKET') {
      buckets.push({
        key: elm,
        bucket: process.env[elm]
      });
    }
  });
  res.status(200).json({
    buckets
  });
});

app.post('/upload', (req, res) => {
  console.log(req.body);
  
  var params = {
    Body: req.body.file, 
    Bucket: req.body.bucket, 
    Key: req.body.fileName
   };
   s3.putObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
      ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
      ServerSideEncryption: "AES256", 
      VersionId: "Ri.vC6qVlA4dEnjgRV4ZHsHoFIjqEMNt"
     }
     */
   });
  
});

/**
 * Start Express server.
 */
app.listen(config.PORT, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), config.PORT, config.ENV);
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
