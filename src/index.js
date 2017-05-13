"use strict";
// load env config
import Logger from "./Helpers/Logger";
import UploadBro from "./UploadBro";

// unhandledrejection listener
process.on("unhandledRejection", (reason, promise) => {
    Logger.error(reason);
});

// Load the app
const App = new UploadBro();

// start Uploadbro
App.start().then().catch(Logger.error);
