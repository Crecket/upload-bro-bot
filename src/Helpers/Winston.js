const winston = require('winston');
winston.level = process.env.DEBUG ? "debug" : "error";
module.exports = winston;