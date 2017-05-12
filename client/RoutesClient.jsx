import React from "react";
import { Route, Switch } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";

import Cl from "./Components/Sub/ComponentLoader";
import FadesIn from "./Components/Transitions/FadesIn";
import PrivateRoute from "./Components/Sub/PrivateRoute";
import PublicRoute from "./Components/Sub/PublicRoute";
const FadesInSwitch = FadesIn(Switch);

// load the pages
import Home from "./Pages/Home";

// const Home = Cl(() => import(/* webpackChunkName: "page" */ "./Pages/Home"), true);
const Dashboard = Cl(
    () => import(/* webpackChunkName: "dashboard" */ "./Pages/Dashboard"),
    true
);
const ProviderRemove = Cl(
    () =>
        import(
            /* webpackChunkName: "providerremove" */ "./Pages/ProviderRemove"
        ),
    true
);
const ThemeTest = Cl(
    () => import(/* webpackChunkName: "themetest" */ "./Pages/ThemeTest"),
    true
);
const ProviderLogin = Cl(
    () =>
        import(/* webpackChunkName: "providerlogin" */ "./Pages/ProviderLogin"),
    true
);
const ClientLoginCallback = Cl(
    () =>
        import(
            /* webpackChunkName: "dropboxlogin" */ "./Pages/ClientLoginCallback"
        ),
    true
);
const NotFound = Cl(() =>
    import(/* webpackChunkName: "notfound" */ "./Pages/NotFound")
);

// router react component
export default class RoutesClient extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Route
                render={wrapperProps => (
                    <TransitionGroup>
                        <FadesInSwitch
                            key={wrapperProps.location.key}
                            location={wrapperProps.location}
                        >
                            <PublicRoute
                                exact
                                path="/"
                                user_info={this.props.user_info}
                                render={props => (
                                    <Home
                                        {...props}
                                        {...this.props.childProps}
                                    />
                                )}
                            />

                            <Route
                                path="/theme"
                                render={props => (
                                    <ThemeTest
                                        {...props}
                                        {...this.props.childProps}
                                    />
                                )}
                            />

                            <PrivateRoute
                                user_info={this.props.user_info}
                                path="/dashboard"
                                render={props => {
                                    return (
                                        <Dashboard
                                            {...props}
                                            {...this.props.childProps}
                                        />
                                    );
                                }}
                            />
                            <PrivateRoute
                                user_info={this.props.user_info}
                                path="/remove/:type"
                                render={props => {
                                    return (
                                        <ProviderRemove
                                            {...props}
                                            {...this.props.childProps}
                                        />
                                    );
                                }}
                            />
                            <PrivateRoute
                                user_info={this.props.user_info}
                                path="/new/:type"
                                render={props => (
                                    <ProviderLogin
                                        {...props}
                                        {...this.props.childProps}
                                    />
                                )}
                            />
                            <PrivateRoute
                                user_info={this.props.user_info}
                                path="/login/:type/callback"
                                render={props => (
                                    <ClientLoginCallback
                                        {...props}
                                        {...this.props.childProps}
                                    />
                                )}
                            />

                            {/* a empty path we use for fallback routes in the service worker*/}
                            <Route path="/shell" render={props => null} />

                            <Route
                                render={props => (
                                    <NotFound
                                        {...props}
                                        {...this.props.childProps}
                                    />
                                )}
                            />
                        </FadesInSwitch>
                    </TransitionGroup>
                )}
            />
        );
    }
}
