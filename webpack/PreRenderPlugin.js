const fs = require("fs");
const Logger = require("../src/Helpers/Logger");

// debug mode
let DEBUG = false;

// export the plugin
class PreRenderPlugin {
    constructor(
        options = {
            debug: true
        }
    ) {
        DEBUG = options.debug ? options.debug : false;
    }

    // install event
    apply(compiler) {
        // register events
        compiler.plugin("done", this.done);
    }

    // compilation has finished
    done(stats) {
        // new PreRender object
        const PreRender = require("../src/PreRender");
        // new UploadBro object
        const UploadBroObj = require("../src/UploadBro");
        // create and start the app
        const UploadBro = new UploadBroObj(false);
        UploadBro.start().then(Logger.debug).catch(Logger.error);
    }
}
module.exports = PreRenderPlugin;

const test = new PreRenderPlugin();

test.done();
