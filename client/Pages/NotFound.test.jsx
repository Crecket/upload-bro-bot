"use strict";
import React from "react";

import {Renderer} from "../Helpers/Test/WithContext";
import NotFound from "./NotFound";

describe("<NotFound />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(<NotFound />);
        expect(tree).toMatchSnapshot();
    });
});
