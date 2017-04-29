import Loadable from "react-loadable";
import LoadingComponent from "./LoadingComponent.jsx";

export default importCb =>
    Loadable({
        loader: importCb,
        LoadingComponent: LoadingComponent,
        delay: 300
    });
