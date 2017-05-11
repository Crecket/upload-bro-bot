module.exports = class UserHelper {
    constructor(UploadBro) {
        this._UploadBro = UploadBro;
    }

    /**
     * Updates the user's information in mongodb with the new given object
     * @param user
     * @returns {Promise}
     */
    async updateUserTokens(user) {
        return await new Promise((resolve, reject) => {
            const db = this._UploadBro._Db;
            const usersCollection = db.collection("users");

            // update provider sites
            usersCollection
                .updateOne(
                    { _id: user._id },
                    {
                        $set: { provider_sites: user.provider_sites }
                    }
                )
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Removes all data for a specific provider
     * @param user
     * @param type
     * @returns {Promise}
     */
    async removeUserTokens(user, type) {
        return await new Promise((resolve, reject) => {
            const db = this._UploadBro._Db;
            const usersCollection = db.collection("users");

            // remove this type from the user's provider sites
            delete user.provider_sites[type];

            // update provider sites
            usersCollection
                .updateOne(
                    { _id: user._id },
                    {
                        $set: { provider_sites: user.provider_sites }
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
    async getUser(user_id) {
        var db = this._UploadBro._Db;
        var usersCollection = db.collection("users");

        // update provider sites
        return await usersCollection.findOne({ _id: user_id });
    }
};
