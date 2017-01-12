var fs = require('fs');

module.exports = {
    ensureExists: (path, mask) => {
        return new Promise((resolve, reject) => {
            if (typeof mask == 'function') { // allow the `mask` parameter to be optional
                cb = mask;
                mask = "0777";
            }
            fs.mkdir(path, mask, function (err) {
                if (err && err.code !== "EEXIST") {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }
};