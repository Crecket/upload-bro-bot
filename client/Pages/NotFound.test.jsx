"use strict";
import React from "react";

import { Shallow, Renderer } from "../Helpers/Test/WithContext";
import NotFound from "./NotFound.jsx";

describe("<NotFound />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<NotFound />);
        expect(tree).toMatchSnapshot();
    });
});
