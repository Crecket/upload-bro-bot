import React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransitionGroup } from "react-transition-group";
import Cl from "./Components/Sub/ComponentLoader";

// route helpers
import PrivateRoute from "./Components/Sub/PrivateRoute";
import PublicRoute from "./Components/Sub/PublicRoute";

// load the pages
// const Home = Cl(() => import("./Pages/Home"), true);
import Home from './Pages/Home';
const Dashboard = Cl(() => import("./Pages/Dashboard"), true);
const ProviderRemove = Cl(() => import("./Pages/ProviderRemove"), true);
const ThemeTest = Cl(() => import("./Pages/ThemeTest"), true);
const ProviderLogin = Cl(() => import("./Pages/ProviderLogin"), true);
const DropboxLoginCb = Cl(() => import("./Pages/DropboxLoginCallback"), true);
const NotFound = Cl(() => import("./Pages/NotFound"));

// https://reacttraining.com/react-router/web/api/Route/render-func for transitions

// router react component
export default class RoutesClient extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        return (
            <Route
                render={({ location }) => (
                    <CSSTransitionGroup
                        transitionName="fade"
                        transitionAppear={true}
                        transitionAppearTimeout={300}
                        transitionLeave={false}
                        transitionEnterTimeout={300}
                    >
                        <Switch key={location.key} location={location}>
                            <PublicRoute
                                exact
                                path="/"
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
                                path="/login/dropbox/callback"
                                render={props => (
                                    <DropboxLoginCb
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
                    </CSSTransitionGroup>
                )}
            />
        );
    }
}
