const fs = require("fs");
const path = require("path");
const http = require("http");
const spdy = require("spdy");
const Logger = require("./Helpers/Logger");
const glob = require("glob");

// express libs
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const TelegramStrategy = require("passport-telegram").Strategy;
const refresh = require("passport-oauth2-refresh");
const ouch = require("ouch");
const helmet = require("helmet");
const compression = require("compression");
const responseTime = require("response-time");
const csurf = require("csurf");

// general routes
const TelegramRoutes = require("./Routes/TelegramRoutes");
const GeneralRoutes = require("./Routes/GeneralRoutes");
const ApiRoutes = require("./Routes/ApiRoutes");

// useSsl helper
const useSsl = process.env.EXPRESS_USE_SSL === "true";

module.exports = function(UploadBro) {
    let app = express();
    let db = UploadBro._Db;

    // use ssl?
    if (useSsl) {
        let httpsOptions = {
            // ca: [''],
            cert: fs.readFileSync(process.env.EXPRESS_SSL_CERT),
            key: fs.readFileSync(process.env.EXPRESS_SSL_KEY),
            ciphers: [
                "ECDHE-RSA-AES256-SHA384",
                "DHE-RSA-AES256-SHA384",
                "ECDHE-RSA-AES256-SHA256",
                "DHE-RSA-AES256-SHA256",
                "ECDHE-RSA-AES128-SHA256",
                "DHE-RSA-AES128-SHA256",
                "HIGH",
                "!aNULL",
                "!eNULL",
                "!EXPORT",
                "!DES",
                "!RC4",
                "!MD5",
                "!PSK",
                "!SRP",
                "!CAMELLIA"
            ].join(":"),
            honorCipherOrder: true,
            requestCert: false,
            spdy: {
                protocols: [
                    "h2",
                    "spdy/3.1",
                    "spdy/3",
                    "spdy/2",
                    "http/1.1",
                    "http/1.0"
                ]
            }
        };
        // add CA if we have one
        if (process.env.EXPRESS_SSL_CA) {
            httpsOptions.ca = fs.readFileSync(process.env.EXPRESS_SSL_CA);
        }
        // create server with these settings
        var httpsServer = spdy.createServer(httpsOptions, app);
    }

    let httpServer = http.createServer(app);

    // force ssl
    app.all("*", (req, res, next) => {
        if (!useSsl || req.secure) {
            return next();
        }
        // check if we need to add a different port
        let extraPort = "";
        if (process.env.EXPRESS_HTTPS_PORT != "443") {
            extraPort = ":" + process.env.EXPRESS_HTTPS_PORT;
        }

        // setup the https url
        let httpsUrl = "https://" + req.hostname + extraPort + req.url;

        // redirect to https
        res.redirect(httpsUrl);
    });

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(user_id, done) {
        db
            .collection("users")
            .findOne({ _id: user_id }, {}, function(err, user) {
                done(err, user);
            });
    });

    let TelegramStrategyObj = new TelegramStrategy(
        {
            clientID: process.env.TELEPASS_APPID,
            clientSecret: process.env.TELEPASS_SECRET,
            callbackURL:
                process.env.WEBSITE_URL + process.env.TELEPASS_REDIRECT_URI
        },
        function(accessToken, refreshToken, profile, done) {
            // get the users collection
            let usersCollection = db.collection("users");

            // check if user exists
            usersCollection.findOne({ _id: profile.id }, {}, function(
                err,
                user
            ) {
                if (err) {
                    done(err, profile);
                }

                // site fallback
                profile.provider_sites = user ? user.provider_sites : {};

                // insert new user
                usersCollection
                    .updateOne(
                        {
                            _id: profile.id
                        },
                        {
                            $set: {
                                provider: "telegram",
                                _id: profile.id,
                                first_name: profile.first_name,
                                last_name: profile.last_name,
                                username: profile.username,
                                avatar: profile.avatar,
                                accessToken: accessToken,
                                provider_sites: profile.provider_sites,
                                refreshToken: refreshToken
                            }
                        },
                        {
                            upsert: true
                        }
                    )
                    .then(result => {
                        done(null, profile);
                    })
                    .catch(err => {
                        done(err, profile);
                    });
            });
        }
    );

    // use all strategies
    passport.use(TelegramStrategyObj);
    refresh.use(TelegramStrategyObj);

    // view renderer setup
    app.set("views", __dirname + "/Resources/Views");
    app.set("view engine", "twig");
    app.set("cache", true);
    app.set("view cache", "cache");

    // parsers
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    // gzip optimization
    app.use(compression());

    // only enable morgan debugging if set in process env
    if (process.env.MORGAN) {
        const morgan = require("morgan");
        app.use(
            morgan(
                ":method :status :url - HTTP/:http-version - :response-time ms"
            )
        );
    }

    // add response time header
    if (process.env.DEBUG) {
        app.use(responseTime());
    }

    // session handler
    app.use(
        session({
            name: "BRO_ID",
            secret: process.env.EXPRESS_SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true,
                httpOnly: true,
                domain: process.env.WEBSITE_DOMAIN
            },
            store: new MongoStore({
                db: db,
                autoRemove: "native"
            })
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // security headers
    app.use(
        helmet({
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            }
        })
    );

    // csurf for csrf values and a simple helper middleware
    // app.use(csurf({cookie: true}));
    app.use((request, response, next) => {
        // response.locals.csrftoken = request.csrfToken();
        response.locals.csrftoken = "disabled";
        response.locals.WEBSITE_URL = process.env.WEBSITE_URL;
        next();
    });

    // values we want to cache certain levels for
    const cacheDuration = {
        HIGH: 60 * 60 * 24 * 7,
        MEDIUM: 60 * 60 * 24 * 1,
        LOW: 60 * 60,
        NONE: 0
    };

    // check if we need to set cache handlers and pretty error handlers
    if (process.env.DEBUG) {
        // serve static files
        app.use(express.static(__dirname + "/../public"));

        // enable pretty error logs
        app.use(function(err, req, res, next) {
            new ouch()
                .pushHandler(new ouch.handlers.PrettyPageHandler())
                .handleException(err, req, res, () => {
                    Logger.error("Error handled");
                    Logger.error(err);
                });
        });
    } else {
        // enable strong etags
        app.enable("etag");

        // serve static files with cache headers
        app.use(
            express.static(__dirname + "/../public", {
                setHeaders: (response, path, stat) => {
                    response.header(
                        "Cache-Control",
                        "public, max-age=" + cacheDuration.MEDIUM
                    );
                }
            })
        );
    }

    // Default routes
    TelegramRoutes(app, passport, UploadBro);
    GeneralRoutes(app, passport, UploadBro);
    ApiRoutes(app, passport, UploadBro);

    // find all specific provider routes
    const ProviderRoutes = glob.sync(__dirname + "/Sites/**/Routes.js");
    // load them all with the correct parameters
    ProviderRoutes.map(providerRoute => {
        // require the route
        require(providerRoute)(app, passport, UploadBro);
    });

    // fall back route
    app.use("*", (req, res, next) => {
        res.render("index.twig");
    });

    // error handler
    app.use(function(err, req, res, next) {
        if (err.code !== "EBADCSRFTOKEN") return next(err);

        // handle CSRF token errors here
        res.status(403).json("Invalid CSRF");
    });

    // start listening http
    httpServer.listen(process.env.EXPRESS_PORT, function() {
        // start https
        if (useSsl) {
            httpsServer.listen(process.env.EXPRESS_HTTPS_PORT, function() {
                Logger.trace(
                    "Express listening on " +
                        process.env.EXPRESS_HTTPS_PORT +
                        " and " +
                        process.env.EXPRESS_PORT
                );
            });
        } else {
            Logger.trace("Express listening on " + process.env.EXPRESS_PORT);
        }
    });
};
