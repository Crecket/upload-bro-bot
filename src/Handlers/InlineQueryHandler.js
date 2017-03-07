module.exports = class InlineQueryHandler {
    constructor(app) {
        this._app = app;

        this._inlineQueries = {};
    }

    /**
     * Register a new inline query
     *
     * @param obj - a valid class object
     */
    register(obj) {
        // store the query
        this._inlineQueries[obj.name] = obj;
    }

    /**
     * @returns {{}|*}
     */
    get inlineQueries() {
        return this._inlineQueries;
    }

    /**
     * @returns int
     */
    get inlineQueryCount() {
        return Object.keys(this._inlineQueries).length;
    }
}