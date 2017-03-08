export default {
    getHashParams: () => {
        var hashParams = {};
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) {
                return decodeURIComponent(s.replace(a, " "));
            },
            q = window.location.hash.substring(1);

        while (e = r.exec(q))
            hashParams[d(e[1])] = d(e[2]);

        return hashParams;
    },
    ucfirst: (str) => {
        str += ''
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1)
    }
};