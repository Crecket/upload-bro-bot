var CommandInterface = require('./CommandInterface');

module.exports = class Help extends CommandInterface {
    constructor() {
        super();
    }

    handle(msg, match) {
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

