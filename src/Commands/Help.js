var fs = require('fs');
var path = require('path');

var CommandInterface = require(path.join(__dirname, '/CommandInterface'));

module.exports = class Help extends CommandInterface {
    constructor() {
        super();
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
}

