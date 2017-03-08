const axios = require('axios');
const Logger = require('../Helpers/Logger');

export function setSites(site_list) {
    return {
        type: 'SITE_SET_INFO',
        payload: {
            sites: site_list
        }
    };
}
export function siteUpdate() {
    return dispatch => {
        dispatch(siteLoading());
        axios.get('/get_providers')
            .then(response => response.data)
            .then(json => {
                dispatch(setSites(json));
                dispatch(siteNotLoading());
            })
            .catch(Logger.error);
    }
}

export function siteLoading() {
    return {type: 'SITE_IS_LOADING'};
}

export function siteNotLoading() {
    return {type: 'SITE_IS_NOT_LOADING'};
}

