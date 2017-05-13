import React from "react";
import Loadable from "react-loadable";
import LoadingComponent from "./LoadingComponent";
import Loader from "./Loader";

export default (importCb, showLoader = false) =>
    Loadable({
        loader: importCb,
        LoadingComponent: showLoader
            ? () => <Loader />
            : LoadingComponent,
        delay: 300
    });
