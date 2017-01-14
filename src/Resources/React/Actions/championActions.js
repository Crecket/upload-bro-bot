import axios from "axios";
import Logger from '../Helpers/Logger.js';

export function getChampions() {
    return (dispatch) => {
        // check the local storage
        chrome.storage.local.get(['championList'], (res) => {
            // check resutls
            if (res.championList && Object.keys(res.championList).length > 0) {
                Logger.debug('Fetched champion list from local storage');

                // dispatch servers
                dispatch({
                    type: "FETCH_CHAMPIONS_FULFILLED",
                    payload: {...res.championList}
                })
            } else {
                // update the server list from the api
                updateChampions();
            }
        });
    }
}

export function updateChampions() {
    return (dispatch) => {
        // set fetch state
        dispatch({type: "FETCH_CHAMPIONS", payload: {loading: true}});

        // do api call
        axios.get("https://www.masterypoints.com/api/v1.0/static/champions")
            .then((response) => {
                Logger.debug('Fetched champion list from api');

                // store in localstorage
                chrome.storage.local.set({championList: response.data.champions});

                // dispatch fetch champion event
                dispatch({
                    type: "FETCH_CHAMPIONS_FULFILLED",
                    payload: {...response.data.champions}
                })
            })
            .catch((err) => {
                dispatch({
                    type: "FETCH_CHAMPIONS_FAILED",
                    payload: err
                })
            })
    }
}
