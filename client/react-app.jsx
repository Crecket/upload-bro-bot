import React from "react";
import ReactDOM from "react-dom";
import ServiceWorkerRegistration from "./Plugins/ServiceWorkerRegistration";
// async loader and logger
// import ComponentLoader from "./Components/Sub/ComponentLoader";
// const App = ComponentLoader(() => import("./App"));
import App from "./App";

// render the react app
ReactDOM.render(<App />, document.getElementById("app"));
