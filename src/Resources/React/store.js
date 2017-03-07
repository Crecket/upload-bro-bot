import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import logger from "redux-logger";

// fetch all reducers as a bundle
import reducer from "./Reducers/index.js";

// create middleware with logger
var middleware = applyMiddleware(promise(), thunk)
if (process.env.DEBUG === "true") {
    // create middleware with logger
    middleware = applyMiddleware(promise(), thunk, logger())
}


//return the store
export default createStore(reducer, middleware)
