var express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var TelegramStrategy = require('passport-telegram').Strategy;
var refresh = require('passport-oauth2-refresh');

var Logger = require('./Logger');

module.exports = function (db) {
    var app = express()

    // refresh using a refresh token example
    // refresh.requestNewAccessToken('facebook', 'some_refresh_token', function(err, accessToken, refreshToken) {
    //        });

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
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
            usersCollection.findOne({id: profile.id}, {}, function (err, user) {
                if (err) {
                    return done(err, profile);
                }

                if (!user) {
                    // insert new user
                    usersCollection.insertOne({
                        provider: "telegram",
                        id: profile.id,
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        username: profile.username,
                        avatar: profile.avatar,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    })
                        .then((err, result) => {
                            done(err, profile);
                        })
                        .catch((err) => {
                            done(err, profile);
                        });
                } else {
                    done(null, profile);
                }
            });
        })

    // var GoogleStrategyObj = new GoogleStrategy({
    //         clientID: process.env.GOOGLE_CLIENT_ID,
    //         clientSecret: process.env.GOOGLE_SECRET,
    //         callbackURL: "http://localhost/login/google/callback",
    //         scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    //         session: false,
    //         accessType: 'offline',
    //         approvalPrompt: 'force',
    //         scope: [
    //             'https://www.googleapis.com/auth/userinfo.profile',
    //             'https://www.googleapis.com/auth/drive.appfolder',
    //             'https://www.googleapis.com/auth/drive.file'
    //         ]
    //     },
    //     function (accessToken, refreshToken, profile, done) {
    //         Logger.debug("Received accesstoken and refreshtoken");
    //
    //         // get the users collection
    //         var usersCollection = db.collection('users');
    //
    //         usersCollection.findOne({a: 2}, {fields: {b: 1}}, function (err, doc) {
    //             test.equal(null, err);
    //             test.equal(null, doc.a);
    //             test.equal(2, doc.b);
    //
    //             db.close();
    //         });
    //
    //         // Find some documents
    //         usersCollection.findOne({id: profile.id})
    //             .then((err, user) => {
    //                 if (user) {
    //                     Logger.debug("User found: ", user);
    //                 } else {
    //                     Logger.debug("No user found for: ", userId);
    //                 }
    //             })
    //             .catch(console.error);
    //
    //
    //         return done(null, {
    //             profile: profile,
    //             accessToken: accessToken,
    //             refreshToken: refreshToken,
    //         });
    //     });
    // var DropboxStrategy = new DropboxOAuth2Strategy({
    //         apiVersion: '2',
    //         clientID: process.env.DROPBOX_APP_KEY,
    //         clientSecret: process.env.DROPBOX_APP_SECRET,
    //         callbackURL: "http://localhost/login/dropbox/callback"
    //     },
    //     function (accessToken, refreshToken, profile, done) {
    //         return done(null, {
    //             profile: profile,
    //             accessToken: accessToken,
    //             refreshToken: refreshToken,
    //         });
    //     });

    // use all strategies
    passport.use(TelegramStrategyObj);
    // passport.use(DropboxStrategy);
    // passport.use(GoogleStrategyObj);

    refresh.use(TelegramStrategyObj);
    // refresh.use(DropboxStrategy);
    // refresh.use(GoogleStrategyObj);

    // view renderer setup
    app.set('views', __dirname + '/Views');
    app.set('view engine', 'twig');
    app.disable('view cache');

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());

    // serve static files
    app.use(express.static(__dirname + '/../public'));

    // session middleware
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

    // middleware variables
    var TelegramMiddleware = passport.authenticate('telegram');
    // var DropboxMiddleware = passport.authenticate('dropbox-oauth2');
    // var GoogleMiddleware = passport.authenticate('google', {
    //     session: false,
    //     accessType: 'offline',
    //     approvalPrompt: 'force'
    // });

    // routes
    app.get('/', function (req, res) {
        var user = (req.session && req.session.passport) ? req.session.passport.user : false;

        // console.log(user);

        res.render('index', {user: user, errors: false});
    });

    // GET /failed
    app.get('/failed/:type', function (req, res) {
        var user = (req.session && req.session.passport) ? req.session.passport.user : false;

        res.render('index', {user: req.user, errors: true, errorType: req.params.type});
    });

    app.get('/login/telegram', TelegramMiddleware, function (req, res) {
    });
    app.get('/login/telegram/callback',
        passport.authenticate('telegram', {
            session: true,
            failureRedirect: '/failed'
        }),
        function (req, res) {
            res.redirect('/');
            // res.json(req.user);
        }
    );

    // app.get('/login/dropbox', DropboxMiddleware, function (req, res) {
    // });
    // app.get('/login/dropbox/callback',
    //     passport.authenticate('dropbox-oauth2', {
    //         session: false,
    //         failureRedirect: '/failed'
    //     }),
    //     function (req, res) {
    //         res.json(req.user);
    //     }
    // );
    //
    // app.get('/login/google', GoogleMiddleware, function (req, res) {
    // });
    //
    // // GET /login/telegram/callback
    // app.get('/login/google/callback',
    //     passport.authenticate('google', {
    //         session: false,
    //         failureRedirect: '/failed'
    //     }),
    //     function (req, res) {
    //         res.json(req.user);
    //     }
    // );

    // GET /logout
    app.get('/logout', function (req, res) {
        req.session.passport = {};
        res.redirect('/');
    });


    // start listening
    app.listen(80, function () {
        console.log('Express app listening on port 80!')
    })

};
