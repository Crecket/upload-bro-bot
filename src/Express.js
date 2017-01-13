var express = require('express')
var session = require('express-session')
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var TelegramStrategy = require('passport-telegram').Strategy;
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (db) {
    var app = express()

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new TelegramStrategy({
            clientID: process.env.TELEPASS_APPID,
            clientSecret: process.env.TELEPASS_SECRET,
            callbackURL: 'http://localhost/login/telegram/callback'
        },
        function (accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                // User.findOrCreate({providerId: profile.id}, function (err, user) {
                //     return done(err, user);
                // });
                return done(null, profile);
            });
        })
    );


    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_SECRET,
            clientSecret: process.env.GOOGLE_CLIENT_ID,
            callbackURL: "http://localhost/login/google-drive/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    ));

    passport.use(new DropboxOAuth2Strategy({
            apiVersion: '2',
            clientID: process.env.DROPBOX_APP_KEY,
            clientSecret: process.env.DROPBOX_APP_SECRET,
            callbackURL: "http://localhost/login/dropbox/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            // User.findOrCreate({providerId: profile.id}, function (err, user) {
            //     return done(err, user);
            // });
            return done(null, profile);
        })
    );

    // view renderer setup
    app.set('views', __dirname + '/Views');
    app.set('view engine', 'twig');
    app.disable('view cache');

    app.use(morgan('combined'));
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


    // routes
    app.get('/', function (req, res) {
        var user = (req.session && req.session.passport) ? req.session.passport.user : false;

        res.render('index', {user: user, errors: false});
    });

    // GET /failed
    app.get('/failed', function (req, res) {
        var user = (req.session && req.session.passport) ? req.session.passport.user : false;

        res.render('index', {user: req.user, errors: true});
    });

    app.get('/login/telegram', passport.authenticate('telegram'), function (req, res) {
    });
    app.get('/login/telegram/callback',
        passport.authenticate('telegram', {
            session: true,
            failureRedirect: '/failed'
        }),
        function (req, res) {
            res.json(req.user);
        }
    );

    app.get('/login/dropbox', passport.authenticate('dropbox-oauth2'), function (req, res) {
    });
    app.get('/login/dropbox/callback',
        passport.authenticate('dropbox-oauth2', {
            session: false,
            failureRedirect: '/failed'
        }),
        function (req, res) {
            res.json(req.user);
        }
    );

    app.get('/login/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/drive'] }), function (req, res) {
    });

    // GET /login/telegram/callback
    app.get('/login/google/callback',
        passport.authenticate('google', {
            session: false,
            failureRedirect: '/failed'
        }),
        function (req, res) {
            res.json(req.user);
        }
    );

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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // <-- Attention: we don't have this page in the example.
};