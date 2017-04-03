const Logger = require('js-logger');

// set default options along with logLevel
Logger.useDefaults({
    logLevel: process.env.DEBUG ? "debug" : "warning"
});

//export it
module.exports = Logger;
