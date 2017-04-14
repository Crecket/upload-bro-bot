"use strict";
import React from "react";
import renderer from "react-test-renderer";

import Wrapper from "../TestHelpers/Wrapper.jsx";
import NotFound from "./NotFound.jsx";

describe("<NotFound />", () => {
    it("matches snapshot", () => {
        const tree = renderer.create(<Wrapper><NotFound /></Wrapper>);

        expect(tree).toMatchSnapshot();
    });
});
