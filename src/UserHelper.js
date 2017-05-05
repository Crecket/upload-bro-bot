module.exports = class UserHelper {
    constructor(app) {
        this._app = app;
    }

    /**
     *
     * @param user
     * @returns {Promise}
     */
    async updateUserTokens(user) {
        return await new Promise((resolve, reject) => {
            var db = this._app._Db;
            var usersCollection = db.collection("users");

            // update provider sites
            usersCollection
                .updateOne(
                    {_id: user._id},
                    {
                        $set: {provider_sites: user.provider_sites}
                    }
                )
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     *
     * @param user_id
     * @returns {Promise}
     */
    getUser(user_id) {
        return new Promise((resolve, reject) => {
            var db = this._app._Db;
            var usersCollection = db.collection("users");

            // update provider sites
            usersCollection
                .findOne({_id: user_id})
                .then(resolve)
                .catch(reject);
        });
    }
};
