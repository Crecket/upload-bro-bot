/* eslint-disable no-console */

// disable/enable based on enviroment and debug settings
const productionMode = process.env.DEBUG || process.env.NODE_ENV !== "production";

// polyfill to not handle log requests
const polyfill = () => {
};

// the logger object
const logger = {
    debug: productionMode ? console.debug : polyfill,
    log: productionMode ? console.log : polyfill,
    info: productionMode ? console.info : polyfill,
    error: console.error
}

module.exports = logger;