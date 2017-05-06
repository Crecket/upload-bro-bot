"use strict";
const TelegramBot = require("node-telegram-bot-api");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const del = require("del");
const glob = require("glob");
const path = require("path");
const Cacheman = require("cacheman");
const MongoDbEngine = require("cacheman-mongo");
const Logger = require("./Helpers/Logger.js");

// polyfill shortcut
const polyFill = () =>{};

// utilities
let Utils = require("./Helpers/Utils");

// require the express server and routes
let Express = require("./Express");

// handlers and other helpers
const CommandHandler = require("./Handlers/CommandHandler");
const SiteHandler = require("./Handlers/SiteHandler");
const QueryHandler = require("./Handlers/QueryHandler");
const EventHandlersObj = require("./Handlers/EventHandler");
const InlineQueryHandlerObj = require("./Handlers/InlineQueryHandler");
const UserHelperObj = require("./UserHelper");
const QueueObj = require("./Queue");
const AnalyticsObj = require("./Analytics");

module.exports = class UploadBro {
    /**
     * @param onlineMode - in onlineMode, connections to external services are actived
     */
    constructor(onlineMode = true) {
        /**
         * if set to True, no external connections will be made
         */
        this.onlineMode = onlineMode;

        // create a queue object and analytics helper
        this._Queue = new QueueObj(5);
        this._Analytics = new AnalyticsObj(this);

        // user helper object
        this._UserHelper = new UserHelperObj(this);

        // Create new command handler
        this._CommandHandler = new CommandHandler(this);
        this._SiteHandler = new SiteHandler(this);
        this._QueryHandler = new QueryHandler(this);
        this._EventHandler = new EventHandlersObj(this);
        this._InlineQueryHandler = new InlineQueryHandlerObj(this);
    }

    async start() {
        try {
            // default to onlineMode
            if (this.onlineMode !== false) {
                // Create a new blackjack bot
                this._TelegramBot = new TelegramBot(
                    process.env.TELEGRAM_TOKEN,
                    {
                        polling: true
                    }
                );

                // connect to mongodb
                const db = await this.connectDb();

                // store the database
                this._Db = db;

                // create mongodb cache engine
                const engine = new MongoDbEngine(db, { collection: "cache" });

                // store the cache in the app
                this._Cache = new Cacheman("uploadbro_cache", {
                    engine: engine, // mongodb engine
                    ttl: 60 * 60 // default ttl
                });
            } else {
                // polyfill these, this should not trigger a error
                this._TelegramBot = {
                    onText: polyFill,
                    on: polyFill
                };
                this._Db = null;
                this._Cache = new Cacheman("uploadbro_memory_cache");
            }

            // load default commands
            await this.loadCommands();

            // load websites and their queries/commands
            await this.loadWebsites();

            // load default queries
            await this.loadQueries();

            // setup event listeners
            await this.eventListeners();

            // clear the downloads folder
            const paths = await del([
                "downloads/**",
                "!downloads",
                "!downloads/.gitkeep"
            ]);

            // finished loading everything
            Logger.debug(
                `Loaded the following commands:\n\n${this._CommandHandler.info}\n`
            );

            // default to onlineMode
            if (this.onlineMode !== false) {
                // start express listener
                Express(this);
            }
        } catch (ex) {
            Logger.error(ex);
        }
    }

    /**
     * Connect to mongodb
     *
     * @returns {Promise}
     */
    async connectDb() {
        // attempt to connect to mongoserver
        const db = await MongoClient.connect(process.env.MONGODB_URL);

        // log connection status
        Logger.debug("Connected to " + process.env.MONGODB_URL);

        // return the connection
        return db;
    }

    /**
     * Load websites
     *
     * @returns {Promise.<T>}
     */
    async loadWebsites() {
        // Register the websites
        const Sites = glob.sync(__dirname + "/Sites/*/index.js");

        // load them all with the correct parameters
        Sites.map(Site => {
            // require the file
            const SiteObj = require(Site);

            // require the index file and set the file handler
            this._SiteHandler.register(
                new SiteObj(this, this._registerDefault)
            );
        });

        Logger.debug(`Loaded ${this._SiteHandler.siteCount} sites`);
    }

    /**
     * Global commands, not specific to a website
     *
     * @returns {Promise.<T>}
     */
    async loadCommands() {
        // Register the commands
        const Commands = glob.sync(__dirname + "/Commands/*.js");

        // load them all with the correct parameters
        Commands.map(Command => {
            // require the file
            const CommandObj = require(Command);

            // require the index file and set the file handler
            this._CommandHandler.register(
                new CommandObj(this, this._registerDefault)
            );
        });

        Logger.debug(`Loaded ${this._CommandHandler.commandCount} commands`);
    }

    /**
     * Load event handlers for callback_query
     * @returns {Promise.<T>}
     */
    async loadQueries() {
        // Register the commands
        const Queries = glob.sync(__dirname + "/Queries/*.js");

        // load them all with the correct parameters
        Queries.map(Query => {
            // require the file
            const QueryObj = require(Query);

            // require the index file and set the file handler
            this._QueryHandler.register(
                new QueryObj(this, this._registerDefault)
            );
        });

        Logger.debug(`Loaded ${this._QueryHandler.queryCount} queries`);
    }

    /**
     * Respond to a callback query
     *
     * @param id
     * @param text
     * @param alert
     * @param options
     */
    answerCallbackQuery(id, text = "", alert = false, options = {}) {
        return this._TelegramBot
            .answerCallbackQuery(id, text, alert, options)
            .then(result => {
                Logger.debug("Responded to query " + id);
            })
            .catch(() => {
                Logger.debug("Failed to respond to query " + id);
            });
    }

    /**
     * Register events
     *
     * @returns {Promise.<T>}
     */
    async eventListeners() {
        const fn = this;
        // file messages
        this._TelegramBot.on("audio", msg =>
            fn._EventHandler.messageFileListener(msg, "audio")
        );
        this._TelegramBot.on("video", msg =>
            fn._EventHandler.messageFileListener(msg, "video")
        );
        this._TelegramBot.on("voice", msg =>
            fn._EventHandler.messageFileListener(msg, "voice")
        );
        this._TelegramBot.on("photo", msg =>
            fn._EventHandler.messageFileListener(msg, "photo")
        );
        this._TelegramBot.on("document", msg =>
            fn._EventHandler.messageFileListener(msg, "document")
        );

        this._TelegramBot.on("group_chat_created", msg => {
            // track event
            // this._Analytics.track('group_chat_created');
            Logger.debug(["group_chat_created", msg]);
        });
        this._TelegramBot.on("message", msg => {
            // track event
            // this._Analytics.track('message');
            Logger.debug(["message", msg]);
        });

        // callback query listener
        this._TelegramBot.on("callback_query", msg => {
            // track event
            this._Analytics.track(msg, "callback_query");
            fn._EventHandler.callbackQuery(msg);
        });

        // inline query search event
        this._TelegramBot.on("inline_query", msg => {
            // track event
            this._Analytics.track(msg, "inline_query");
            fn._EventHandler.inlineQuery(msg);
        });
    }
};
