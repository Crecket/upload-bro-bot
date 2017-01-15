"use strict";
// load env config
require('dotenv').config()

var App = require('./src/App');

var BotApp = new App(process.env.TELEGRAM_TOKEN);
