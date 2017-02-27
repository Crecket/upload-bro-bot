const fs = require('fs');

module.exports = {
    ensureFolderExists: (path, mask) => {
        return new Promise((resolve, reject) => {
            if (typeof mask == 'function') { // allow the `mask` parameter to be optional
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