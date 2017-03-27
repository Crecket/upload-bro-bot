const pino = require('pino')();

// disable/enable based on enviroment and debug settings
const DEV = process.env.DEBUG || process.env.NODE_ENV !== "production";

// export the logger
module.exports = pino({
    prettyPrint: {
        levelFirst: true
    },
    level: DEV ? "trace" : "info",
    timestamp: false
});
