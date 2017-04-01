"use strict";
// load env config
require('dotenv').config();
// load flightplan library
const plan = require("flightplan");

const WEB_ROOT = "/var/www/upload-bro-bot";

// create a server target
plan.target("production", {
    host: "uploadbro.com",
    // host: "146.185.168.27",
    webRoot: WEB_ROOT,
    username: 'root',
    password: process.env.SSH_REMOTE_PASSWORD
});

// main update task
plan.remote("update", (remote) => {
    // move to correct context
    remote.with(`cd ${WEB_ROOT}`, () => {
        // fetch latest changes
        remote.log("Git fetch all");
        remote.sudo("git fetch --all");

        // git reset hard to latest master
        remote.log("Git fetch all");
        remote.sudo("git reset --hard origin/master");

        // update yarn packages
        remote.log("Update yarn packages");
        remote.sudo("yarn");
    });

});

// create a new webpack build for client-side
plan.remote("build", (remote) => {
    // move to correct context
    remote.with(`cd ${WEB_ROOT}`, () => {
        // building a new release for client side
        remote.log("Creating new webpack build");
        remote.sudo("npm run build-silent");
    });
});

// restart the node server with pm2
plan.remote("restart", (remote) => {
    // update yarn packages
    remote.log("Restarting server");
    remote.sudo("pm2 restart upload-bro-bot");
});

