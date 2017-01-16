var TelegramBot = require('node-telegram-bot-api');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

var CommandHandler = require('./Handlers/CommandHandler');
var SiteHandler = require('./Handlers/SiteHandler');
var QueryHandler = require('./Handlers/QueryHandler');
var Logger = require('./Logger');
var Utils = require('./Utils');
var Express = require('./Express');
var UserHelperObj = require('./UserHelper');

// commands
var HelpObj = require('./Commands/Help');
var KeyboardObj = require('./Commands/Keyboard');
var LoginObj = require('./Commands/Login');

// sites
var DropboxObj = require('././Sites/Dropbox');
var GoogleObj = require('././Sites/Google');

// queries
var MySitesObj = require('./Queries/MySites');
var ScanChatObj = require('./Queries/ScanChat');

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
        this._QueryHandler.register(new ScanChatObj(this));

        Logger.overwrite('Loaded ' + this._QueryHandler.queryCount + " queries            \n");

        // not used for now
        return Promise.resolve();
    }

    /**
     * Event listener for messages with a file added
     * @param msg
     */
    messageFileListener(msg) {
        // TODO get allowed sites for this user
        var file = (!!msg.photo) ? msg.photo[msg.photo.length - 1] : msg.document;

        this._UserHelper.getUser(msg.from.id)
            .then((user_info) => {
                if (user_info) {
                    // user is registered, generate the download buttons
                    var buttonList = [];
                    // loop through existing provider sites
                    Object.keys(user_info.provider_sites).map((key) => {
                        var providerSite = user_info.provider_sites[key];

                        // push item into the button list
                        buttonList.push({
                            text: key.toUpperCase(),
                            callback_data: "upload_" + key + "|" + file.file_id
                        });
                    })

                    if (buttonList.length > 0) {
                        // send the keyboard
                        this._TelegramBot.sendMessage(msg.from.id, "Do you want to upload this file?", {
                            reply_markup: {
                                inline_keyboard: [
                                    buttonList
                                ]
                            }
                        });
                    } else {
                        var message = "Please go to <a href='/login'>/login</a> and add a website to your account";
                        this._TelegramBot.sendMessage(msg.chat.id, message, {
                            parse_mode: "HTML"
                        });
                    }

                } else {
                    // nothing to do, this user isn't registered
                }
            })
            .catch(console.error);

    }

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
     * query_callback event listener
     *
     * @param query
     */
    handleCallbackQuery(query) {
        var queryList = this._QueryHandler.queries;
        var splitData = query.data.split('|');

        var selectedQuery = queryList[splitData[0]];

        // check if the selected query was found
        if (selectedQuery) {
            // start the handle request with this query
            selectedQuery.handle(query)
                .then((query_id, text = "", alert = false, options = {}) => {
                    this.answerCallbackQuery(query.id, text, alert, options);
                })
                .catch((error, text = "", alert = false, options = {}) => {
                    this.answerCallbackQuery(query.id, text, alert, options);
                })
        } else {
            this.answerCallbackQuery(query.id, "We couldn't find this command.").bind(this);
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

    /**
     * Register events
     *
     * @returns {Promise.<T>}
     */
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