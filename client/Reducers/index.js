import { combineReducers } from "redux";

import modal from "./modalReducers";
import user from "./user";
import sites from "./sites";

export default combineReducers({
    modal,
    user,
    sites
});
