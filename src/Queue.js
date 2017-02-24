class Queue {
    constructor(app, limit = 10) {
        this._app = app;

        this.limit = limit;
        this.queue = [];
        this.active = {};

        // check queue items
        setInterval(() => {
            if (this.queue.length > 0) {
                if (Object.keys(this.active).length < this.limit) {
                    // there is room
                    const firstItem = Object.keys(this.active)[0];
                }
            }
        }, 100);
    }

    // returns promise which resolves when this item is allowed to resolve
    enqueue(key, type) {
        return new Promise((resolve, reject) =>{
            // add the resolve to the queue
            this.queue.push({
                started: new Date(),
                ready: resolve,
                type: type,
                key: key
            });

            // check if a spot is already available
            if(this.available()){
                this._start(key);
            }
        });
    }

    /**
     * Add a new item to the active queue
     *
     * @param key
     * @returns {boolean}
     */
    _start(key) {
        // check if queue item exists
        if (this.queue[key]) {
            // move queue item to active list
            this.active[key] = Object.assign({}, this.queue[key]);

            // delete queue item
            delete this.queue[key];

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
     * check if queue is full or not
     *
     * @returns {boolean}
     */
    available() {
        return Object.keys(this.active).length >= this.limit;
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