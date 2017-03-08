const axios = require('axios');
const Logger = require('../Helpers/Logger');

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
        dispatch(userLoading());
        axios.post('/get_user', {_csrf: csrfToken})
            .then(response => response.data)
            .then(json => {
                // update user info and stop loading state
                dispatch(userSetInfo(json));
                dispatch(userNotLoading());
                dispatch(userInitialCHeck());
            })
            .catch((err) => {
                // finish initial check
                dispatch(userInitialCHeck());
                Logger.error(err);
            });
    }
}

export function userLogout() {
    // logout and forget
    axios.get('/logout').then(() => {
        // logged out
    }).catch(Logger.error);
    // send user logout event
    return {type: 'USER_LOGOUT'};
}

export function userLoading() {
    return {type: 'USER_IS_LOADING'};
}

export function userNotLoading() {
    return {type: 'USER_IS_NOT_LOADING'};
}

export function userInitialCHeck() {
    return dispatch => {
        // setTimeout(() =>{
        dispatch({type: 'USER_INITIAL_CHECK'});
        // }, 2000);
    }
}

