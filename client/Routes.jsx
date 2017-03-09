import React from 'react';

import Logger from './Helpers/Logger';

// main component
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
                    import('./Pages/Home.jsx')
                        .then(function (m) {
                            Logger.debug('Loading Home');
                            cb(null, m.default)
                        })
                        .catch(errorLoading);
                })
            }
        },
        {
            path: '/new/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    import('./Pages/ProviderLogin.jsx')
                        .then(function (m) {
                            Logger.debug('Loading ProviderLogin');
                            cb(null, m.default)
                        })
                        .catch(errorLoading);
                })
            }
        },
        {
            path: '/remove/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    import('./Pages/ProviderRemove.jsx')
                        .then(function (m) {
                            Logger.debug('Loading ProviderRemove');
                            cb(null, m.default)
                        })
                        .catch(errorLoading);
                })
            }
        },
        {
            path: '/login/dropbox/callback',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    import('./Pages/DropboxLoginCallback.jsx')
                        .then(function (m) {
                            Logger.debug('Loading DropboxLoginCallback');
                            cb(null, m.default)
                        })
                        .catch(errorLoading);
                })
            }
        },
        {
            path: '/*',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    import('./Pages/NotFound.jsx')
                        .then(function (m) {
                            Logger.debug('Loading NotFound');
                            cb(null, m.default)
                        })
                        .catch(errorLoading);
                })
            }
        },
    ]
};

// export the routes
export default routes;


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


