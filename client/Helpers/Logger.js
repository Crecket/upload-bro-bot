const log = require('loglevel');

// set logging level based on env
log.setLevel(process.env.DEBUG ? "trace" : "warn");

// export the logger
module.exports = log;
