var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
var requireFix = appRoot.require;

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));
var UploadObj = require(path.join(__dirname, 'Queries/Upload'));
var SearchQueryObj = require(path.join(__dirname, 'InlineQueries/SearchQuery'));

var GoogleHelperObj = requireFix('/src/Sites/Google/Helper');

module.exports = class Google extends SiteInteface {
    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._GoogleHelper = new GoogleHelperObj(app);
    }

    /**
     * Load all commands for this website
     */
    register() {
        // register commands
        this._app._QueryHandler.register(new UploadObj(this._app));

        // register inline queries
        this._app._InlineQueryHandler.register(new SearchQueryObj(this._app));

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
    get title() {
        return 'Google Drive';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description() {
        return 'Cloud Storage & File Backup for Photos, Docs & More';
    }

    /**
     * the site's key
     *
     * @returns {string}
     */
    get key() {
        return "google";
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url() {
        return "https://drive.google.com";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    get logoUrl() {
        return "/assets/img/google.png";
    }

    /**
     * supported file types we will allow uploads for, true = wildcard
     *
     * @returns {boolean|[string]}
     */
    get supportedExtensions() {
        return true;
    }
}

