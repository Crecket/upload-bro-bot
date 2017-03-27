import React from 'react';
import Loadable from 'react-loadable';
import LoadingComponent from './LoadingComponent';

export default (importCb, webpackRequireWeakId = false) => {
    if (webpackRequireWeakId) {
        return Loadable({
            loader: importCb,
            LoadingComponent: LoadingComponent,
            delay: 200,
            webpackRequireWeakId: webpackRequireWeakId,
        })
    }
    return Loadable({
        loader: importCb,
        LoadingComponent: LoadingComponent,
        delay: 200
    })

};
