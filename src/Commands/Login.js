const fs = require("fs");
const path = require("path");
const Logger = require("../Helpers/Logger");
const HelperInterface = require("../HelperInterface");

module.exports = class Login extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);
        this._UploadBro = UploadBro;
    }

    /**
     * Start screen
     * @param msg
     */
    handle(msg) {
        // setup the message
        let message =
            `You can login and register services by going to ` +
            `<a href="${process.env.WEBSITE_URL}">${process.env.WEBSITE_URL}</a>\n` +
            `We currently support the follower services: \n`;

        // generate a list for all our services
        let supportedSites = this._UploadBro._SiteHandler.sites;
        Object.keys(supportedSites).map(key => {
            var tempSite = supportedSites[key];
            message += ` - <a href="${tempSite.url}">${tempSite.title}</a>: ${tempSite.description}\n`;
        });

        // send the message
        super
            .sendMessage(msg.chat.id, message, {
                parse_mode: "HTML",
                disable_web_page_preview: true
            })
            .then(res => {
                // console.log(res);
            })
            .catch(err => {
                Logger.error(err);
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
     * The description for this command
     * @returns {string}
     */
    get description() {
        return `Login to the website and register new services`;
    }

    /**
     * Returns a string with the <command> - <description>
     * @returns {string}
     */
    get info() {
        return `${this.name} - ${this.description}`;
    }

    /**
     * Pattern used for this command
     * @returns {RegExp}
     */
    get pattern() {
        return /\/login$/;
    }
};
