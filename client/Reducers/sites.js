const store = require("store");

export const defaultState = {
    sites: store.get("sites") || {},
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "SITE_SET_INFO": {
            // update local storage
            store.set("sites", action.payload.sites);
            return {
                ...state,
                sites: action.payload.sites
            };
        }

        case "SITE_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "SITE_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };
    }
    return state;
};
