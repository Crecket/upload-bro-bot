import React from 'react';
import {Router, browserHistory} from 'react-router'

import Logger from './Helpers/Logger';
import Main from './Components/Main';

// error handler for async loading
let errorLoading = (err) => {
    Logger.error('Dynamic page loading failed', err);
}

const routes = {
    path: '',
    component: Main,
    childRoutes: [
        {
            path: '/',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/Home.jsx"));

                    // import('./Pages/Home.jsx')
                    //     .then((m) => {
                    //         Logger.debug('Loading Home');
                    //         cb(null, m.default)
                    //     })
                    //     .catch(errorLoading);
                })
            }
        },
        {
            path: '/new/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/ProviderLogin.jsx"));

                    // import('./Pages/ProviderLogin.jsx')
                    //     .then((m) => {
                    //         Logger.debug('Loading ProviderLogin');
                    //         cb(null, m.default)
                    //     })
                    //     .catch(errorLoading);
                })
            }
        },
        {
            path: '/remove/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/ProviderRemove.jsx"));

                    // import('./Pages/ProviderRemove.jsx')
                    //     .then((m) => {
                    //         Logger.debug('Loading ProviderRemove');
                    //         cb(null, m.default)
                    //     })
                    //     .catch(errorLoading);
                })
            }
        },
        {
            path: '/login/dropbox/callback',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/DropboxLoginCallback.jsx"));

                    // import('./Pages/DropboxLoginCallback.jsx')
                    //     .then((m) => {
                    //         Logger.debug('Loading DropboxLoginCallback');
                    //         cb(null, m.default)
                    //     })
                    //     .catch(errorLoading);
                })
            }
        },
        {
            path: '/*',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/NotFound.jsx"));

                    // import('./Pages/NotFound.jsx')
                    //     .then((m) => {
                    //         Logger.debug('Loading NotFound');
                    //         cb(null, m.default)
                    //     })
                    //     .catch(errorLoading);
                })
            }
        },
    ]
};

export default class Router extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return <Router routes={routes} history={browserHistory}/>;
    };
}

// export the routes
export default Router;


// export default (
//     <Route path="/" component={Main}>
//         {/* default route */}
//         <IndexRoute component={Home}/>
//
//         {/* Routes*/}
//         <Route path='/new/:type' component={ProviderLogin}/>
//         <Route path='/remove/:type' component={ProviderRemove}/>
//         <Route path='/login/dropbox/callback' component={DropboxLoginCallback}/>
//
//         {/* fall back route, if no others are found show 404*/}
//         <Route path='*' component={NotFound}/>
//     </Route>
// );


