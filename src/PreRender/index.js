import Logger from "../Helpers/Logger";
Logger.debug('Enabled PreRender');
module.exports = async (UploadBro, User = false, Url) => {
    const App = require("./App");
    return App(UploadBro, User, Url);
};
