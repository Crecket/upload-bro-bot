var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));
var UploadObj = require(path.join(__dirname, 'Queries/Upload'));

module.exports = class Google extends SiteInteface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Load all commands for this website
     */
    register() {
        this._app._QueryHandler.register(new UploadObj(this._app));

        return Promise.resolve();
    }

    /**
     * return this site short name
     *
     * @returns {string}
     */
    get name() {
        return 'Google';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title(){
        return 'Google Drive';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description(){
        return 'Cloud Storage & File Backup for Photos, Docs & More';
    }


    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url(){
        return "https://drive.google.com";
    }
}

