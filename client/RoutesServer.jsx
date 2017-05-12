import React from "react";
import {Route, Switch} from "react-router-dom";
import {CSSTransitionGroup} from "react-transition-group";
import Loader from "./Components/Sub/Loader";

import Home from "./Pages/Home.jsx";

// route helpers
// import PrivateRoute from "./Components/Sub/PrivateRoute";
// import PublicRoute from "./Components/Sub/PublicRoute";
// import Dashboard from "./Pages/Dashboard.jsx";
// import ThemeTest from "./Pages/ThemeTest.jsx";
// import ProviderLogin from "./Pages/ProviderLogin.jsx";
// import ProviderRemove from "./Pages/ProviderRemove.jsx";
// import ClientLoginCallback from "./Pages/ClientLoginCallback.jsx";
// import NotFound from "./Pages/NotFound.jsx";

// router react component
export default class RoutesServer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Route
                render={({location}) => (
                    <CSSTransitionGroup
                        transitionName="fade"
                        transitionAppear={true}
                        transitionAppearTimeout={300}
                        transitionLeave={false}
                        transitionEnterTimeout={300}
                    >
                        <Switch key={location.key} location={location}>
                            <Route
                                exact
                                path="/"
                                render={props => {
                                    return <Home
                                        {...props}
                                        {...this.props.childProps}
                                    />;
                                }}
                            />
                            <Route path="/theme" component={Loader}/>
                            <Route path="/dashboard" component={Loader}/>
                            <Route path="/remove/:type" component={Loader}/>
                            <Route path="/new/:type" component={Loader}/>
                            <Route
                                path="/login/:type/callback"
                                component={Loader}
                            />

                            <Route component={Loader}/>
                        </Switch>
                    </CSSTransitionGroup>
                )}
            />
        );
    }
}
