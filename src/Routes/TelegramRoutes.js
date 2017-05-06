const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../Helpers/Logger.js");

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // middleware variables
    var TelegramMiddleware = passport.authenticate("telegram");

    // login urls and callback
    app.post("/login/telegram", (req, res, next) => {
        if (req.user) {
            // already logged in
            res.redirect("/dashboard");
        } else {
            // send to telegram login middleware
            TelegramMiddleware(req, res, next);
        }
    });

    // login to telegram over GET is ignored and redirected
    app.get("/login/telegram", (req, res, next) => {
        res.redirect("/");
    });

    // callback url to handle login attempts
    app.get(
        "/login/telegram/callback",
        passport.authenticate("telegram", {
            session: true
        }),
        (req, res) => {
            // redirect to user dashboard
            res.redirect("/dashboard");
        }
    );

    // logout page
    app.post("/logout", (request, response) => {
        request.logout();
        response.redirect("/");
    });
};
