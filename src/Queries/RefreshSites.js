const fs = require('fs');
const path = require('path');

const HelperInterface = rootRequire('src/HelperInterface');

module.exports = class MySites extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Handle a query
     *
     * @param query
     * @returns {Promise}
     */
    handle(query) {
        return new Promise((resolve, reject) => {
            // get the user for this request
            this._app._UserHelper.getUser(query.from.id)
                .then((user_info) => {
                    var buttonSiteList = [];
                    if (user_info) {
                        // user is registered, generate the download buttons
                        buttonSiteList = this.generateProviderButtons(user_info);
                    }

                    // send the message
                    this.editMessage(query.message.text, {
                        chat_id: query.message.chat.id,
                        message_id: query.message.message_id,
                        reply_markup: {
                            inline_keyboard: [
                                buttonSiteList,
                                [{
                                    text: "Refresh sites",
                                    callback_data: "refresh_provider_buttons"
                                }]
                            ]
                        },
                        parse_mode: "HTML"
                    }).then(() => {
                        resolve();
                    }).catch(reject);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "refresh_provider_buttons";
    }
}

