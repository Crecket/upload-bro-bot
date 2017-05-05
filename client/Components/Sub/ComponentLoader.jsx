import React from "react";
import Loadable from "react-loadable";
import LoadingComponent from "./LoadingComponent.jsx";
import Loader from "./Loader.jsx";

export default (importCb, showLoader = false) =>
    Loadable({
        loader: importCb,
        LoadingComponent: showLoader
            ? () => <Loader />
            : LoadingComponent,
        delay: 300
    });
