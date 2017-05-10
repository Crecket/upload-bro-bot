const fs = require("fs");
const path = require("path");
const Logger = require("../../../Helpers/Logger");
const HelperInterface = require("../../../HelperInterface");

module.exports = class Help extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);
        this._UploadBro = UploadBro;
    }

    handle(msg) {
        // get supported extensions for this type
        const supportedExtensions = this._UploadBro._SiteHandler.getSiteBasic(
            "imgur"
        ).supportedExtensions;

        // add dot to the extensions
        const formattedExtension = supportedExtensions.map(
            ext => `.${ext}`
        );
        const message =
            `Imgur only allows image uploads with the following extensions: ${formattedExtension.join(", ")}` +
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
     * Returns a string with the <command> - <description>
     * @returns {string}
     */
    get info() {
        return `${this.name} - Information about how Imgur works with UploadBro`;
    }

    /**
     * Pattern used for this command
     * @returns {RegExp}
     */
    get pattern() {
        return /\/help_imgur$/;
    }
};
