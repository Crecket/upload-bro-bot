const fs = require('fs');
const path = require('path');
const mime = require('mime');
const winston = rootRequire('src/Helpers/Winston.js');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // middleware variables
    var TelegramMiddleware = passport.authenticate('telegram');

    // login urls and callback
    app.post('/login/telegram', (req, res, next) => {
        if (req.user) {
            // already logged in
            res.redirect('/');
        } else {
            // send to telegram login middleware
            TelegramMiddleware(req, res, next);
        }
    });

    // login urls and callback
    app.get('/login/telegram', (req, res, next) => {
        // return res.json(1);
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
