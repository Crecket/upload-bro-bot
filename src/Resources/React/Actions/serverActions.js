import axios from "axios";
import Logger from '../Helpers/Logger.js';

export function getServers() {
    return (dispatch) => {
        // check the local storage
        chrome.storage.local.get(['serverList'], (res) => {
            // check resutls
            if (res.serverList && Object.keys(res.serverList).length > 0) {
                Logger.info('Fetched server list from local storage');

                // dispatch servers
                dispatch({
                    type: "FETCH_SERVERS_FULFILLED",
                    payload: {...res.serverList}
                })
            } else {
                // update the server list from the api
                updateServers();
            }
        });
    }
}

export function updateServers() {
    return (dispatch) => {
        // set fetch state
        dispatch({type: "FETCH_SERVERS"});

        // do api call
        axios.get("https://www.masterypoints.com/api/v1.0/static/servers")
            .then((response) => {

                // store in localstorage
                chrome.storage.local.set({serverList: response.data.servers});

                // dispatch fetch server event
                dispatch({
                    type: "FETCH_SERVERS_FULFILLED",
                    payload: {...response.data.servers}
                })
            })
            .catch((err) => {
                dispatch({
                    type: "FETCH_SERVERS_FAILED",
                    payload: err
                })
            })
    }
}
