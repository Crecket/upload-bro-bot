export default function reducer(state = {
    champions: [],
    fetching: false,
    error: null,
}, action) {

    switch (action.type) {
        case "FETCH_CHAMPIONS":
            return {
                ...state,
                fetching: true
            }
        case "FETCH_CHAMPIONS_FAILED":
            return {
                ...state,
                fetching: false,
                error: action.payload
            }
        case "FETCH_CHAMPIONS_FULFILLED":
            return {
                ...state,
                fetching: false,
                champions: action.payload,
            }
    }

    return {...state};
}
