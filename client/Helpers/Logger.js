/* eslint-disable no-console */

// disable/enable based on enviroment and debug settings
const DEV = process.env.DEBUG || process.env.NODE_ENV !== "production";

// polyfill to not handle log requests
const polyfill = () => {
};

// the logger object
const logger = {
    debug: DEV ? console.debug : polyfill,
    log: DEV ? console.log : polyfill,
    info: DEV ? console.info : polyfill,
    error: console.error
}

module.exports = logger;