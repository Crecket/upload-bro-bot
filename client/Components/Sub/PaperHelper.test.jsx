"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import Wrapper from "../../TestHelpers/Wrapper.jsx";
import PaperHelper from "./PaperHelper.jsx";

describe("<PaperHelper />", () => {
    it("matches snapshot", () => {
        const tree = renderer.create(<Wrapper><PaperHelper /></Wrapper>);

        expect(tree).toMatchSnapshot();
    });

    it("renders children when passed", () => {
        const wrapper = shallow(<PaperHelper><h1>Some Text</h1></PaperHelper>);
        expect(wrapper.contains(<h1>Some Text</h1>)).toBe(true);
    });
});
