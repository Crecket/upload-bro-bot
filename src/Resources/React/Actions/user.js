const axios = require('axios');

export function userSetInfo(user_info) {
    return {
        type: 'USER_SET_INFO',
        payload: {
            user_info: user_info
        }
    };
}
export function userUpdate() {
    return dispatch => {
        axios.post('/get_user')
            .then(response => response.data)
            .then(json => {
                dispatch(userSetInfo(json));
                dispatch(userNotLoading());
            })
            .catch(console.error);
    }
}
export function userLogout() {
    // logout and forget
    axios.get('/logout').then(() => {
        // logged out
    }).catch(console.error);
    // send user logout event
    return {type: 'USER_LOGOUT'};
}
export function userLoading() {
    return {type: 'USER_IS_LOADING'};
}
export function userNotLoading() {
    return {type: 'USER_IS_NOT_LOADING'};
}

