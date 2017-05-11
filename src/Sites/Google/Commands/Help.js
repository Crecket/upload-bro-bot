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
        const siteInfo = this._UploadBro._SiteHandler.getSiteBasic("google");

        // generate the message
        const message =
            `<a href="${siteInfo.url}">Google Drive</a> is a file storage and synchronization service developed by Google. ` +
            `\n\n<b>Upload:</b> Google Drive supports by far <a href="https://support.google.com/drive/answer/37603">most files types</a>` +
            `\n\n<b>Sharing:</b> Use '@uploadbro_bot google &lt;search term&gt;' to search for files. `+
            `\nUploadBro does <b>NOT</b> automatically make the files public, usually the user you share the file `+
            `with will have to <a href="https://support.google.com/drive/answer/6211862">request access</a>. ` +
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
        return "help_google";
    }

    /**
     * The description for this command
     * @returns {string}
     */
    get description(){
        return `Information about how Google Drive works with UploadBro`;
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
        return /\/help[ _]?(google|google drive|googledrive|google_drive).*$/;
    }
};
