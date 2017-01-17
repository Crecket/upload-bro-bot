var TelegramBot = require('node-telegram-bot-api');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
var Cacheman = require('cacheman');
var MongoDbEngine = require('cacheman-mongo');
var requireFix = require('app-root-path').require;

// utilities
var Logger = requireFix('/src/Logger');
var Utils = requireFix('/src/Utils');

// express server
var Express = requireFix('/src/Express');

// handlers and other helpers
var CommandHandler = requireFix('/src/Handlers/CommandHandler');
var SiteHandler = requireFix('/src/Handlers/SiteHandler');
var QueryHandler = requireFix('/src/Handlers/QueryHandler');
var UserHelperObj = requireFix('/src/UserHelper');

// commands
var HelpCommandObj = requireFix('/src/Commands/Help');
var StartCommandObj = requireFix('/src/Commands/Start');

// sites
var DropboxSiteObj = requireFix('/src/./Sites/Dropbox');
var GoogleSiteObj = requireFix('/src/./Sites/Google');

// queries
var MySitesQueryObj = requireFix('/src/Queries/MySites');
var ScanChatQueryObj = requireFix('/src/Queries/ScanChat');

// event handlers
var EventHandlersObj = requireFix('/src/EventHandlers');

module.exports = class DropboxApp {
    constructor(token) {

        // Create a new blackjack bot
        this._TelegramBot = new TelegramBot(token, {polling: true});

        // Create new command handler
        this._CommandHandler = new CommandHandler(this);

        // Create new site handler
        this._SiteHandler = new SiteHandler(this);

        // Create new site handler
        this._QueryHandler = new QueryHandler(this);

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
            // finish setup
            .then(() => {
                // finished loading everything

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
        this._QueryHandler.register(new MySitesQueryObj(this));
        this._QueryHandler.register(new ScanChatQueryObj(this));

        Logger.overwrite('Loaded ' + this._QueryHandler.queryCount + " queries            \n");

        // not used for now
        return Promise.resolve();
    }

    // TODO add this as func
    downloadFile(msg) {
        // we currently only support photos and documents
        var file = (!!msg.photo) ? msg.photo[msg.photo.length - 1] : msg.document;

        var directory = __dirname + "/../downloads/" + msg.chat.id;
        Logger.debug(msg);

        // assert the lower folder exists
        Utils.ensureFolderExists(directory, '0744').then(() => {
            // download the file
            this._TelegramBot.downloadFile(
                file.file_id,
                directory
            ).then((finalPath) => {
                Logger.log(finalPath);
                var fileExtension = path.extname(finalPath);
                var targetName = __dirname + "/../downloads/" + msg.chat.id + "/" + file.file_id + fileExtension;

                fs.rename(finalPath, targetName, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            })
        }).catch(Logger.error);
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
                Logger.log("Responded to query " + id + ":", result);
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
        // create event listeners event
        var EventListeners = new EventHandlersObj(this);

        // file messages
        this._TelegramBot.on('audio', EventListeners.messageFileLIstener.bind(this));
        this._TelegramBot.on('video', EventListeners.messageFileLIstener.bind(this));
        this._TelegramBot.on('voice', EventListeners.messageFileLIstener.bind(this));
        this._TelegramBot.on('photo', EventListeners.messageFileLIstener.bind(this));
        this._TelegramBot.on('document', EventListeners.messageFileLIstener.bind(this));

        // callback query listener
        this._TelegramBot.on('callback_query', EventListeners.callbackQuery.bind(this));

        // inline query search event
        this._TelegramBot.on('inline_query', EventListeners.inlineQuery.bind(this))

        return Promise.resolve();

    }
}