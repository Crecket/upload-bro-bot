"use strict";

import React from "react";

import {Renderer, Shallow} from "../Helpers/Test/WithContext";
import Home from "./Home";

const siteTestList = require("../Helpers/Test/Data/api-get_providers.json");

describe("<Home />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(
            <Home sites={siteTestList}/>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without sites", () => {
        const tree = Renderer(<Home sites={{}}/>);
        expect(tree).toMatchSnapshot();
    });

    it("lifeCycle will update event works", () => {
        const wrapper = Shallow(<Home sites={{}}/>);
        wrapper.instance().setState({a: true});
    });
});
