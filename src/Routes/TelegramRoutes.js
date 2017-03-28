const fs = require('fs');
const path = require('path');
const mime = require('mime');
const winston = rootRequire('src/Helpers/Logger.js');

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
    app.get('/login/telegram', (req, res, next) => {
        res.redirect('/');
    });

    app.get('/login/telegram/callback', passport.authenticate('telegram', {
            session: true
        }), (req, res) => {
            res.redirect('/');
        }
    );

    // logout page
    app.post('/logout', (request, response) => {
        request.logout();
        response.redirect('/');
    });
}
