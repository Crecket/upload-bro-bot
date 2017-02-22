"use strict";

let TelegramBot = require('node-telegram-bot-api');
let MongoClient = require('mongodb').MongoClient;
let fs = require('fs');
let del = require('del');
let path = require('path');
let Cacheman = require('cacheman');
let MongoDbEngine = require('cacheman-mongo');
let requireFix = require('app-root-path').require;

// utilities
let Logger = requireFix('/src/Logger');
let Utils = requireFix('/src/Utils');

// express server
let Express = requireFix('/src/Express');

// handlers and other helpers
let CommandHandler = requireFix('/src/Handlers/CommandHandler');
let SiteHandler = requireFix('/src/Handlers/SiteHandler');
let QueryHandler = requireFix('/src/Handlers/QueryHandler');
let EventHandlersObj = requireFix('/src/Handlers/EventHandler');
let InlineQueryHandlerObj = requireFix('/src/Handlers/InlineQueryHandler');
let UserHelperObj = requireFix('/src/UserHelper');

// commands
let HelpCommandObj = requireFix('/src/Commands/Help');
let StartCommandObj = requireFix('/src/Commands/Start');
let LoginCommandObj = requireFix('/src/Commands/Login');

// sites
let DropboxSiteObj = requireFix('/src/Sites/Dropbox');
let GoogleSiteObj = requireFix('/src/Sites/Google');
let ImgurSiteObj = requireFix('/src/Sites/Imgur');

// queries
let RefreshSitesObj = requireFix('/src/Queries/RefreshSites');
let ScanChatQueryObj = requireFix('/src/Queries/ScanChat');

// event handlers

module.exports = class DropboxApp {
    constructor(token) {

        // create botan sdk helper
        this._BotanHelper = require('./BotanHelper');

        // Create a new blackjack bot
        this._TelegramBot = new TelegramBot(token, {polling: true});

        // Create new command handler
        this._CommandHandler = new CommandHandler(this);

        // Create new site handler
        this._SiteHandler = new SiteHandler(this);

        // Create new site handler
        this._QueryHandler = new QueryHandler(this);

        // create event listeners handlers
        this._EventHandler = new EventHandlersObj(this);

        // create event listeners handlers
        this._InlineQueryHandler = new InlineQueryHandlerObj(this);

        // user helper object
        this._UserHelper = new UserHelperObj(this);

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
                        console.log('Cleared downloads folder:\n', paths.join('\n'));
                        resolve();
                    });
                })
            })
            // finish setup
            .then(() => {
                // finished loading everything
                console.log("Loaded the following commands:");
                console.log(this._CommandHandler.info);

                // start analytics
                this._BotanHelper.basic('bot', 'Start');

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
                    Logger.log("Connected to " + process.env.MONGODB_URL);
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
        Logger.overwrite('Loading websites');

        // Register the websites
        this._SiteHandler.register(new DropboxSiteObj(this));
        this._SiteHandler.register(new ImgurSiteObj(this));
        this._SiteHandler.register(new GoogleSiteObj(this));

        Logger.overwrite('Loaded ' + this._SiteHandler.siteCount + " sites      \n");

        return Promise.resolve();
    }

    /**
     * Global commands, not specific to a website
     *
     * @returns {Promise.<T>}
     */
    loadCommands() {
        Logger.overwrite('Loading global commands');

        // Add the global commands
        this._CommandHandler.register(new HelpCommandObj(this));
        this._CommandHandler.register(new StartCommandObj(this));
        this._CommandHandler.register(new LoginCommandObj(this));

        Logger.overwrite('Loaded ' + this._CommandHandler.commandCount + " commands            \n");

        // not used for now
        return Promise.resolve();
    }

    /**
     * Load event handlers for callback_query
     * @returns {Promise.<T>}
     */
    loadQueries() {
        Logger.overwrite('Loading queries');

        // Add the query handlers
        this._QueryHandler.register(new RefreshSitesObj(this));
        this._QueryHandler.register(new ScanChatQueryObj(this));

        Logger.overwrite('Loaded ' + this._QueryHandler.queryCount + " queries            \n");

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
                Logger.log("Responded to query " + id);
            })
            .catch(() => {
                Logger.log("Failed to respond to query " + id);
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
            // console.log('group_chat_created', msg);
        });
        this._TelegramBot.on('message', (msg) => {
            // console.log('message', msg);
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