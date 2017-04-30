import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: Component, ...rest }) => {
    // if we have a render function, use it
    // else return a new function which returns the component
    const componentHandler = rest.render ? rest.render : props => Component;
    console.log(!rest.user_info);
    return (
        <Route
            {...rest}
            render={props =>
                (!!rest.user_info
                    ? componentHandler(props)
                    : <Redirect
                          to={{
                              pathname: "/dashboard",
                              state: { from: props.location }
                          }}
                      />)}
        />
    );
};
