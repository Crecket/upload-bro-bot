const winston = rootRequire('src/Helpers/Winston.js');

module.exports = class Analytics {
    constructor(app, collection_name = 'analytics') {
        this._app = app;

        // store collection we want to use to store analytics data
        this.collection_name = collection_name;
    }

    /**
     * generic track command
     *
     * @param msg
     * @param type
     * @param options
     */
    track(msg, type = 'message', options = {}) {
        const data = Object.assign(
            this.defaultMsg,
            options,
            {
                msgId: msg.id,
                from: msg.from.username,
                chatType: msg.message.type,
                type: type
            }
        );
        this.save(data);
    }

    /**
     * basic file msg track handler
     *
     * @param msg
     * @param fileType
     * @param options
     */
    trackFile(msg, fileType, options = {}) {
        const data = Object.assign(
            this.defaultMsg,
            options,
            {
                msgId: msg.id,
                from: msg.from.username,
                chatType: msg.chat.type,
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