var TelegramBot = require('node-telegram-bot-api');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

var CommandHandler = require(path.join(__dirname, 'Handlers/CommandHandler'));
var SiteHandler = require(path.join(__dirname, 'Handlers/SiteHandler'));
var QueryHandler = require(path.join(__dirname, 'Handlers/QueryHandler'));
var Logger = require('./Logger');
var Utils = require('./Utils');
var Express = require('./Express');

// commands
var HelpObj = require(path.join(__dirname, 'Commands/Help'));
var KeyboardObj = require(path.join(__dirname, 'Commands/Keyboard'));
var LoginObj = require(path.join(__dirname, 'Commands/Login'));

// sites
var DropboxObj = require(path.join(__dirname, './Sites/Dropbox'));
var GoogleObj = require(path.join(__dirname, './Sites/Google'));

// queries
var MySitesObj = require(path.join(__dirname, 'Queries/MySites'));

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

        // connect to mongodb
        this.connectDb()
            .then((db) => {
                // store the database
                this._Db = db;
            })
            // setup dropbox handler
            .then(this.loadWebsites.bind(this))
            // load all the queries
            .then(this.loadQueries.bind(this))
            // load all the commands
            .then(this.loadCommands.bind(this))
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
        this._SiteHandler.register(new DropboxObj(this));
        this._SiteHandler.register(new GoogleObj(this));

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
        this._CommandHandler.register(new HelpObj(this));
        this._CommandHandler.register(new KeyboardObj(this));
        this._CommandHandler.register(new LoginObj(this));

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
        this._QueryHandler.register(new MySitesObj(this));

        Logger.overwrite('Loaded ' + this._QueryHandler.queryCount + " queries            \n");

        // not used for now
        return Promise.resolve();
    }

    /**
     * Event listener for messages with a file added
     * @param msg
     */
    messageFileListener(msg) {
        // we currently only support photos and documents
        var file = (!!msg.photo) ? msg.photo : msg.document;

        var directory = __dirname + "/../downloads/" + msg.chat.id;
        // TODO check file size, width/height and other security settings

        Logger.debug(msg);

        Utils.ensureFolderExists(directory, '0744')
            .then(() => {

                this._TelegramBot.downloadFile(
                    file[0].file_id,
                    directory
                ).then((info) => {
                    Logger.log(info);
                })
            })
            .catch(Logger.error);
    }

    /**
     * query_callback event listener
     *
     * @param query
     */
    handleCallbackQuery(query) {
        var queryList = this._QueryHandler.queries;
        var selectedQuery = queryList[query.data];

        // check if the selected query was found
        if (selectedQuery) {
            // start the handle request with this query
            selectedQuery.handle(query)
                .then((result_message = "", alert = false, options = {}) => {
                    this.answerCallbackQuery(query.id, result_message, alert, options)
                })
                .catch((error_message = "", alert = false, options = {}) => {
                    this.answerCallbackQuery(query.id, error_message, alert, options)
                })
        } else {
            this.answerCallbackQuery(query.id, "We couldn't find this command. This is probably our fault.")
        }
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
        this._TelegramBot.answerCallbackQuery(id, text, alert, options)
            .then((result) => {
                Logger.log("Responded to query " + id + ":", result);
            })
            .catch(() => {
                Logger.log("Failed to respond to query " + id);
            });
    }

    eventListeners() {
        // file messages
        this._TelegramBot.on('photo', this.messageFileListener.bind(this));
        this._TelegramBot.on('document', this.messageFileListener.bind(this));

        // callback query listener
        this._TelegramBot.on('callback_query', this.handleCallbackQuery.bind(this));

        return Promise.resolve();

        this._TelegramBot.on('inline_query', (inline_query) => {
            return;
            console.log("inline_query");
            console.log(inline_query);
            this._TelegramBot.answerInlineQuery(inline_query.id, [
                {
                    title: "title1",
                    caption: "caption1",
                    description: "description1",
                    type: "photo",
                    id: "blackjack_bot_test_id1",
                    photo_url: "https://www.masterypoints.com/assets/cards/2_of_hearts.png",
                    thumb_url: "https://www.masterypoints.com/assets/cards/2_of_hearts.png",
                },
                {
                    title: "title2",
                    caption: "caption2",
                    description: "description2",
                    type: "photo",
                    id: "blackjack_bot_test_id2",
                    photo_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                    thumb_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                },
                {
                    title: "title3",
                    caption: "caption3",
                    description: "description3",
                    type: "photo",
                    id: "blackjack_bot_test_id3",
                    photo_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                    thumb_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                },
                {
                    title: "title4",
                    caption: "caption4",
                    description: "description4",
                    type: "photo",
                    id: "blackjack_bot_test_id4",
                    photo_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                    thumb_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                },
                {
                    type: "article",
                    id: "blackjack_bot_article_id",
                    title: "Hit",
                    input_message_content: {
                        message_text: "Hit",
                        // parse_mode: "",
                        disable_web_page_preview: true
                    },
                }
            ])
        })
    }
}