import React from "react";
import {Mount, Renderer} from "../../Helpers/Test/WithContext";

import NavLink from "./NavLink.jsx";

describe("<NavLink />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<NavLink to="/"/>);
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with children", () => {
        const tree = Renderer(<h1>Some Text</h1>);
        expect(tree).toMatchSnapshot();
    });

    it("renders children when passed", () => {
        const wrapper = Mount(<NavLink to="/"><h1>Some Text</h1></NavLink>);
        expect(wrapper.contains(<h1>Some Text</h1>)).toBe(true);
    });
});
