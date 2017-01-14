export default function reducer(state = {
    selectedChampion: 0,
    championData: false,
    doingLookup: false
}, action) {

    switch (action.type) {
        case "LOOKUP_HIGHSCORE_SUCCESS":
            return {
                ...state,
                selectedChampion: action.payload.selectedChampion,
                championData: action.payload.championData,
                doingLookup: false
            }
        case "LOOKUP_HIGHSCORE_FAIL":
            return {
                ...state,
                doingLookup: false
            }
        case "SET_HIGHSCORE_LOADING":
            return {
                ...state,
                doingLookup: true
            }
        case "SELECT_HIGHSCORE_CHAMPION":
            return {
                ...state,
                selectedChampion: action.payload.selectedChampion,
            }
    }

    return state;
}
