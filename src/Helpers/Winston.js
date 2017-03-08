const winston = require('winston');
// set level based on debug mode or node enviroment
winston.level = process.env.DEBUG || process.env.NODE_ENV !== "production" ? "debug" : "error";
module.exports = winston;