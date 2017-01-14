import {combineReducers} from "redux";

import champions from "./championsReducer";
import servers from "./serversReducer";
import modal from "./modalReducers";
import highscores from "./highscoresReducer";
import users from "./userReducer";

export default combineReducers({
    champions,
    servers,
    modal,
    highscores,
    users,
})
