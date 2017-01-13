var fs = require('fs');
var path = require('path');

var CommandInterface = require(path.join(__dirname, '/CommandInterface'));

module.exports = class Help extends CommandInterface {
    constructor() {
        super();
    }

    handle(msg) {
        var loginUrl = process.env.WEBSITE_URL;
        var message = "*Click here to setup your account!* \n" +
            "[" + loginUrl + "](" + loginUrl + ")";

        super.sendMessage(msg.chat.id, message, {
            parse_mode: "Markdown"
        });
    }
}

