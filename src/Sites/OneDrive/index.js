var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));

module.exports = class OneDrive extends SiteInteface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Load all commands for this website
     */
    register() {
        return Promise.resolve();
    }

    /**
     * return this site's short name
     *
     * @returns {string}
     */
    get name() {
        return 'OneDrive';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title(){
        return 'Mircosoft One Drive';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description(){
        return 'Get to your files and photos from anywhere, on any device.';
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url(){
        return "https://onedrive.live.com";
    }
}

