const path = require('path');
const fs = require('fs');
const requireFix = require('app-root-path').require;
const express = require('express');
const http = require('http');
const https = require('https');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const TelegramStrategy = require('passport-telegram').Strategy;
const refresh = require('passport-oauth2-refresh');
const mongo_express = require('mongo-express/lib/middleware');
const ouch = require('ouch');

// util helper
const Logger = require('./Logger');

// general routes
const GoogleRoutes = require('./Sites/Google/Routes');
const ImgurRoutes = require('./Sites/Imgur/Routes');
const DropboxRoutes = require('./Sites/Dropbox/Routes');
const TelegramRoutes = require('./Routes/TelegramRoutes');
const GeneralRoutes = require('./Routes/GeneralRoutes');
const ApiRoutes = require('./Routes/ApiRoutes');

// useSsl helper
const useSsl = process.env.EXPRESS_USE_SSL === "true";

module.exports = function (uploadApp) {
    let app = express()
    let db = uploadApp._Db;

    // use ssl?
    if (useSsl) {
        let httpsOptions = {
            // ca: [''],
            cert: fs.readFileSync(process.env.EXPRESS_SSL_CERT),
            key: fs.readFileSync(process.env.EXPRESS_SSL_KEY)
        };
        var httpsServer = https.createServer(httpsOptions, app);
    }

    let httpServer = http.createServer(app);

    // force ssl
    app.all('*', (req, res, next) => {
        if (!useSsl || req.secure) {
            return next();
        }
        // check if we need to add a different port
        let extraPort = "";
        if (process.env.EXPRESS_HTTPS_PORT != "443") {
            extraPort = ":" + process.env.EXPRESS_HTTPS_PORT
        }

        // setup the https url
        let httpsUrl = 'https://' + req.hostname + extraPort + req.url;

        // redirect to https
        res.redirect(httpsUrl);
    });

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (user_id, done) {
        db.collection('users').findOne({_id: user_id}, {},
            function (err, user) {
                done(err, user);
            })
    });

    let TelegramStrategyObj = new TelegramStrategy({
            clientID: process.env.TELEPASS_APPID,
            clientSecret: process.env.TELEPASS_SECRET,
            callbackURL: process.env.WEBSITE_URL + process.env.TELEPASS_REDIRECT_URI
        },
        function (accessToken, refreshToken, profile, done) {
            // get the users collection
            let usersCollection = db.collection('users');

            // check if user exists
            usersCollection.findOne({_id: profile.id}, {}, function (err, user) {
                if (err) {
                    done(err, profile);
                }

                // site fallback
                profile.provider_sites = (!!user) ? user.provider_sites : {};

                // insert new user
                usersCollection.updateOne({
                    _id: profile.id
                }, {
                    $set: {
                        provider: "telegram",
                        _id: profile.id,
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        username: profile.username,
                        avatar: profile.avatar,
                        accessToken: accessToken,
                        provider_sites: profile.provider_sites,
                        refreshToken: refreshToken,
                    }
                }, {
                    upsert: true
                })
                    .then((result) => {
                        done(null, profile);
                    })
                    .catch((err) => {
                        done(err, profile);
                    });
            });
        })

    // use all strategies
    passport.use(TelegramStrategyObj);
    refresh.use(TelegramStrategyObj);

    // view renderer setup
    app.set('views', __dirname + '/Resources/Views');
    app.set('view engine', 'twig');
    app.set('cache', true);
    app.set('view cache', 'cache');

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
    app.use(session({
        name: "SESS_ID",
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false},
        store: new MongoStore({
            db: db,
            autoRemove: 'native'
        })
    }))
    app.use(passport.initialize());
    app.use(passport.session());

    if (process.env.MONGODB_EXPRESS_ENABLE === "true") {
        // mongodb express helper
        // const mongo_express_config = requireFix('mongo_express_config.js');
        // app.use('/mongo_express', mongo_express(mongo_express_config))
    }

    // serve static files
    app.use(express.static(__dirname + '/../public'));

    TelegramRoutes(app, passport, uploadApp);
    GeneralRoutes(app, passport, uploadApp);
    ApiRoutes(app, passport, uploadApp);

    // specific sites
    // TODO make this loading automatic
    GoogleRoutes(app, passport, uploadApp);
    DropboxRoutes(app, passport, uploadApp);
    ImgurRoutes(app, passport, uploadApp);

    // Debug errors
    app.use(function (err, req, res, next) {
        (new ouch()).pushHandler(
            new ouch.handlers.PrettyPageHandler()
        ).handleException(err, req, res,
            function () {
                console.log('Error handled');
            }
        );
    });

    // start listening http
    httpServer.listen(process.env.EXPRESS_PORT, function () {
        // start https
        if (useSsl) {
            httpsServer.listen(process.env.EXPRESS_HTTPS_PORT, function () {
                console.log('Express listening on ' + process.env.EXPRESS_HTTPS_PORT + " and " + process.env.EXPRESS_PORT)
            });
        } else {
            console.log('Express listening on ' + process.env.EXPRESS_PORT)
        }
    });
};
