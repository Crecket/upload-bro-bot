const Winston = require("winston")

// check mode
const DEV = process.env.DEBUG || process.env.NODE_ENV !== "production";

//  create new winston logger
var logger = new Winston.Logger({
    transports: [
        new Winston.transports.Console({
            // set level based on debug mode or node enviroment
            level: DEV ? "debug" : "error",
            handleExceptions: true,
            // show JSON output based on production mode
            json: false,
            colorize: true
        })
    ]
});

module.exports = logger;