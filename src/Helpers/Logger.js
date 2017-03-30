const pino = require('pino');
const chalk = require('chalk');

// disable/enable based on enviroment and debug settings
const DEV = process.env.DEBUG || process.env.NODE_ENV !== "production";

// value helpers for pretty print
const levelColors = {
    default: chalk.white,
    60: chalk.bgRed,
    50: chalk.red,
    40: chalk.yellow,
    30: chalk.green,
    20: chalk.blue,
    10: chalk.grey
};
const levelLabels = {
    default: 'USERLVL',
    60: 'FATAL',
    50: 'ERROR',
    40: 'WARN',
    30: 'INFO',
    20: 'DEBUG',
    10: 'TRACE'
}

// export the logger
module.exports = pino({
    prettyPrint: DEV ? {
        levelFirst: true,
        formatter: (msg) => {
            // get chalk output bassed on level
            const outputLabel = levelColors[msg.level](levelLabels[msg.level]);
            // combine and return
            return `${outputLabel} ${msg.msg}`;
        }
    } : false,
    level: DEV ? "trace" : "info"
});

// module.exports = {
//     log: console.log,
//     error: console.error,
//     warn: console.log,
//     fatal: console.error,
//     debug: console.log,
//     info: console.log,
// };