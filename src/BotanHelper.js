const Botan = require('botanio')(process.env.BOTAN_API_TOKEN);

module.exports = {
    basic: (id, command, cb = () => {
    }) => {
        Botan.track({
            from: {
                id: id
            }
        }, command, cb);
    },
    track: (data, command, cb = () => {
    }) => {
        Botan.track(data, command, cb);
    }
};
