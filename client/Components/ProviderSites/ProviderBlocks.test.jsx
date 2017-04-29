"use strict";

import React from "react";
import { StaticRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import Wrapper from "../../TestHelpers/Wrapper.jsx";
import ProviderBlocks from "./ProviderBlocks.jsx";

const siteTestList = require("../../TestHelpers/Data/api-get_providers.json");
const userInfoList = require("../../TestHelpers/Data/api-get_user.json");

describe("<ProviderBlocks />", () => {
    it("matches snapshot", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <ProviderBlocks
                        provider_sites={siteTestList}
                        user_provider_sites={userInfoList.provider_sites}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with no site list and with user list", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <ProviderBlocks
                        provider_sites={{}}
                        user_provider_sites={userInfoList.provider_sites}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with site list and no user list", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <ProviderBlocks
                        provider_sites={siteTestList}
                        user_provider_sites={{}}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with no info", () => {
        const tree = renderer.create(
            <StaticRouter>
                <Wrapper>
                    <ProviderBlocks
                        provider_sites={{}}
                        user_provider_sites={{}}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });
});
