"use strict";

import React from "react";
import { Renderer } from "../../WithContext";

import Dashboard from "../../../client/Pages/Dashboard";

const userInfoList = require("../../Data/api-get_user.json");
const siteInfoList = require("../../Data/api-get_providers.json");

describe("<Dashboard />", () => {
    it("matches snapshot with verified user", () => {
        const tree = Renderer(
            <Dashboard sites={siteInfoList} user_info={userInfoList} />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without verified user", () => {
        const tree = Renderer(
            <Dashboard sites={siteInfoList} user_info={false} />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without verified user and without sites", () => {
        const tree = Renderer(<Dashboard sites={{}} user_info={false} />);
        expect(tree).toMatchSnapshot();
    });
});
