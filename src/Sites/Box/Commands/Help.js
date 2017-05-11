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
        // get site info for this type
        const siteInfo = this._UploadBro._SiteHandler.getSiteBasic("box");

        // generate the message
        const message =
            `<a href="${siteInfo.url}">Box</a>, based in Redwood City, California, is an online file sharing and content management ` +
            `service for businesses. The company uses a freemium business model to provide cloud storage and file hosting for personal accounts and businesses ` +
            `\n\n<b>Upload:</b> Box supports most <a href="https://developer.box.com/reference#section-supported-file-types">file types</a>` +
            `\n\n<b>Sharing:</b> Due to the way that data is returned from Box.com returns we currently do not support file sharing for Box.com` +
            // `\n\n<b>Sharing:</b> Use '@uploadbro_bot box &lt;search term&gt;' to search for files. ` +
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
    get description() {
        return `Information about how Imgur works with UploadBro`;
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
        return /\/help[ _]?(box|bx|bxo).*$/;
    }
};
