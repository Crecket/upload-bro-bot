import {combineReducers} from "redux";

import modal from "./modal";
import snackbar from "./snackbar";
import user from "./user";
import sites from "./sites";

export default combineReducers({
    modal,
    snackbar,
    user,
    sites
});
