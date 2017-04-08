const fs = require('fs');

module.exports = {
    ensureFolderExists: (path, mask = "0777") => {
        return new Promise((resolve, reject) => {
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
