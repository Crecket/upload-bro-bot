const crypto = require("crypto");
const Logger = require("./Helpers/Logger.js");

module.exports = class Queue {
    constructor(limit = 10) {
        // limit amount of items in the queue
        this.limit = limit;
        // contains the queue items
        this.queue = [];
        // active items currently in transfer
        this.active = {};

        // contains the interval object to keep track of the queue
        this.timer = false;

        // expire active items after 5 seconds
        this.expireTimeMs = 5000;
        // speed at which the timer runs
        this.timeSpeedMs = 150;

        // start the timer
        this.startTimer();
    }

    /**
     * returns promise which resolves when this item is allowed to resolve
     *
     * @param type
     * @returns {Promise}
     */
    enqueue(type) {
        return new Promise((resolve, reject) => {
            // random key for the queue item
            crypto.randomBytes(24, (err, buffer) => {
                const key = buffer.toString("hex");

                // gather info
                const newQueueItem = {
                    enqueued: new Date(),
                    ready: resolve,
                    type: type,
                    key: key
                };

                // check if a spot is already available
                if (this.available()) {
                    this._start(newQueueItem);
                } else {
                    // add the item to the queue
                    this.queue.push(newQueueItem);
                }

                // start the timer
                this.startTimer();
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
            // remove the active item
            delete this.active[key];
            return true;
        }
        return false;
    }

    /**
     * Start the timer to push the queue and check for expired items
     */
    startTimer() {
        // check queue items every x seconds
        this.timer = setInterval(() => {
            // check if one of the active items has expired
            if (Object.keys(this.active).length > 0) {
                // loop through the active items to see if they have expired
                Object.keys(this.active).forEach(key => {
                    // check if this item has expired
                    if (this.isExpired(this.active[key]) === true) {
                        // finish the item
                        this.finish(key);
                    }
                });
            }
            // check if there are items in the queue
            if (this.queue.length > 0) {
                // check if a limit has been reached
                if (Object.keys(this.active).length < this.limit) {
                    // there is room, get the first item
                    let firstItem = this.queue.shift();
                    // update start time
                    firstItem.started = new Date();
                    // start this queue item
                    this._start(firstItem);
                }
            } else if (Object.keys(this.active).length === 0) {
                // both are empty, stop the queue
                this.stopTimer();
            }
        }, this.timeSpeedMs);
    }

    /**
     * Clear the timer for the queue to stop unnesary power
     */
    stopTimer() {
        if (this.timer) {
            // clear the timer
            clearInterval(this.timer);
            this.timer = false;
        }
    }

    /**
     * check if queue is full or not
     *
     * @returns {boolean}
     */
    available() {
        return Object.keys(this.active).length < this.limit;
    }

    /**
     * Checks if a item has expired
     *
     * @param queueItem
     */
    isExpired(queueItem) {
        if (queueItem.started) {
            return false;
        }
        return true;
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
};
