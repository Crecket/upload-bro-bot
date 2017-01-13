var fs = require('fs');
var path = require('path');

var CommandInterface = require(path.join(__dirname, '/CommandInterface'));

module.exports = class Help extends CommandInterface {
    constructor() {
        super();
    }

    handle(msg) {
        super.sendMessage(msg.chat.id, "Select a button: ", {
            reply_markup: {
                keyboard: [
                    [
                        {text: "Key1"},
                        {text: "key2"}
                    ]
                ],
                one_time_keyboard: true
            }
        });
    }
}

