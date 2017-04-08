const fs = require('fs');

module.exports = {
    ensureFolderExists: (path, mask = "0777") => {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, mask, function (err) {
                if (err) {
                    if(err.code === "EEXIST"){
                        return resolve(false);
                    }
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
    }
};
