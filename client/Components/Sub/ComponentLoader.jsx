import Loadable from 'react-loadable';
import LoadingComponent from './LoadingComponent.jsx';

export default (importCb, webpackRequireWeakId = false) => {
    // if we have a webpack weak id, use it
    if (webpackRequireWeakId) {
        return Loadable({
            loader: importCb,
            LoadingComponent: LoadingComponent,
            delay: 300,
            webpackRequireWeakId: webpackRequireWeakId,
        });
    }

    // default loadable
    return Loadable({
        loader: importCb,
        LoadingComponent: LoadingComponent,
        delay: 300
    });
};
