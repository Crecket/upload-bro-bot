const winston = require('winston');

module.exports = class Analytics {
    constructor(app, collection_name = 'analytics') {
        this._app = app;

        // store collection we want to use to store analytics data
        this.collection_name = collection_name;
    }

    /**
     * track everything else
     *
     * @param msg
     * @param options
     */
    trackCommand(msg, options) {
        const data = Object.assign(
            this.defaultMsg,
            options,
            {
                type: 'message'
            }
        );
        this.save(data);
    }

    /**
     * track a inline/callback query
     *
     * @param query
     * @param options
     */
    trackQuery(query, options) {
        const data = Object.assign(
            this.defaultMsg,
            options,
            {
                type: 'query'
            }
        );
        this.save(data);
    }

    /**
     * basic file msg track handler
     *
     * @param fileType
     * @param msg
     * @param options
     */
    trackFile(fileType, msg, options) {
        const data = Object.assign(
            this.defaultMsg,
            options,
            {
                type: 'file',
                fileType: fileType
            }
        );
        this.save(data);
    }

    /**
     * save data for analytics
     *
     * @param data
     */
    save(data) {
        this._app._Db
            .collection(this.collection_name)
            .insertOne(data, (err, res) => {
                if (err) winston.error(err);
            });
    }

    /**
     * default values we'll always want to use
     *
     * @returns {{time: Date}}
     */
    get defaultMsg() {
        return {
            time: new Date()
        };
    }
}