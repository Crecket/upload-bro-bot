const tracer = require("tracer");

// disable/enable based on enviroment and debug settings
const DEV = process.env.DEBUG !== "false";

// prePreocess
const preProcess = data => {
    data.title = data.title.toUpperCase();
    return data;
};

// options
const tracerOptions = {
    format: [
        "{{title}}: {{message}} (in {{file}}:{{line}})",
        {
            info: "{{title}}: {{message}}",
            warn: "{{title}}: {{timestamp}} {{message}} (in {{file}}:{{line}})"
            // error: "{{title}}: {{timestamp}} {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}"
        }
    ],
    dateformat: "HH:MM:ss.L",
    level: DEV ? "trace" : "error",
    preprocess: preProcess
};

// create a new logger using the options
let Logger = tracer.colorConsole(tracerOptions);

// export the preProcess function for testing
Logger.preProcess = preProcess;

//export it
module.exports = Logger;
