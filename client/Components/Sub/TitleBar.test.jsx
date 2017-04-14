import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import TitleBar from "./TitleBar.jsx";

describe("<TitleBar />", () => {
    it("matches snapshot", () => {
        const tree = renderer.create(<TitleBar />);
        expect(tree).toMatchSnapshot();
    });

    it("renders title text when passed", () => {
        const wrapper = shallow(<TitleBar>Some Text</TitleBar>);
        expect(wrapper.contains(<h1>Some Text</h1>)).toBe(true);
    });
});
