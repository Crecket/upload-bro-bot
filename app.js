"use strict";
// load env config
require('dotenv').config();
const Logger = require('./src/Helpers/Logger');

// unhandledrejection listener
process.on('unhandledRejection', (reason, promise) => {
    Logger.error(reason);
});

// Fix route
global.__base = __dirname + '/';
global.rootRequire = function (name) {
    return require(__dirname + '/' + name);
}

// Load the app
const App = require(__base + 'src/App');
new App(process.env.TELEGRAM_TOKEN);
