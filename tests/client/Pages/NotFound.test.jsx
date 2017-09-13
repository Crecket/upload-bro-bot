"use strict";
import React from "react";

import { Renderer } from "../../WithContext";
import NotFound from "../../../client/Pages/NotFound";

describe("<NotFound />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<NotFound />);
        expect(tree).toMatchSnapshot();
    });
});
