"use strict";
// load env config
require('dotenv').config()

function requestLogger(httpModule) {
    var original = httpModule.request
    httpModule.request = function (options, callback) {
        console.log(options.href || options.proto + "://" + options.host + options.path, options.method)
        return original(options, callback)
    }
}

requestLogger(require('http'))
requestLogger(require('https'))

var App = require('./src/App');

var BotApp = new App(process.env.TELEGRAM_TOKEN);
