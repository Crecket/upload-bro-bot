"use strict";
// load env config
require('dotenv').config();
const Logger = require('./src/Helpers/Logger');

// unhandledrejection listener
process.on('unhandledRejection', (reason, promise) => {
    Logger.error(reason);
});

// Load the app
const UploadBro = require('./src/UploadBro');
const App = new UploadBro();

// start Uploadbro
App.start().then(Logger.debug).catch(Logger.error);
