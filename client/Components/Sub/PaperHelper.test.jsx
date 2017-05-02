"use strict";
import React from "react";
import { Shallow, Renderer } from "../../TestHelpers/WithContext";
import PaperHelper from "./PaperHelper.jsx";

describe("<PaperHelper />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<PaperHelper />);

        expect(tree).toMatchSnapshot();
    });

    it("renders children when passed", () => {
        const wrapper = Shallow(<PaperHelper><h1>Some Text</h1></PaperHelper>);
        expect(wrapper.contains(<h1>Some Text</h1>)).toBe(true);
    });
});
