import path from "path";
import React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";

// either require the
if (process.env.NODE_ENV === "development") {
    var RoutesServer = require("../../client/RoutesServer.jsx").default;
    var Store = require("../../client/Store.jsx").default;
    var Main = require("../../client/Components/Main.jsx").default;
} else {
    var RoutesServer = require("../client/RoutesServer").default;
    var Store = require("../client/Store").default;
    var Main = require("../client/Components/Main").default;
}

injectTapEventPlugin();

module.exports = (UploadBro, User, Location) => {
    // generate a modified state object
    let modifiedState = Object.assign(
        {},
        {
            sites: Object.assign(
                {},
                {
                    sites: UploadBro._SiteHandler.siteList,
                    loading: false
                }
            ),
            user: Object.assign(
                {},
                {
                    user_info: User
                }
            )
        }
    );

    return renderToString(
        <Provider store={Store(modifiedState)}>
            <StaticRouter location={Location}>
                <Main routesComponent={RoutesServer} />
            </StaticRouter>
        </Provider>
    );
};
