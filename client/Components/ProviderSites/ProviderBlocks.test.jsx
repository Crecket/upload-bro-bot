"use strict";

import React from "react";

import { Renderer } from "../../TestHelpers/WithContext";
import ProviderBlocks from "./ProviderBlocks.jsx";

const siteTestList = require("../../TestHelpers/Data/api-get_providers.json");
const userInfoList = require("../../TestHelpers/Data/api-get_user.json");

describe("<ProviderBlocks />", () => {
    it("matches snapshot", () => {
        const tree = Renderer(
            <ProviderBlocks
                provider_sites={siteTestList}
                user_provider_sites={userInfoList.provider_sites}
            />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with no site list and with user list", () => {
        const tree = Renderer(
            <ProviderBlocks
                provider_sites={{}}
                user_provider_sites={userInfoList.provider_sites}
            />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with site list and no user list", () => {
        const tree = Renderer(
            <ProviderBlocks
                provider_sites={siteTestList}
                user_provider_sites={{}}
            />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot with no info", () => {
        const tree = Renderer(
            <ProviderBlocks provider_sites={{}} user_provider_sites={{}} />
        );
        expect(tree).toMatchSnapshot();
    });
});
