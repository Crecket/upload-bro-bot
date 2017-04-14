const Logger = require("../Helpers/Logger");

module.exports = (app, passport, uploadApp) => {
    // routes
    app.get(["/", "/dashboard", "/remove/:type", "/new/:type"], (req, res) => {
        res.set("X-Frame-Options", "ALLOW-FROM-ALL");
        res.render("index");
    });
};
