"use strict";

import React from "react";
import {StaticRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import {shallow} from "enzyme";

import Wrapper from "../../TestHelpers/Wrapper.jsx";
import ProviderBlock from "./ProviderBlock.jsx";

const siteTestList = require("../../TestHelpers/Data/api-get_providers.json");
const userInfoList = require("../../TestHelpers/Data/api-get_user.json");

describe("<ProviderBlock />", () => {
    it("matches snapshot with both site and user info", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <ProviderBlock
                        siteInfo={siteTestList.google}
                        userSiteInfo={userInfoList.provider_sites.google}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without user info", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <ProviderBlock
                        siteInfo={siteTestList.google}
                        userSiteInfo={false}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without site info", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <ProviderBlock
                        siteInfo={false}
                        userSiteInfo={userInfoList.provider_sites.google}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });
});
