const tracer = require('tracer');

// disable/enable based on enviroment and debug settings
const DEV = process.env.DEBUG || process.env.NODE_ENV !== "production";

const tracerOptions = {
    format: [
        "{{title}}: {{message}} (in {{file}}:{{line}})",
        {
            info: "{{title}}: {{message}}",
            warn: "{{title}}: {{timestamp}} {{message}} (in {{file}}:{{line}})",
            // error: "{{title}}: {{timestamp}} {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}"
        }
    ],
    dateformat: "HH:MM:ss.L",
    level: DEV ? 1 : 4,
    preprocess: function (data) {
        data.title = data.title.toUpperCase();
    }
};

// export the logger
module.exports = DEV ?
    tracer.colorConsole(tracerOptions) :
    tracer.console(tracerOptions);
