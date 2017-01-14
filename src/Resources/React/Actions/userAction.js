import Logger from '../Helpers/Logger';
import RequestHandler from '../Helpers/RequestHandler';

// remove a use from the list
export function removeUser(lookupKey) {
    return {
        type: "REMOVE_USER",
        payload: {
            lookupKey: lookupKey
        }
    }
}

// basic helper to show modal messages
var modalDispatch = (dispatch, message, title) => {
    dispatch({
        type: 'MODAL_OPEN',
        payload: {
            message: message,
            title: title
        }
    });
}

// add a new user
export function addUser(username, server) {
    return (dispatch) => {
        var lookupKey = username + server;

        // start lookup status
        dispatch({
            type: "SET_USER_LOADING",
            payload: {
                doingLookup: true
            }
        });

        Logger.info('Doing lookup for username: ' + username);

        // send GA event
        gaSearchSummoner(username + ' : ' + server);

        // not found, do new request
        RequestHandler.request(
            API_URL + "summoner/" + username + "/" + server,
            (result)=> {
                // only get the top 5 champions
                result.summoner_mastery.mastery_data = result.summoner_mastery.mastery_data.slice(0, 5);

                // dispatch it to the client
                dispatch({
                    type: "ADD_USER",
                    payload: {
                        selectedUser: lookupKey,
                        result: result,
                    }
                });

                // finish status
                dispatch({
                    type: "SET_USER_LOADING",
                    payload: {
                        doingLookup: false
                    }
                });
            },
            (err)=> {
                // TODO modal !!!!!!!!!!!!!

                if (err.status === 404) {
                    modalDispatch(dispatch, "User was not found: " + username, "Summoner not found.");
                } else if (err.status === 503) {
                    modalDispatch(dispatch, "The Riot API is unavailable so we can't do any lookups right now.", "Something went wrong");
                } else if (err.status === 500) {
                    var result = false;
                    try {
                        // if it a actual error we may not get json back so use a try/catch
                        result = JSON.parse(err.responseText)
                    } catch (ex) {
                    }

                    if (result) {
                        modalDispatch(dispatch, result.message, "Something went wrong");
                    } else {
                        modalDispatch(dispatch, "We couldn\'t properly retrieve the summoner information", "Something went wrong");
                    }
                }

                // finish status
                dispatch({
                    type: "SET_USER_LOADING",
                    payload: {
                        doingLookup: false
                    }
                });
            }
        );
    };
}

// select a user
export function selectUser(lookupKey) {
    return {
        type: "SELECT_USER",
        payload: {
            lookupKey: lookupKey
        }
    }
}

// completely clear a list
export function clearUsers() {
    return {
        type: "CLEAR_USERS"
    }
}

// load users from storage if we have any
export function loadUsers() {
    return (dispatch) => {

        // check the online storage if we have old summoner stored
        chrome.storage.sync.get(['userList'], (res) => {
            // check results
            if (res.userList && Object.keys(res.userList).length > 0) {
                Logger.info('Fetched summoner list from storage');

                dispatch({
                    type: "LOAD_USERS",
                    payload: {
                        userList: res.userList
                    }
                });
            }
        });
    }
}

