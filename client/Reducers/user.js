const store = require('store');

export default (state = {
                user_info: store.get('user_info') || false,
                loading: false,
                initialCheck: false
            }, action) => {
    switch (action.type) {
        case "USER_SET_INFO":
            return {
                ...state,
                user_info: action.payload.user_info
            }
        case "USER_LOGOUT":
            return {
                ...state,
                user_info: false
            }
        case "USER_IS_LOADING":
            return {
                ...state,
                loading: true
            }
        case "USER_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            }
        case "USER_INITIAL_CHECK":
            return {
                ...state,
                initialCheck: true
            }
    }
    return state;
}