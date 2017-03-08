const winston = require('winston');

// set level based on debug mode or node enviroment
if (process.env.DEBUG || process.env.NODE_ENV !== "production") {
    winston.level = "error";
} else {
    winston.level = "debug";
}

module.exports = winston;