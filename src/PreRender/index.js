require("babel-register");

module.exports = async (UploadBro, User = false, Url) => {
    const App = require("./App");
    return App(UploadBro, User, Url);
};
