import Logger from '../Helpers/Logger';

export default function reducer(state = {
    userList: {},
    doingLookup: false,
    selectedUser: false
}, action) {

    var REMOVE_USER = () => {
        // payload: lookupKey
        let newState = {...state};

        // check if current user is the deleted user
        if (newState.selectedUser === action.payload.lookupKey) {
            newState.selectedUser = false;
        }

        // remove from list
        delete newState.userList[action.payload.lookupKey];

        // store in online storage
        chrome.storage.sync.set({userList: newState.userList});

        return newState;
    }

    var SET_USER_LOADING = () => {
        return {
            ...state,
            doingLookup: action.payload.doingLookup
        }
    };

    var ADD_USER = () => {
        // payload: lookupKey, result
        let tempList = {...state.userList};

        // add the new user to the list
        tempList[action.payload.selectedUser] = {
            data: action.payload.result,
            added: Math.floor(Date.now() / 1000)
        };

        // limit to 5 users in the list
        if (Object.keys(tempList).length > 5) {
            // remove the first item
            delete tempList[Object.keys(tempList)[0]];
        }

        // store in online storage
        chrome.storage.sync.set({userList: tempList});

        // return new state
        return {
            ...state,
            userList: tempList,
            selectedUser: action.payload.selectedUser
        }
    }

    var SELECT_USER = () => {
        // return new state
        return {
            ...state,
            selectedUser: action.payload.lookupKey,
        }
    }

    var CLEAR_USERS = () => {
        // clear user list in localstorage
        chrome.storage.sync.set({userList: []});

        // return new empty user list
        return {
            ...state,
            userList: {},
        }
    }

    var LOAD_USERS = () => {
        return {
            ...state,
            userList: action.payload.userList
        }
    }

    switch (action.type) {
        case "REMOVE_USER":
            return REMOVE_USER();
        case "SET_USER_LOADING":
            return SET_USER_LOADING();
        case "ADD_USER":
            return ADD_USER();
        case "SELECT_USER":
            return SELECT_USER();
        case "CLEAR_USERS":
            return CLEAR_USERS();
        case "LOAD_USERS":
            return LOAD_USERS();
    }

    return state;
}
