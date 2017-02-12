var fs = require('fs');
var path = require('path');
var mime = require('mime');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // middleware variables
    var TelegramMiddleware = passport.authenticate('telegram');

    // login urls and callback
    app.get('/login/telegram', (req, res, next) => {
        if (req.user) {
            // already logged in
            res.redirect('/');
        } else {
            // send to telegram login middleware
            TelegramMiddleware(req, res, next);
        }
    });

    app.get('/login/telegram/callback', passport.authenticate('telegram', {
            session: true
        }), (req, res) => {
            res.redirect('/');
        }
    );

}
