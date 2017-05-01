import React from "react";
import { Route, Switch } from "react-router-dom";
import ComponentLoader from "./Components/Sub/ComponentLoader";

// route helpers
import PrivateRoute from "./Components/Sub/PrivateRoute";
import PublicRoute from "./Components/Sub/PublicRoute";

// asyncl oad the pages
const Home = ComponentLoader(() => import("./Pages/Home"), true);
const Dashboard = ComponentLoader(() => import("./Pages/Dashboard"), true);
const ProviderRemove = ComponentLoader(
    () => import("./Pages/ProviderRemove"),
    true
);
const ThemeTest = ComponentLoader(() => import("./Pages/ThemeTest"), true);
const ProviderLogin = ComponentLoader(
    () => import("./Pages/ProviderLogin"),
    true
);
const DropboxLoginCallback = ComponentLoader(
    () => import("./Pages/DropboxLoginCallback"),
    true
);
const NotFound = ComponentLoader(() => import("./Pages/NotFound"));

// router react component
export default class CustomRouter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        return (
            <Route
                render={({ location }) => (
                    <Switch key={location.key} location={location}>
                        <PublicRoute
                            exact
                            path="/"
                            render={props => (
                                <Home {...props} {...this.props.childProps} />
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
                            path="/login/dropbox/callback"
                            render={props => (
                                <DropboxLoginCallback
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <Route
                            render={props => (
                                <NotFound
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />
                    </Switch>
                )}
            />
        );
    }
}
