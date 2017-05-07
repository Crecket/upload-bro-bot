require("dotenv").config();
import React from "react";
import moxios from "moxios";
import MockStore from "../Helpers/Test/MockStore";

import * as sitesActions from "./sites";
import * as userActions from "./user";

describe("actions asynchronous", () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    describe("user", () => {
        // default user response body
        const testBody = {
            _id: 1234,
            provider: "telegram",
            first_name: "Mate",
            last_name: "Bro",
            username: "xXxmatebroxXx",
            avatar: null,
            provider_sites: {}
        };
        // initial test state
        const storeState = {
            user: {
                user_info: false
            }
        };

        it("should update the user info through the api", done => {
            const expectedActions = [
                { type: "USER_IS_LOADING" },
                {
                    type: "USER_SET_INFO",
                    payload: { user_info: { ...testBody } }
                },
                { type: "USER_IS_NOT_LOADING" },
                { type: "USER_INITIAL_CHECK" }
            ];

            // create a new mock store to handle action
            const store = MockStore(storeState);

            // dispatch the user update event
            store.dispatch(userActions.userUpdate());

            // wait for a request
            moxios.wait(() => {
                // get the most recent request and respond to it
                moxios.requests
                    .mostRecent()
                    .respondWith({
                        status: 200,
                        response: testBody
                    })
                    .then(() => {
                        // initial check should be set and user is no longer loading
                        expect(store.getActions()).toEqual(expectedActions);
                        done();
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            });
        });

        it("should fail to update the user info through the api", done => {
            const expectedActions = [
                { type: "USER_IS_LOADING" },
                { type: "USER_INITIAL_CHECK" }
            ];

            // create a new mock store to handle action
            const store = MockStore(storeState);

            // dispatch the user update event
            store.dispatch(userActions.userUpdate());

            // wait for a request
            moxios.wait(() => {
                // get the most recent request and respond to it
                moxios.requests
                    .mostRecent()
                    .respondWith({
                        status: 500,
                        response: null
                    })
                    .then(() => {
                        // initial check should be set and user is no longer loading
                        expect(store.getActions()).toEqual(expectedActions);
                        done();
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            });
        });

        it("should handle the logout user action with the api", done => {
            const expectedActions = [
                { type: "USER_LOGOUT_REQUEST" },
                { type: "USER_LOGOUT" }
            ];

            // create a new mock store to handle action
            const store = MockStore(storeState);

            // dispatch the user logout event
            store.dispatch(userActions.userLogout());

            // wait for a request
            moxios.wait(() => {
                // get the most recent request and respond to it
                moxios.requests
                    .mostRecent()
                    .respondWith({
                        status: 200,
                        response: true
                    })
                    .then(() => {
                        // initial check should be set and user is no longer loading
                        expect(store.getActions()).toEqual(expectedActions);
                        done();
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            });
        });
    });

    describe("sites", () => {
        // default user response body
        const testBody = {
            _id: 1234,
            provider: "telegram",
            first_name: "Mate",
            last_name: "Bro",
            username: "xXxmatebroxXx",
            avatar: null,
            provider_sites: {}
        };
        // initial test state
        const storeState = {
            sites: {
                sites: {},
                loading: false
            }
        };

        it("should create a updates sites action which calls the api", () => {
            return new Promise((resolve, reject) => {
                const siteList = {
                    google: {
                        test: true
                    }
                };
                // expected actions
                const expectedActions = [
                    { type: "SITE_IS_LOADING" },
                    { type: "SITE_SET_INFO", payload: { sites: siteList } },
                    { type: "SITE_IS_NOT_LOADING" }
                ];

                // create a new mock store to handle action
                const store = MockStore(storeState);

                // dispatch the user logout event
                store.dispatch(sitesActions.siteUpdate());

                // wait for a request
                moxios.wait(() => {
                    // get the most recent request and respond to it
                    moxios.requests
                        .mostRecent()
                        .respondWith({
                            status: 200,
                            response: siteList
                        })
                        .then(() => {
                            // initial check should be set and user is no longer loading
                            expect(store.getActions()).toEqual(expectedActions);
                            resolve();
                        })
                        .catch(reject);
                });
            });
        });

        it("should create a updates sites action which fails to call the api", () => {
            return new Promise((resolve, reject) => {
                // expected actions
                const expectedActions = [
                    { type: "SITE_IS_LOADING" },
                    { type: "SITE_IS_NOT_LOADING" }
                ];

                // create a new mock store to handle action
                const store = MockStore(storeState);

                // dispatch the user logout event
                store.dispatch(sitesActions.siteUpdate());

                // wait for a request
                moxios.wait(() => {
                    // get the most recent request and respond to it
                    moxios.requests
                        .mostRecent()
                        .respondWith({
                            status: 500,
                            response: null
                        })
                        .then(() => {
                            // initial check should be set and user is no longer loading
                            expect(store.getActions()).toEqual(expectedActions);
                            resolve();
                        })
                        .catch(reject);
                });
            });
        });
    });
});
