const fs = require("fs");
const path = require("path");
const Logger = require("../Helpers/Logger");
const HelperInterface = require("../HelperInterface");

module.exports = class Start extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);

        this._UploadBro = UploadBro;
    }

    /**
     * Start screen
     * @param msg
     */
    handle(msg) {
        // get the user for this request
        this._UploadBro._UserHelper
            .getUser(msg.from.id)
            .then(user_info => {
                // setup the message
                var message = "I'm the <b>UploadBro bot</b>. \n";
                message +=
                    "I can help you upload and download files to and from multiple services" +
                    " like Google Drive and Dropbox. \n\n" +
                    "Use the <a href='/help'>/help</a> command for more help or " +
                    "use <a href='/login'>/login</a> UploadBro. \n\n" +
                    "<b>WARNING: </b> UploadBro will <b>NEVER</b> " +
                    "directly ask you for a password!";

                // send the message
                super
                    .sendMessage(msg.chat.id, message, {
                        parse_mode: "HTML"
                    })
                    .then(res => {
                        // console.log(res);
                    })
                    .catch(Logger.error);
            })
            .catch(Logger.error);
    }

    /**
     * The name for this command
     * @returns {string}
     */
    get name() {
        return "start";
    }

    /**
     * The description for this command
     * @returns {string}
     */
    get description() {
        return `Show the getting started information`;
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
        return /\/start$/;
    }
};
