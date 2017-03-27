const pino = require('pino');

// check mode
const DEV = process.env.DEBUG || process.env.NODE_ENV !== "production";

// export the logger
module.exports = pino({
    prettyPrint: {
        levelFirst: true
    },
    level: DEV ? "trace" : "info",
    timestamp: false
});
