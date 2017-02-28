"use strict";

const TelegramBot = require('node-telegram-bot-api');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const del = require('del');
const path = require('path');
const Cacheman = require('cacheman');
const MongoDbEngine = require('cacheman-mongo');
const winston = require('winston');

// utilities
let Utils = rootRequire('src/Utils');

// express server
let Express = rootRequire('src/Express');

// handlers and other helpers
const CommandHandler = rootRequire('src/Handlers/CommandHandler');
const SiteHandler = rootRequire('src/Handlers/SiteHandler');
const QueryHandler = rootRequire('src/Handlers/QueryHandler');
const EventHandlersObj = rootRequire('src/Handlers/EventHandler');
const InlineQueryHandlerObj = rootRequire('src/Handlers/InlineQueryHandler');
const UserHelperObj = rootRequire('src/UserHelper');
const QueueObj = rootRequire('src/Queue');
const AnalyticsObj = rootRequire('src/Analytics');

// commands
const HelpCommandObj = rootRequire('src/Commands/Help');
const StartCommandObj = rootRequire('src/Commands/Start');
const LoginCommandObj = rootRequire('src/Commands/Login');

// sites
const DropboxSiteObj = rootRequire('src/Sites/Dropbox');
const GoogleSiteObj = rootRequire('src/Sites/Google');
const ImgurSiteObj = rootRequire('src/Sites/Imgur');

// queries
const RefreshSitesObj = rootRequire('src/Queries/RefreshSites');
const ScanChatQueryObj = rootRequire('src/Queries/ScanChat');

// event handlers

module.exports = class App {
    constructor(token) {
        // Create a new blackjack bot
        this._TelegramBot = new TelegramBot(token, {polling: true});

        // create a queue object and analytics helper
        this._Queue = new QueueObj(1);
        this._Analytics = new AnalyticsObj();

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
                var engine = new MongoDbEngine(db, {collection: 'cache'});

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
                        winston.debug('Cleared downloads folder:\n', paths.join('\n'));
                        resolve();
                    });
                })
            })
            // finish setup
            .then(() => {
                // finished loading everything
                winston.info("Loaded the following commands:");
                console.log(this._CommandHandler.info);

                // start express listener
                Express(this);
            })
            .catch(winston.error);

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
                    winston.info("Connected to " + process.env.MONGODB_URL);
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
        this._SiteHandler.register(new DropboxSiteObj(this));
        this._SiteHandler.register(new ImgurSiteObj(this));
        this._SiteHandler.register(new GoogleSiteObj(this));

        winston.info('Loaded ' + this._SiteHandler.siteCount + " sites");

        return Promise.resolve();
    }

    /**
     * Global commands, not specific to a website
     *
     * @returns {Promise.<T>}
     */
    loadCommands() {
        // Add the global commands
        this._CommandHandler.register(new HelpCommandObj(this));
        this._CommandHandler.register(new StartCommandObj(this));
        this._CommandHandler.register(new LoginCommandObj(this));

        winston.info('Loaded ' + this._CommandHandler.commandCount + " commands");

        // not used for now
        return Promise.resolve();
    }

    /**
     * Load event handlers for callback_query
     * @returns {Promise.<T>}
     */
    loadQueries() {
        // Add the query handlers
        this._QueryHandler.register(new RefreshSitesObj(this));
        this._QueryHandler.register(new ScanChatQueryObj(this));

        winston.info('Loaded ' + this._QueryHandler.queryCount + " queries");

        // not used for now
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
                winston.info("Responded to query " + id);
            })
            .catch(() => {
                winston.info("Failed to respond to query " + id);
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
            winston.debug('group_chat_created', msg);
        });
        this._TelegramBot.on('message', (msg) => {
            winston.debug('message', msg);
        });

        // callback query listener
        this._TelegramBot.on('callback_query', (msg) => {
            fn._EventHandler.callbackQuery(msg);
        });

        // inline query search event
        this._TelegramBot.on('inline_query', (msg) => {
            fn._EventHandler.inlineQuery(msg);
        });

        return Promise.resolve();
    }
}