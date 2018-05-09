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

app.use(express.static('public'))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

app.get('/getBuckets', (req, res) => {
  const buckets = [];
  Object.keys(config).map((elm) => {
    if (elm.substring(0, 9) === 'S3_BUCKET') {
      buckets.push(elm);
    }
  });
  res.status(200).json({
    buckets
  });
});

app.post('/saveFile', (req, res) => {
  console.log(req.body);
});

/**
 * Start Express server.
 */
app.listen(config.PORT, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), config.PORT, config.ENV);
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
