import React from "react";
import {Mount, Renderer} from "../../Helpers/Test/WithContext";

import Center from "./Center.jsx";

describe("<Center />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<Center />);
        expect(tree).toMatchSnapshot();
    });

    it("renders children when passed", () => {
        const wrapper = Mount(<Center><p>Some Text</p></Center>);
        expect(wrapper.contains(<p>Some Text</p>)).toBe(true);
    });
});
