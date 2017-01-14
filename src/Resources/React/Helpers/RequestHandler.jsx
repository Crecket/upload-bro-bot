var RequestHandler = {
    request: function (url, callback, callbackErr, data) {
        if (!data) {
            data = {};
        }
        var request = $.ajax({
            url: url,
            method: 'GET',
            data: data
        });
        request.done(callback);
        request.error(callbackErr);
    }
};


export default RequestHandler;