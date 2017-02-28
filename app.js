"use strict";
// load env config
require('dotenv').config();

// set these values to boolean
process.env.DEBUG = process.env.DEBUG === "true";
process.env.EXPRESS_USE_SSL = process.env.EXPRESS_USE_SSL === "true";

// Fix route
global.__base = __dirname + '/';
global.rootRequire = function (name) {
    return require(__dirname + '/' + name);
}

// Load the app
var App = require(__base + 'src/App');
var BotApp = new App(process.env.TELEGRAM_TOKEN);
