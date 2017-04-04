"use strict";
const TelegramBot = require('node-telegram-bot-api');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const del = require('del');
const glob = require('glob');
const path = require('path');
const Cacheman = require('cacheman');
const MongoDbEngine = require('cacheman-mongo');
const Logger = require('./Helpers/Logger.js');

// utilities
let Utils = require('./Utils');

// express server
let Express = require('./Express');

// handlers and other helpers
const CommandHandler = require('./Handlers/CommandHandler');
const SiteHandler = require('./Handlers/SiteHandler');
const QueryHandler = require('./Handlers/QueryHandler');
const EventHandlersObj = require('./Handlers/EventHandler');
const InlineQueryHandlerObj = require('./Handlers/InlineQueryHandler');
const UserHelperObj = require('./UserHelper');
const QueueObj = require('./Queue');
const AnalyticsObj = require('./Analytics');

module.exports = class App {
    constructor(token) {
        // Create a new blackjack bot
        this._TelegramBot = new TelegramBot(token, {polling: true});

        // create a queue object and analytics helper
        this._Queue = new QueueObj(1);
        this._Analytics = new AnalyticsObj(this);

        // user helper object
        this._UserHelper = new UserHelperObj(this);

        // Create new command handler
        this._CommandHandler = new CommandHandler(this);
        this._SiteHandler = new SiteHandler(this);
        this._QueryHandler = new QueryHandler(this);
        this._EventHandler = new EventHandlersObj(this);
        this._InlineQueryHandler = new InlineQueryHandlerObj(this);

        // connect to mongodb
        this.connectDb()
            .then((db) => {
                // store the database
                this._Db = db;

                // create mongodb cache engine
                const engine = new MongoDbEngine(db, {collection: 'cache'});

                // store the cache in the app
                this._Cache = new Cacheman('uploadbro_cache', {
                    engine: engine, // mongodb engine
                    ttl: 60 * 60, // default ttl
                });
            })
            // load all the commands
            .then(this.loadCommands.bind(this))
            // setup dropbox handler
            .then(this.loadWebsites.bind(this))
            // load all the queries
            .then(this.loadQueries.bind(this))
            // start the event listeners
            .then(this.eventListeners.bind(this))
            // clear downloads folder
            .then(() => {
                return new Promise((resolve, reject) => {
                    del(['downloads/**', '!downloads', '!downloads/.gitkeep']).then(paths => {
                        Logger.debug('Cleared downloads folder:\n', paths.join('\n'));
                        resolve();
                    });
                })
            })
            // finish setup
            .then(() => {
                // finished loading everything
                Logger.debug("Loaded the following commands:");
                Logger.debug(this._CommandHandler.info);
                // start express listener
                Express(this);
            })
            .catch(Logger.error);

    }

    /**
     * Connect to mongodb
     *
     * @returns {Promise}
     */
    connectDb() {
        return new Promise((resolve, reject) => {
            // attempt to connect to mongoserver
            MongoClient.connect(process.env.MONGODB_URL)
                .then((db) => {
                    Logger.info("Connected to " + process.env.MONGODB_URL);
                    resolve(db);
                })
                .catch(reject);
        });
    }

    /**
     * Load websites
     *
     * @returns {Promise.<T>}
     */
    loadWebsites() {
        // Register the websites
        const Sites = glob.sync(__dirname + '/Sites/*/index.js');

        // load them all with the correct parameters
        Sites.map(Site => {
            // require the file
            const SiteObj = require(Site);

            // require the index file and set the file handler
            this._SiteHandler.register(new SiteObj(this));
        });

        Logger.debug('Loaded ' + this._SiteHandler.siteCount + " sites");
        return Promise.resolve();
    }

    /**
     * Global commands, not specific to a website
     *
     * @returns {Promise.<T>}
     */
    loadCommands() {
        // Register the commands
        const Commands = glob.sync(__dirname + '/Commands/*.js');

        // load them all with the correct parameters
        Commands.map(Command => {
            // require the file
            const CommandObj = require(Command);

            // require the index file and set the file handler
            this._CommandHandler.register(new CommandObj(this));
        });

        Logger.debug('Loaded ' + this._CommandHandler.commandCount + " commands");
        return Promise.resolve();
    }

    /**
     * Load event handlers for callback_query
     * @returns {Promise.<T>}
     */
    loadQueries() {
        // Register the commands
        const Queries = glob.sync(__dirname + '/Queries/*.js');

        // load them all with the correct parameters
        Queries.map(Query => {
            // require the file
            const QueryObj = require(Query);

            // require the index file and set the file handler
            this._QueryHandler.register(new QueryObj(this));
        });

        Logger.debug('Loaded ' + this._QueryHandler.queryCount + " queries");
        return Promise.resolve();
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
        return this._TelegramBot.answerCallbackQuery(id, text, alert, options)
            .then((result) => {
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
    eventListeners() {
        const fn = this;
        // file messages
        this._TelegramBot.on('audio', (msg) => {
            fn._EventHandler.messageFileListener(msg, 'audio');
        });
        this._TelegramBot.on('video', (msg) => {
            fn._EventHandler.messageFileListener(msg, 'video');
        });
        this._TelegramBot.on('voice', (msg) => {
            fn._EventHandler.messageFileListener(msg, 'voice');
        });
        this._TelegramBot.on('photo', (msg) => {
            fn._EventHandler.messageFileListener(msg, 'photo');
        });
        this._TelegramBot.on('document', (msg) => {
            fn._EventHandler.messageFileListener(msg, 'document');
        });

        this._TelegramBot.on('group_chat_created', (msg) => {
            // track event
            // this._Analytics.track('group_chat_created');
            Logger.debug('group_chat_created', msg);
        });
        this._TelegramBot.on('message', (msg) => {
            // track event
            // this._Analytics.track('message');
            Logger.debug('message', msg);
        });

        // callback query listener
        this._TelegramBot.on('callback_query', (msg) => {
            // track event
            this._Analytics.track(msg, 'callback_query');
            fn._EventHandler.callbackQuery(msg);
        });

        // inline query search event
        this._TelegramBot.on('inline_query', (msg) => {
            // track event
            this._Analytics.track(msg, 'inline_query');
            fn._EventHandler.inlineQuery(msg);
        });

        return Promise.resolve();
    }
}
