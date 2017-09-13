import React from "react";
import { Mount, Renderer } from "../../../WithContext";

import Center from "../../../../client/Components/Sub/Center.jsx";

describe("<Center />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<Center />);
        expect(tree).toMatchSnapshot();
    });

    it("renders children when passed", () => {
        const wrapper = Mount(
            <Center>
                <p>Some Text</p>
            </Center>
        );
        expect(wrapper.contains(<p>Some Text</p>)).toBe(true);
    });
});
