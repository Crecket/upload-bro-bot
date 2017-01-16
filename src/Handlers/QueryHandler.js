module.exports = class QueryHandler {
    constructor(app) {
        this._app = app;

        this._queries = {};
    }

    /**
     * Register a new query
     *
     * @param obj - a valid class object
     */
    register(obj) {
        // store the query
        this._queries[obj.event] = obj;
    }

    /**
     * Return app
     * @returns {*}
     */
    get app() {
        return this._app;
    }

    /**
     * @returns {{}|*}
     */
    get queries() {
        return this._queries;
    }

    /**
     * @returns int
     */
    get queryCount() {
        return Object.keys(this._queries).length;
    }
}