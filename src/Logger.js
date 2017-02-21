var readline = require('readline');

module.exports = {
    debug: process.env.DEBUG === "true" ? console.log : () => {
        },
    log: console.log,
    warn: console.log,
    error: console.error,
    write: (text) => {
        process.stdout.write(text);
    },
    overwrite: (text) => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(text);
    }
};