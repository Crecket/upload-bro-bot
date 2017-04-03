const axios = require('axios');
const Logger = require('../Helpers/Logger');
const store = require('store');

export function setSites(site_list) {
    // update local storage
    store.set('sites', site_list);
    // return the action
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
        axios.post('/api/get_providers')
            .then(response => response.data)
            .then(json => {
                dispatch(setSites(json));
                dispatch(siteNotLoading());
            })
            .catch(err => {
                Logger.error(err);
            });
    }
}

export function siteLoadLocalstorage() {
    setSites(store.get('sites') || []);
    return {type: 'SITE_LOAD_LOCALSTORAGE'};
}

export function siteLoading() {
    return {type: 'SITE_IS_LOADING'};
}

export function siteNotLoading() {
    return {type: 'SITE_IS_NOT_LOADING'};
}

