var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

module.exports = class Keyboard extends HelperInterface {
    constructor() {
        super();
    }

    /**
     *Show a keyboard
     * @param msg
     */
    handle(msg) {
        super.sendMessage(msg.chat.id, "Select a button, and this is text to make this box longer: ", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Login",
                            url: "https://www.masterypoints.com"
                        },
                        {
                            text: "My sites",
                            callback_data: "my_sites"
                        },
                        {
                            text: "Scan chat",
                            callback_data: "scan_chat"
                        },
                    ]
                ]
            }
        });
    }

    get name() {
        return "keyboard";
    }

    get pattern() {
        return /\/keyboard/;
    }
}

