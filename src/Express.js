var path = require('path');
var fs = require('fs');
var requireFix = require('app-root-path').require;
var express = require('express');
var http = require('http');
var https = require('https');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var TelegramStrategy = require('passport-telegram').Strategy;
var refresh = require('passport-oauth2-refresh');
var mongo_express = require('mongo-express/lib/middleware');

// util helper
var Logger = require('./Logger');

// general routes
var GoogleRoutes = require('./Sites/Google/Routes');
var DropboxRoutes = require('./Sites/Dropbox/Routes');
var TelegramRoutes = require('./Routes/TelegramRoutes');

// get the config
var mongo_express_config = requireFix('mongo_express_config.js');

// useSsl helper
const useSsl = process.env.EXPRESS_USE_SSL === "true";

module.exports = function (uploadApp) {
    var app = express()
    var db = uploadApp._Db;

    // use ssl?
    if (useSsl) {
        var httpsOptions = {
            // ca: [''],
            cert: fs.readFileSync(process.env.EXPRESS_SSL_CERT),
            key: fs.readFileSync(process.env.EXPRESS_SSL_KEY)
        };
        var httpsServer = https.createServer(httpsOptions, app);
    }

    var httpServer = http.createServer(app);

    // force ssl
    app.all('*', (req, res, next) => {
        if (!useSsl || req.secure) {
            return next();
        }
        // check if we need to add a different port
        var extraPort = "";
        if (process.env.EXPRESS_HTTPS_PORT != "443") {
            extraPort = ":" + process.env.EXPRESS_HTTPS_PORT
        }

        // setup the https url
        var httpsUrl = 'https://' + req.hostname + extraPort + req.url;

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

    var TelegramStrategyObj = new TelegramStrategy({
            clientID: process.env.TELEPASS_APPID,
            clientSecret: process.env.TELEPASS_SECRET,
            callbackURL: process.env.TELEPASS_REDIRECT_URI
        },
        function (accessToken, refreshToken, profile, done) {
            // get the users collection
            var usersCollection = db.collection('users');

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
    app.use(session({
        name: "SESS_ID",
        secret: 'a random secret value',
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

    // mongodb express helper
    app.use('/mongo_express', mongo_express(mongo_express_config))

    // serve static files
    app.use(express.static(__dirname + '/../public'));

    // routes
    app.get(['/', '/failed/:type'], (req, res) => {
        res.render('index', {});
    })

    // fetch user info from api
    app.post('/get_user', (req, res) => {
        var user_info = (req.user) ? req.user : false;
        res.json(user_info);
    });

    TelegramRoutes(app, passport, uploadApp);
    GoogleRoutes(app, passport, uploadApp);
    DropboxRoutes(app, passport, uploadApp);

    // GET /logout
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
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
