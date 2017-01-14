var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

module.exports = class Login extends HelperInterface {
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

    get name() {
        return "login";
    }

    get pattern() {
        return /\/login/;
    }
}

