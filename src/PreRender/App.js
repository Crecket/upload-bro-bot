import React from "react";
import {StaticRouter} from 'react-router-dom';
import {renderToString} from 'react-dom/server';
import { Provider } from "react-redux";

// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

// the server route polyfill which renders the app shell
import RoutesServer from "../../client/RoutesServer.jsx";

// main app wrapper
import Main from "../../client/Components/Main.jsx";

// the store
import Store from "../../client/Store.jsx";

module.exports = (UploadBro, User, Location) => {
    // generate a modified state object
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
            <StaticRouter location={Location}>
                <Main routesComponent={RoutesServer}/>
            </StaticRouter>
        </Provider>
    );
};
