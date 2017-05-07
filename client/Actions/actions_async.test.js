require('dotenv').config();
import React from "react";
import nock from "nock";

import * as sitesActions from "./sites";
import * as userActions from "./user";

describe("actions asynchronous", () => {
    afterEach(function() {
        nock.cleanAll();
    });

    describe("user", () => {
        it("should create a set userinfo action", () => {

        });
    });

    describe("sites", () => {
        it("should create a set sites action with a example site", () => {
            const sites = [{ title: "test_site" }];
            const expected = {
                type: "SITE_SET_INFO",
                payload: {
                    sites: sites
                }
            };

            nock(process.env.WEBSITE_URL)
                .get('/api/get_user')
                .reply(200, { body: { todos: ['do something'] }})

            // trigger async action
            // sitesActions.siteUpdate();
            // return new Promise((resolve, reject) => {
            //     // wait for axios request
            //     moxios.wait(() => {
            //         moxios.requests
            //             .mostRecent()
            //             .respondWith({
            //                 status: 200,
            //                 response: true
            //             })
            //             .then(() => {
            //                 resolve();
            //             })
            //             .catch(reject);
            //     });
            // }).catch(console.error);
        });
    });

});
