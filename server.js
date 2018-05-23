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
const fs = require('fs')

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

/**
 * Start Express server.
 */
app.listen(config.PORT, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), config.PORT, config.ENV);
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
