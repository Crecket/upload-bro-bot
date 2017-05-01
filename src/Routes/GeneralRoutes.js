"use strict";

import Logger from "../Helpers/Logger";
import SpdyPush from "../SpdyPush";
const PreRender = require("../PreRender");

module.exports = (app, passport, uploadApp) => {
    // routes
    app.get(["/", "/dashboard", "/remove/:type", "/new/:type"], (req, res) => {
        res.set("X-Frame-Options", "ALLOW-FROM-ALL");
        res.setHeader("Cache-Control", "max-age=0, no-cache");

        // temp disable until more testing
        const PreRenderResults = PreRender(
            uploadApp,
            req.user,
            req.originalUrl
        );
        // catch errors for this
        PreRenderResults.catch(Logger.error);

        // create new push handler
        const PushHandler = new SpdyPush(req, res);

        // // start sendFiles event for files which are always requested for this route
        // const PushHandlerResult = PushHandler.sendFiles([
        //     {
        //         target_url: "/assets/dist/app.js",
        //         target_file: `${__dirname}/../../public/assets/dist/app.js`
        //     },
        //     {
        //         target_url: "/assets/dist/commons.js",
        //         target_file: `${__dirname}/../../public/assets/dist/commons.js`
        //     },
        //     {
        //         target_url: "/assets/dist/sw-register.js",
        //         target_file: `${__dirname}/../../public/assets/dist/sw-register.js`
        //     }
        // ]);
        //
        // // catch errors for this
        // PushHandlerResult.catch(Logger.error);

        const PushHandlerResult = Promise.resolve();

        Promise.all([PreRenderResults, PushHandlerResult])
            // we only bother with the html results
            .then(([preRenderedHtml]) => {
                res.render("index", {
                    appPreRender: preRenderedHtml || ""
                });
            })
            // error fallback to rendering basic index page
            .catch(error => {
                Logger.error(error);
                res.render("index");
            });
    });
};
