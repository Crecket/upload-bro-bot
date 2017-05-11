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
        const siteInfo = this._UploadBro._SiteHandler.getSiteBasic("gfycat");

        // generate the message
        const message =
            `<a href="${siteInfo.url}">Gfycat</a> is a user-generated short video hosting company founded by `+
            `Richard Rabbat, Dan McEleney, and Jeff Harris. It was a pioneer of the video alternative to GIF revolution in 2013 ` +
            // `\n\n<b>Upload:</b> Gfycat supports all files types. The only limitation is that Gfycat does not let you preview all ` +
            // `<a href="https://www.gfycat.com/help/mobile/viewable-file-types">file types</a>` +
            // `\n\n<b>Sharing:</b> Use '@uploadbro_bot gfycat &lt;search term&gt;' to search for files. ` +
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
        return `Information about how Gfycat works with UploadBro`;
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
     * @returns {RegExp}
     */
    get pattern() {
        return /\/help[ _]?(gfycat|gyfcat|gfycta|gfcat).*/;
    }
};
