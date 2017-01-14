var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

module.exports = class Keyboard extends HelperInterface {
    constructor() {
        super();
    }

    handle(msg) {
        super.sendMessage(msg.chat.id, "Select a button: ", {
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

