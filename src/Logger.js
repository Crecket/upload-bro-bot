module.exports = {
    debug: process.env.DEBUG === "true" ? console.log : () => {
        },
    log: console.log,
    warn: console.log,
    error: console.error,
};