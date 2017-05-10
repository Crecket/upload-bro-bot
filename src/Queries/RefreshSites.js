const fs = require("fs");
const path = require("path");
const Logger = require("../Helpers/Logger");
const HelperInterface = require("../HelperInterface");

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
    async handle(query) {
        // get the user for this request
        const user_info = await this._app._UserHelper.getUser(query.from.id);

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
                    [
                        {
                            text: "Refresh sites",
                            callback_data: "refresh_provider_buttons"
                        }
                    ]
                ]
            },
            parse_mode: "HTML"
        });
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "refresh_provider_buttons";
    }
};
