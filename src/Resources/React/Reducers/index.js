import {combineReducers} from "redux";

import modal from "./modalReducers";
import user from "./user";

export default combineReducers({
    modal,
    user,
})
