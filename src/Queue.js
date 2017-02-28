const crypto = require('crypto');
const winston = require('winston');

module.exports = class Queue {
    constructor(limit = 10) {
        this.limit = limit;
        this.queue = [];
        this.active = {};

        // check queue items
        setInterval(() => {
            if (this.queue.length > 0) {
                if (Object.keys(this.active).length < this.limit) {
                    // there is room, get the first item
                    const firstItem = this.queue.shift();

                    winston.debug('Starting item: ', firstItem);

                    // start this queue item
                    this._start(firstItem);
                }
            }
        }, 100);
    }

    /**
     * returns promise which resolves when this item is allowed to resolve
     *
     * @param type
     * @returns {Promise}
     */
    enqueue(type) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(24, (err, buffer) => {
                const key = buffer.toString('hex');

                // gather info
                const newQueueItem = {
                    started: new Date(),
                    ready: resolve,
                    type: type,
                    key: key
                }

                winston.debug('Enqueued item: ', newQueueItem);

                // check if a spot is already available
                if (this.available()) {
                    this._start(newQueueItem);
                } else {
                    // add the item to the queue
                    this.queue.push(newQueueItem);
                }
            });
        });
    }

    /**
     * Add a new item to the active queue
     *
     * @param queueItem
     * @returns {boolean}
     */
    _start(queueItem) {
        winston.debug(queueItem);

        // check if queue item exists
        if (queueItem) {
            // move queue item to active list
            this.active[queueItem.key] = queueItem;

            // resolve this queue item with the properties
            this.active[queueItem.key].ready(queueItem);

            // return success
            return true;
        }
        return false;
    }

    /**
     * finished a item, remove it
     *
     * @param key
     * @returns {boolean}
     */
    finish(key) {
        // check if item exists
        if (this.active[key]) {

            winston.debug('Finished item: ', key);

            // remove the active item
            delete this.active[key];
            return true;
        }
        return false;
    }

    /**
     * check if queue is full or not
     *
     * @returns {boolean}
     */
    available() {
        return Object.keys(this.active).length <= this.limit;
    }

    /**
     * modify current queue limit
     *
     * @param limit
     */
    setLimit(limit) {
        this.limit = limit;
    }

    /**
     * get current queue limit
     *
     * @returns {number|*}
     */
    getLimit() {
        return this.limit;
    }

    /**
     * get current queue
     *
     * @returns {Array}
     */
    getQueue() {
        return this.queue;
    }

    /**
     * get active queue items
     *
     * @returns {Array}
     */
    getActive() {
        return this.active;
    }
}