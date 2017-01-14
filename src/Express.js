var path = require('path')
var fs = require('fs')
var mime = require('mime')
var express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var TelegramStrategy = require('passport-telegram').Strategy;
var refresh = require('passport-oauth2-refresh');

var Logger = require('./Logger');
var GoogleHelperObj = require('./Sites/Google/GoogleHelper');

module.exports = function (uploadApp) {
    var app = express()
    var db = uploadApp._Db;
    var GoogleHelper = new GoogleHelperObj(uploadApp);

    // refresh using a refresh token example
    // refresh.requestNewAccessToken('facebook', 'some_refresh_token', function(err, accessToken, refreshToken) {
    //        });

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
            callbackURL: 'http://localhost/login/telegram/callback'
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
    app.set('views', __dirname + '/Views');
    app.set('view engine', 'twig');
    app.disable('view cache');

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

    // middleware variables
    var TelegramMiddleware = passport.authenticate('telegram');

    // serve static files
    app.use(express.static(__dirname + '/../public'));

    // routes
    app.get(['/', '/failed/:type'], (req, res) => {
        console.log(req.user.provider_sites);
        res.render('index', {});
    })

    app.post('/get_user', (req, res) => {
        res.json(req.user);
    });

    // returns a valid oauth url for the client
    app.get('/login/google_url', (req, res) => {
        var url = GoogleHelper.createOauthClient().generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/drive.appfolder',
                'https://www.googleapis.com/auth/drive.file'
            ]
        });

        // return the url
        res.json({url: url});
    });

    app.get('/test_google', (request, response) => {
        // get the correct path
        var filePath = path.join(__dirname, '../downloads/127251962/file_1.jpg');

        // upload the file
        GoogleHelper.uploadFile(
            request.user.provider_sites.google,
            filePath,
            "card.jpg"
        )
            .then((result) => {
                response.json(result);
            })
            .catch((err) => {
                response.json(err);
            });
    })

    // handles the oauth callback
    app.get('/login/google/callback', function (request, response) {
        var code = request.query.code;

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect('/');
            return;
        } else {
            GoogleHelper.createOauthClient().getToken(code, function (err, tokens) {
                if (err) {
                    console.log(err);
                    response.redirect('/');
                    return;
                }

                // get collection and current sites
                var current_provider_sites = request.user.provider_sites;
                var usersCollection = db.collection('users');

                if (current_provider_sites['google']) {
                    // already exists, update existing values
                    current_provider_sites.google.expiry_date = tokens.expiry_date;
                    current_provider_sites.google.access_token = tokens.access_token;
                    // current_provider_sites.google.id_token = tokens.id_token;
                } else {
                    // add new provider
                    current_provider_sites.google = {
                        expiry_date: tokens.expiry_date,
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                        // id_token: tokens.id_token,
                    }
                }

                // update provider sites
                usersCollection.updateOne({_id: request.user._id}, {
                    $set: {
                        provider_sites: current_provider_sites
                    }
                }).then((result) => {
                    console.log('mongodb updated');
                    console.log(result);
                    response.redirect('/');
                }).catch((err) => {
                    console.log('mongodb error');
                    console.log(err);
                    response.redirect('/');
                });
            });
        }
    });

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
            session: true,
            failureRedirect: '/failed/telegram'
        }), (req, res) => {
            res.redirect('/');
        }
    );

    // GET /logout
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // start listening
    app.listen(80, function () {
        console.log('Express app listening on port 80!')
    })

};
