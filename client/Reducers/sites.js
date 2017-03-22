const store = require('store');

export default (state = {
                    sites: store.get('sites') || [],
                    loading: false
                }, action) => {
    switch (action.type) {
        case "SITE_SET_INFO":
            return {
                ...state,
                sites: action.payload.sites
            }
        case "SITE_IS_LOADING":
            return {
                ...state,
                loading: true
            }
        case "SITE_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            }
    }
    return state;
}
