"use strict";
import React from "react";

import { Renderer } from "../TestHelpers/WithContext";
import NotFound from "./NotFound.jsx";

describe("<NotFound />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<NotFound />);
        expect(tree).toMatchSnapshot();
    });
});
