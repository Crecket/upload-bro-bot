import NavLink from "./NavLink.jsx";

import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

describe("<NavLink />", () => {
    it("matches snapshot", () => {
        const tree = renderer.create(<NavLink />);
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with children", () => {
        const tree = renderer.create(<NavLink><h1>Some Text</h1></NavLink>);
        expect(tree).toMatchSnapshot();
    });

    it("renders children when passed", () => {
        const wrapper = shallow(<NavLink><h1>Some Text</h1></NavLink>);
        expect(wrapper.contains(<h1>Some Text</h1>)).toBe(true);
    });
});
