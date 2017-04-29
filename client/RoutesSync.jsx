import React from "react";

// main wrapper
import Main from "./Components/Main";
import FadesIn from "./Components/Transitions/FadesIn";

import Home from "./Pages/Home.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import ThemeTest from "./Pages/ThemeTest.jsx";
import ProviderLogin from "./Pages/ProviderLogin.jsx";
import ProviderRemove from "./Pages/ProviderRemove.jsx";
import DropboxLoginCallback from "./Pages/DropboxLoginCallback.jsx";
import NotFound from "./Pages/NotFound.jsx";

// list of routes
export default {
    path: "",
    component: Main,
    childRoutes: [
        {
            path: "/",
            component: FadesIn(Home)
        },
        {
            path: "/dashboard",
            component: FadesIn(Dashboard)
        },
        {
            path: "/theme",
            component: FadesIn(ThemeTest)
        },
        {
            path: "/new/:type",
            component: FadesIn(ProviderLogin)
        },
        {
            path: "/remove/:type",
            component: FadesIn(ProviderRemove)
        },
        {
            path: "/login/dropbox/callback",
            component: FadesIn(DropboxLoginCallback)
        },
        {
            path: "/*",
            component: FadesIn(NotFound)
        }
    ]
};
