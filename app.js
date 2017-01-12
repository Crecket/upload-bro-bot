"use strict";
// load env config
require('dotenv').config()

var DropboxApp = require('./src/DropboxApp');

var bot = new DropboxApp(process.env.TELEGRAM_TOKEN);
