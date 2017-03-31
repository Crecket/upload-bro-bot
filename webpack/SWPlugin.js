const del = require('del');
const glob = require('glob');
const swPrecache = require('sw-precache');
const SWHelper = require('./SWHelper');

// folder constants
const PUBLIC_DIR = 'public';
const CLIENT_DIR = 'client';

// debug mode?
let DEBUG = false;

// global variable to store the emitted files
let afterEmitFiles = [];

// delete all the dist files
const deleteBuildFiles = (callback) => {
    del([
        PUBLIC_DIR + "/assets/dist/**/*",
        "!" + PUBLIC_DIR + "/assets/dist",
        "!" + PUBLIC_DIR + "/assets/dist/.gitkeep"
    ]).then((paths) => {
        if (DEBUG) {
            console.log('Removed the following files');
            console.log(paths.join("\n"));
        }
        if (callback) callback();
    }).catch(console.log);
}

// export the plugin
module.exports = class SwPrecache {
    constructor(options = {}) {
        DEBUG = options.debug ? options.debug : false;
    }

    apply(compiler) {
        // run event to clear old files
        // compiler.plugin('run', this.run);

        // after emit to fetch the new file locations
        compiler.plugin('after-emit', this.afterEmit);

        // done event to create a new updated service worker
        compiler.plugin('done', this.done);

        // remove the files onces
        deleteBuildFiles();
    }

    afterEmit(compilation, callback) {
        // reset the after emit list
        afterEmitFiles = [];

        // Explore each chunk (build output):
        compilation.chunks.forEach(function (chunk) {
            // Explore each module within the chunk (built inputs):
            chunk.files.forEach(function (file) {
                // push this file to the list
                afterEmitFiles.push(PUBLIC_DIR + "/" + file);
            });
        });

        callback();
    }

    run(Compiler, callback) {
        deleteBuildFiles(callback);
    }

    // compilation has finished
    done(stats) {
        // create the service worker with our after emit files
        SWHelper(afterEmitFiles);
    }
}

