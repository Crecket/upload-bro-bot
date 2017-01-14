export default function reducer(state = {
    servers: {},
    fetching: false,
    error: null,
}, action) {

    switch (action.type) {
        case "FETCH_SERVERS":
            return {
                ...state,
                fetching: true
            }
        case "FETCH_SERVERS_FAILED":
            return {
                ...state,
                fetching: false,
                error: action.payload
            }
        case "FETCH_SERVERS_FULFILLED":
            return {
                ...state,
                fetching: false,
                servers: action.payload,
            }
    }

    return {...state};
}
