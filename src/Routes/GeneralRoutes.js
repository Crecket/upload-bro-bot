"use strict";

let PreRender = () => {};
if (process.env.ENABLE_SSR === "true") {
    // only load pre-Render if ssr is enabled
    PreRender = require("../PreRender");
}
import InlineCss from "../Helpers/InlineCss";
const Logger = require("../Helpers/Logger");
const SpdyPush = require("../SpdyPush");
const express = require("express");

/**
 * @param uploadApp
 * @param req
 * @returns {Promise.<boolean>}
 */
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

        return PreRenderResults;
    }
};

module.exports = (app, passport, uploadApp) => {
    if (process.env.DEBUG === "true") {
        app.get("/coverage", (req, res) =>
            res.redirect("/coverage/lcov-report/index.html")
        );
        app.use("/coverage", express.static("coverage"));
    }

    // routes
    app.get(["/", "/dashboard", "/remove/:type", "/new/:type"], (req, res) => {
        res.set("X-Frame-Options", "ALLOW-FROM-ALL");

        let time = new Date();

        // create new push handler and start sendFiles event for files which are always requested for this route
        // const PushHandler = new SpdyPush(req, res);
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

        // polyfill pushhandler result since its buggy for now
        const PushHandlerRequest = Promise.resolve();

        // pre-render check
        const PreRenderRequest = doPrerender(uploadApp, req);

        // try to get css styles for inline css
        const CssAppStylesRequest = InlineCss("/assets/dist/css-app.css");

        Promise.all([PreRenderRequest, PushHandlerRequest, CssAppStylesRequest])
            .then(
                ([PreRenderResults, PushHandlerResult, CssAppStylesResult]) => {
                    Logger.debug(new Date().getTime() - time.getTime());

                    // set a cache header since we want to make sure this is up-to-date if the client
                    // does not have a cached version in the service worker
                    res.setHeader("Cache-Control", "max-age=0, no-cache");

                    // render the index page with the preRenderedHtml string
                    res.render("index", {
                        appPreRender: PreRenderResults || "",
                        appCss: CssAppStylesResult
                    });
                }
            )
            // error fallback to rendering basic index page
            .catch(error => {
                Logger.error(error);
                // fallback to rendering the index page
                res.render("index");
            });
    });
};
