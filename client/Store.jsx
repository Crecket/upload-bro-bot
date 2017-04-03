import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import logger from "redux-logger";

// fetch all reducers as a bundle
import reducer from "./Reducers/index.js";

// create the middleware for this store
let middleware;
if (process.env.DEBUG === true) {
    // create middleware with logger
    middleware = applyMiddleware(promise(), thunk, logger());
} else {
    // default middleware
    middleware = applyMiddleware(promise(), thunk);
}

//return the store
export default createStore(reducer, middleware);
