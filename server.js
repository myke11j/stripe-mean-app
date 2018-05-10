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
// const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs')
var multer = require('multer');

const fileObj = {};

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    fileObj.dir = file.originalname + '-' + Date.now() + `.${file.mimetype.split('/')[1]}`;
    callback(null, fileObj.dir);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

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
// app.use(fileUpload());

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

app.post('/api/upload',function(req,res){
  upload(req,res,function(err) {
      if(err) {
          return res.status(500).json({
            code:500,
            message: 'Unable to upload file'
          });
      }
      const params = {
        ACL: 'public-read',
        Bucket: req.headers.referer.split('?')[1],
        Key: fileObj.dir,
        Body: fs.readFileSync(`uploads/${fileObj.dir}`)
      }
      s3.putObject(params, function(err, data) {
        fs.unlinkSync('uploads/' + fileObj.dir);
        if (err) {
          console.log(err);
          return res.status(500).json({
            code:500,
            message: 'Unable to upload file'
          });
        }
        return res.status(200).json({
          code:200,
          message: 'Successfully uploaded file'
        });
      });
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
