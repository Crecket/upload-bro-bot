var TelegramBot = require('node-telegram-bot-api');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var ProviderHandler = require('./ProviderHandler');
var Logger = require('./Logger');
var Express = require('./Express');

function ensureExists(path, mask) {
    return new Promise((resolve, reject) => {
        if (typeof mask == 'function') { // allow the `mask` parameter to be optional
            cb = mask;
            mask = "0777";
        }
        fs.mkdir(path, mask, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

module.exports = class DropboxApp {
    constructor(token) {
        // Create a new blackjack bot
        this._TelegramBot = new TelegramBot(token, {polling: true});

        // photo
        this._TelegramBot.on('photo', (msg) => {
            var directory = __dirname + "/../downloads/" + msg.from.id;

            ensureExists(directory, '0744')
                .then(() => {
                    this._TelegramBot.downloadFile(
                        msg.photo[0].file_id,
                        directory
                    ).then((info) => {
                        Logger.log(info);
                    })
                })
                .catch(Logger.error);


        });

        // // random file
        // this._TelegramBot.on('document', (msg) => {
        //     this._TelegramBot.downloadFile(
        //         'AgADBAADsqcxG_q1lQfV5K60PAtzBJnFnBkABEwDhRbmgGRENKAAAgI',
        //         // 'AgADBAADsacxG_q1lQfvlzY6iDKClfmQZBkABHxtquqWN7YYcSMCAAEC',
        //         __dirname + "/../downloads"
        //     )
        //         .then((info) => {
        //             Logger.log(info);
        //         })
        // });

        // connect to mongodb
        this.connectDb()
            .then((db) => {
                // store the database
                this._Db = db;

                // start express listener
                Express(db);
            })
            // first load the providers
            .then(this.providers.bind(this))
            // start the event listeners
            .then(this.eventListeners.bind(this))
            // finish setup
            .then(() => {
                // finished loading everything
            })
            .catch(Logger.error);
    }

    providers() {
        // Create new handler
        this._ProviderHandler = new ProviderHandler(this._Db, this._TelegramBot);

        // Add the commands
        this._ProviderHandler.register('help', /\/help/, require('./Providers/Help'));
        this._ProviderHandler.register('download', /\/download/, require('./Providers/Download'));
        this._ProviderHandler.register('login', /\/login/, require('./Providers/Login'));
        // this._ProviderHandler.register('help param', /\/help (.+)/, require('./Providers/Help'));

        Logger.log('Loaded ' + this._ProviderHandler.commandCount + ' providers');

        // not used for now
        return Promise.resolve();
    }

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

    eventListeners() {
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