"use strict";
// load env config
require('dotenv').config();
const Logger = require('./src/Helpers/Logger');

// unhandledrejection listener
process.on('unhandledRejection', (reason, promise) => {
    Logger.error(reason);
});

// Fix route
global.__base = __dirname + '/';
global.rootRequire = function (name) {
    return require(__dirname + '/' + name);
}

// Load the app
const App = require(__base + 'src/App');
new App(process.env.TELEGRAM_TOKEN);


// const BoxSDK = require('box-node-sdk');
// const sdk = new BoxSDK({
//     clientID: process.env.BOX_CLIENT_ID,
//     clientSecret: process.env.BOX_CLIENT_SECRET
// });
// // set the token
// const tokens = {
//     "accessToken": "LOyERjnEErZNf1QfOESzovh3W6cctHGR",
//     "refreshToken": "0S19SdWJdZ5hV4Q0p2v43QnCsv9nfVhOpm5JD2rlxaCIBgt1rOFIq9P7WntygpQv",
//     "accessTokenTTLMS": 3835000,
//     "acquiredAtMS": 1491046341988
// };
//
// const client = sdk.getPersistentClient(tokens, {
//     read: (err, data) => {
//         Logger.debug("read");
//         Logger.debug(err, data);
//     },
//     write: (tokenInfo, data) => {
//         Logger.debug("write");
//         Logger.debug(data);
//     },
//     clear: (err, data) => {
//         Logger.debug("clear");
//         Logger.debug(err, data);
//     },
// });
//
// client.users.get(
//     client.CURRENT_USER_ID,
//     null,
//     (err, currentUser) => {
//         Logger.debug(err);
//         Logger.debug(currentUser);
//     }
// );
