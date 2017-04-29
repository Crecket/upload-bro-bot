"use strict";

const Logger = require("../Helpers/Logger");
// const PreRender = require('../PreRender');

module.exports = (app, passport, uploadApp) => {
    // routes
    app.get(["/", "/dashboard", "/remove/:type", "/new/:type"], (req, res) => {
        res.set("X-Frame-Options", "ALLOW-FROM-ALL");
        res.render("index");

        // temp disable until more testing
        // PreRender(uploadApp, req.user, req.originalUrl)
        //     .then(preRenderedHtml => {
        //         res.render('index', {
        //             appPreRender: preRenderedHtml || ""
        //         });
        //     })
        //     .catch(Logger.error);
    });
};
