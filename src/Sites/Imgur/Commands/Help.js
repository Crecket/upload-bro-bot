const fs = require("fs");
const path = require("path");
const Logger = require("../../../Helpers/Logger");
const HelperInterface = require("../../../HelperInterface");

module.exports = class Help extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);
        this._UploadBro = UploadBro;
    }

    /**
     * Handle the commands request
     * @param msg
     */
    handle(msg) {
        // get site info for this type
        const siteInfo = this._UploadBro._SiteHandler.getSiteBasic("imgur");
        // get supported extensions for this type
        const supportedExtensions = siteInfo.supportedExtensions;
        // add dot to the extensions
        const formattedExtension = supportedExtensions.map(ext => `.${ext}`);

        // generate the message
        const message =
            `<a href="${siteInfo.url}">Imgur</a> is an online image sharing community and popular image host. ` +
            `\n\n<b>Upload:</b> Currently Imgur only supports image uploads with the following extensions: ${formattedExtension.join(", ")}` +
            `\n\n<b>Sharing:</b> Use '@uploadbro_bot imgur' to list the 50 most recent images from your imgur account.` +
            ``;

        super
            .sendMessage(msg.chat.id, message, {
                parse_mode: "HTML"
            })
            .then(res => {})
            .catch(Logger.error);
    }

    /**
     * The name for this command
     * @returns {string}
     */
    get name() {
        return "help_imgur";
    }

    /**
     * The description for this command
     * @returns {string}
     */
    get description(){
        return `Information about how Imgur works with UploadBro`;
    }

    /**
     * Returns a string with the <name> - <description>
     * @returns {string}
     */
    get info() {
        return `${this.name} - ${this.description}`;
    }

    /**
     * Pattern used for this command
     * @returns {RegExp}imgurigmru
     */
    get pattern() {
        return /\/help[ _]?(imgur|imgru|imgr).*$/;
    }
};
