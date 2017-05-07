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
            const expectedState = { user: { user_info: false } };

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
                        expect(store.getState()).toEqual(expectedState);
                        done();
                    });
            });
        });

        it("should fail to update the user info through the api", done => {
            const expectedActions = [
                { type: "USER_IS_LOADING" },
                { type: "USER_INITIAL_CHECK" }
            ];
            const expectedState = { user: { user_info: false } };

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
                        expect(store.getState()).toEqual(expectedState);
                        done();
                    });
            });
        });

        it("should handle the logout user action with the api", done => {
            const expectedActions = [
                { type: "USER_LOGOUT_REQUEST" },
                { type: "USER_LOGOUT" }
            ];
            const expectedState = { user: { user_info: false } };

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
                        expect(store.getState()).toEqual(expectedState);
                        done();
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
            user: {
                user_info: false
            }
        };

        it("should create a updates sites action which calls the api", () => {
            const expectedActions = [
                { type: "USER_LOGOUT_REQUEST" },
                { type: "USER_LOGOUT" }
            ];
            const expectedState = { user: { user_info: false } };

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
                        response: true
                    })
                    .then(() => {
                        // initial check should be set and user is no longer loading
                        // expect(store.getActions()).toEqual(expectedActions);
                        // expect(store.getState()).toEqual(expectedState);
                        console.log(store.getActions());
                        console.log(store.getState());
                        done();
                    });
            });
        });
    });
});
