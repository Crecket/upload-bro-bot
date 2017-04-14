"use strict";

import React from "react";
import renderer from "react-test-renderer";

import Wrapper from "../../TestHelpers/Wrapper.jsx";
import ProviderBlock from "./ProviderBlock.jsx";

const siteTestList = require("../../TestHelpers/Data/api-get_providers.json");
const userInfoList = require("../../TestHelpers/Data/api-get_user.json");

describe("<ProviderBlock />", () => {
    it("matches snapshot with both site and user info", () => {
        const tree = renderer.create(
            <Wrapper>
                <ProviderBlock
                    siteInfo={siteTestList.google}
                    userSiteInfo={userInfoList.provider_sites.google}
                />
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without user info", () => {
        const tree = renderer.create(
            <Wrapper>
                <ProviderBlock
                    siteInfo={siteTestList.google}
                    userSiteInfo={false}
                />
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without site info", () => {
        const tree = renderer.create(
            <Wrapper>
                <ProviderBlock
                    siteInfo={false}
                    userSiteInfo={userInfoList.provider_sites.google}
                />
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });
});
