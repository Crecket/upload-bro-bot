var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

module.exports = class Help extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    handle(msg) {
        var message = "<b>Available commands</b>\n" +
            "- <a href='/help'>/help</a>: Display this command \n" +
            "- <a href='/login'>/login</a>: Show the login url to connect the supported websites to your telegram account" +
            "";

        super.sendMessage(msg.chat.id, message, {
            parse_mode: "HTML"
        });
    }

    get name() {
        return "help";
    }

    get pattern() {
        return /\/help/;
    }
}

