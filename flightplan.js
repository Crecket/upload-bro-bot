"use strict";
// load env config
require('dotenv').config();

// load flightplan library
const plan = require("flightplan");
const glob = require('glob');

// server src root
const WEB_ROOT = "/var/www/upload-bro-bot";

// create a server target
plan.target("production", {
    host: "uploadbro.com",
    webRoot: WEB_ROOT,
    username: 'root',
    password: process.env.SSH_REMOTE_PASSWORD
});

// main update task
plan.remote("update", (remote) => {
    // stop server temporarily
    remote.log("Stopping server");
    remote.sudo("pm2 stop upload-bro-bot");

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

        // create a new client production build with webpack
        remote.log("Creating a new client build");
        remote.sudo("npm run build-silent");
    });

    // update yarn packages
    remote.log("Restarting server");
    remote.sudo("pm2 start upload-bro-bot");
});

// main update task
plan.remote("restart", (remote) => {
    // update yarn packages
    remote.log("Restarting server");
    remote.sudo("pm2 start upload-bro-bot");
});

