import React from "react";
import { Provider } from "react-redux";
import { Router, browserHistory, createMemoryHistory } from "react-router";
const renderToString = require("react-dom/server");

// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

// main app
import Routes from "../../Client/Routes.jsx";
import Store from "../../Client/Store.jsx";

module.exports = (UploadBro, User, Location) => {
    let modifiedState = Object.assign({},  {
        sites: Object.assign({},  {
            sites: UploadBro._SiteHandler.siteList,
            loading: false
        }),
        user: Object.assign({}, {
            user_info: User
        })
    });

    return renderToString(
        <Provider store={Store(modifiedState)}>
            <Router routes={Routes}
                    history={createMemoryHistory(Location)} />
        </Provider>
    );
};
