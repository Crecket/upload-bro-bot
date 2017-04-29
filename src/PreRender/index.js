require("babel-register");

module.exports = async (UploadBro, User = false, Url) => {
    return require("./App")(UploadBro, User, Url);
};
