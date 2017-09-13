import React from "react";
import { Mount, Renderer } from "../../../WithContext";

import TitleBar from "../../../../client/Components/Sub/TitleBar.jsx";

describe("<TitleBar />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<TitleBar />);
        expect(tree).toMatchSnapshot();
    });

    it("renders title text when passed", () => {
        const wrapper = Mount(<TitleBar>Some Text</TitleBar>);
        expect(wrapper.contains(<h1>Some Text</h1>)).toBe(true);
    });
});
