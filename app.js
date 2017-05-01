"use strict";
// load env config
require('dotenv').config();
require("babel-register");
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
const UploadBro = require('./src/UploadBro');
const App = new UploadBro();

// start Uploadbro
App.start().then(Logger.debug).catch(Logger.error);
