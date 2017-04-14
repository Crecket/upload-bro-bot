export default function reducer(
    state = {
        message: "",
        title: "",
        modalOpen: false
    },
    action
) {
    switch (action.type) {
        case "MODAL_OPEN":
            return {
                ...state,
                modalOpen: true,
                message: action.payload.message,
                title: action.payload.title
            };

        case "MODAL_CLOSE":
            return {
                ...state,
                modalOpen: false
            };
    }
    return state;
}
