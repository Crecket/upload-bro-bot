"use strict";

let PreRender = () => {};
if(process.env.ENABLE_SSR === "true"){
    // only load babel-register if we have ssr
    require("babel-register");

    // only load pre-Render if ssr is enabled
    PreRender = require("../PreRender");
}

const Logger = require("../Helpers/Logger");
// const SpdyPush = require("../SpdyPush");

const doPrerender = (uploadApp, req) => {
    if (process.env.ENABLE_SSR !== "true") {
        // just instantly resolve false
        return Promise.resolve(false);
    } else {
        // do the pre-render
        const PreRenderResults = PreRender(
            uploadApp,
            req.user,
            req.originalUrl
        );
        // catch errors for this
        PreRenderResults.catch(Logger.error);
    }
};

module.exports = (app, passport, uploadApp) => {
    // routes
    app.get(["/", "/dashboard", "/remove/:type", "/new/:type"], (req, res) => {
        res.set("X-Frame-Options", "ALLOW-FROM-ALL");

        // pre-render check
        const PreRenderResults = doPrerender(uploadApp, req);

        // polyfill pushhandler result since its buggy for now
        const PushHandlerResult = Promise.resolve();

        // // create new push handler
        // const PushHandler = new SpdyPush(req, res);
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

        Promise.all([PreRenderResults, PushHandlerResult])
            // we only bother with the html results
            .then(([preRenderedHtml]) => {
                // set a cache header since we want to make sure this is up-to-date if the client
                // does not have a cached version in the service worker
                res.setHeader("Cache-Control", "max-age=0, no-cache");

                // render the index page with the preRenderedHtml string
                res.render("index", {
                    appPreRender: preRenderedHtml || ""
                });
            })
            // error fallback to rendering basic index page
            .catch(error => {
                Logger.error(error);
                // fallback to rendering the index page
                res.render("index");
            });
    });
};
