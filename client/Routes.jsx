import React from 'react';
import Logger from './Helpers/Logger';
import Main from './Components/Main';

// error handler for async loading
let errorLoading = (err) => {
    Logger.error('Dynamic page loading failed', err);
}

export default {
    path: '',
    component: Main,
    childRoutes: [
        {
            path: '/',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    import('./Pages/Home.jsx')
                        .then((m) => {
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
                        .then((m) => {
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
                        .then((m) => {
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
                        .then((m) => {
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
                        .then((m) => {
                            Logger.debug('Loading NotFound');
                            cb(null, m.default)
                        })
                        .catch(errorLoading);
                })
            }
        },
    ]
};
