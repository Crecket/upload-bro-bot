var TelegramBot = require('node-telegram-bot-api');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

var CommandHandler = require(path.join(__dirname, 'Handlers/CommandHandler'));
var SiteHandler = require(path.join(__dirname, 'Handlers/SiteHandler'));
var Logger = require('./Logger');
var Utils = require('./Utils');
var Express = require('./Express');

module.exports = class DropboxApp {
    constructor(token) {
        // Create a new blackjack bot
        this._TelegramBot = new TelegramBot(token, {polling: true});

        // Create new command handler
        this._CommandHandler = new CommandHandler(this._Db, this._TelegramBot);

        // Create new site handler
        this._SiteHandler = new SiteHandler(this._Db, this._TelegramBot, this._CommandHandler);

        // connect to mongodb
        this.connectDb()
            .then((db) => {
                // store the database
                this._Db = db;
            })
            // setup dropbox handler
            .then(this.loadWebsites.bind(this))
            // load all the commands
            .then(this.loadCommands.bind(this))
            // start the event listeners
            .then(this.eventListeners.bind(this))
            // finish setup
            .then(() => {
                // finished loading everything

                // start express listener
                Express(this._Db);
            })
            .catch(Logger.error);
    }

    loadWebsites() {
        Logger.log('Loading websites');

        // Register the websites
        this._SiteHandler.register('dropbox', 'dbx', require(path.join(__dirname, './Sites/Dropbox')));
        this._SiteHandler.register('google', false, require(path.join(__dirname, './Sites/Google')));

        Logger.log('Loaded ' + this._SiteHandler.siteCount + ' sites');

        return Promise.resolve();
    }

    /**
     * Global commands, not specific to a website
     *
     * @returns {Promise.<T>}
     */
    loadCommands() {
        Logger.log('Loading global commands');

        // Add the global commands
        this._CommandHandler.register('help', /\/help/, require(path.join(__dirname,'./Commands/Help')));

        Logger.log('Loaded ' + this._CommandHandler.commandCount + ' commands in total');

        // not used for now
        return Promise.resolve();
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

    eventListeners() {
        // photo message
        this._TelegramBot.on('photo', this.messageFileListener.bind(this));
        this._TelegramBot.on('document', this.messageFileListener.bind(this));

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