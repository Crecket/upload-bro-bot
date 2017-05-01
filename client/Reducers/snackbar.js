export default function reducer(state = {
    message: "",
    duration: 4000,
    snackbarOpen: false,
}, action) {
    switch (action.type) {
        case "SNACKBAR_OPEN":
            return {
                ...state,
                snackbarOpen: true,
                message: action.payload.message,
                duration: action.payload.duration
            }
        case "SNACKBAR_CLOSE":
            return {
                ...state,
                snackbarOpen: false
            }
    }
    return state;
}
