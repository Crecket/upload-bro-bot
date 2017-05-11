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
        const siteInfo = this._UploadBro._SiteHandler.getSiteBasic("dropbox");

        // generate the message
        const message =
            `<a href="${siteInfo.url}">Dropbox</a> is a file hosting service operated by American company Dropbox, Inc., ` +
            `headquartered in San Francisco, California, that offers cloud storage, file synchronization, personal cloud, and client software. ` +
            `\n\n<b>Upload:</b> Dropbox supports all files types. The only limitation is that Dropbox does not let you preview all ` +
            `<a href="https://www.dropbox.com/help/mobile/viewable-file-types">file types</a>` +
            `\n\n<b>Sharing:</b> Use '@uploadbro_bot dropbox &lt;search term&gt;' to search for files. ` +
            `\nCurrently Dropbox's search API is so slow  that it may not return any results in time. ` +
            `Telegram expects a result from UploadBro within X seconds and Dropbox might take to long for bigger accounts.` +
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
        return "help_dropbox";
    }

    /**
     * The description for this command
     * @returns {string}
     */
    get description() {
        return `Information about how Dropbox works with UploadBro`;
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
     * @returns {RegExp}dorpbox
     */
    get pattern() {
        return /\/help[ _]?(dropbox|dorpbox|drpbx|dropbx).*$/;
    }
};
