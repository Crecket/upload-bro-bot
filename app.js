"use strict";
// load env config
require('dotenv').config();

process.on('unhandledRejection', (reason, promise) =>{
    console.log(reason);
});

// Fix route
global.__base = __dirname + '/';
global.rootRequire = function (name) {
    return require(__dirname + '/' + name);
}

// Load the app
var App = require(__base + 'src/App');
var BotApp = new App(process.env.TELEGRAM_TOKEN);
