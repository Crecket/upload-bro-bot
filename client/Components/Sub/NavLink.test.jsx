import React from "react";
import { StaticRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import NavLink from "./NavLink.jsx";

describe("<NavLink />", () => {
    it("matches snapshot", () => {
        const tree = renderer.create(
            <StaticRouter><NavLink to="/" /></StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with children", () => {
        const tree = renderer.create(
            <StaticRouter>
                <NavLink to="/"><h1>Some Text</h1></NavLink>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("renders children when passed", () => {
        const wrapper = shallow(
            <StaticRouter>
                <NavLink to="/"><h1>Some Text</h1></NavLink>
            </StaticRouter>
        );
        expect(wrapper.contains(<h1>Some Text</h1>)).toBe(true);
    });
});
