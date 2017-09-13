"use strict";

import React from "react";

import { Renderer } from "../../../WithContext";
import ProviderBlock from "../../../../client/Components/ProviderSites/ProviderBlock.jsx";

const siteTestList = require("../../../Data/api-get_providers.json");
const userInfoList = require("../../../Data/api-get_user.json");

describe("<ProviderBlock />", () => {
    it("matches snapshot with both site and user info", () => {
        const tree = Renderer(
            <ProviderBlock
                siteInfo={siteTestList.google}
                userSiteInfo={userInfoList.provider_sites.google}
            />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without user info", () => {
        const tree = Renderer(
            <ProviderBlock
                siteInfo={siteTestList.google}
                userSiteInfo={false}
            />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without site info", () => {
        const tree = Renderer(
            <ProviderBlock
                siteInfo={false}
                userSiteInfo={userInfoList.provider_sites.google}
            />
        );
        expect(tree).toMatchSnapshot();
    });
});
