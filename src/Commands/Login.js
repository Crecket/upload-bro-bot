var fs = require('fs');
var path = require('path');

var HelperInterface = rootRequire('src/HelperInterface');

module.exports = class Login extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Start screen
     * @param msg
     */
    handle(msg) {
        // setup the message
        var message = "You can login and register services by going to " +
            "<a href='" + process.env.WEBSITE_URL + "/login'" +
            ">the website.</a> \nWe currently support the follower services: \n";

        // generate a list for all our services
        var supportedSites = this._app._SiteHandler.sites;
        Object.keys(supportedSites).map((key) => {
            var tempSite = supportedSites[key];
            message += " - <a href='" + tempSite.url + "'>" + tempSite.title + "</a>";
            message += ": " + tempSite.description;
            message += "\n";
        })

        // send the message
        super.sendMessage(msg.chat.id, message, {
            parse_mode: "HTML",
            disable_web_page_preview: true
        }).then((res) => {
            // console.log(res);
        }).catch((err) => {
            winston.error(err);
        });
    }

    /**
     * The name for this command
     * @returns {string}
     */
    get name() {
        return "login";
    }

    /**
     * Returns a string with the <command> - <description>
     * @returns {string}
     */
    get info() {
        return "login - Login to the website and register new services";
    }

    /**
     * Pattern used for this command
     * @returns {RegExp}
     */
    get pattern() {
        return /\/login/;
    }
}

