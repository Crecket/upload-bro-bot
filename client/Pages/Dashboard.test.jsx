"use strict";

import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { StaticRouter } from "react-router-dom";

import Wrapper from "../TestHelpers/Wrapper.jsx";
import Dashboard from "./Dashboard.jsx";

const userInfoList = require("../TestHelpers/Data/api-get_user.json");
const siteInfoList = require("../TestHelpers/Data/api-get_providers.json");

describe("<Dashboard />", () => {
    it("matches snapshot with verified user", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <Dashboard sites={siteInfoList} user_info={userInfoList} />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without verified user", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <Dashboard sites={siteInfoList} user_info={false} />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without verified user and without sites", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <Dashboard sites={{}} user_info={false} />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });
});
