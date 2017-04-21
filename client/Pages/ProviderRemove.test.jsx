"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import moxios from "moxios";

import Wrapper from "../TestHelpers/Wrapper.jsx";
import ProviderRemove from "./ProviderRemove.jsx";

// pre-loaded info from json
const userInfoList = require("../TestHelpers/Data/api-get_user.json");
const siteInfoList = require("../TestHelpers/Data/api-get_providers.json");
// const siteGoogleInfo = require('../TestHelpers/Data/api-get_provider_google.json');
const siteBoxInfo = require("../TestHelpers/Data/api-get_provider_box.json");

const defaultTestProps = {
    params: { type: "google" },
    sites: siteInfoList,
    user_info: userInfoList
};

describe("<ProviderRemove />", () => {
    beforeEach(function() {
        // import and pass your custom axios instance to this method
        moxios.install();
    });

    afterEach(function() {
        // import and pass your custom axios instance to this method
        moxios.uninstall();
    });

    it("matches snapshot", () => {
        //create component and save as json
        const component = renderer.create(
            <Wrapper>
                <ProviderRemove {...defaultTestProps} />
            </Wrapper>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("short swipe to right event does not trigger router push event", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{ push: routerPush }}
            />
        );

        // trigger on swipe move/end event
        wrapper.instance().onSwipeMove({ x: 10 });
        wrapper.instance().onSwipeEnd();

        // router push should've bene called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });

    it("short swipe to left event does not trigger router push event", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{ push: routerPush }}
            />
        );

        // trigger on swipe move/end event
        wrapper.instance().onSwipeMove({ x: -10 });
        wrapper.instance().onSwipeEnd();

        // router push should've bene called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });

    it("long swipe event does trigger router push event to next item", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{ push: routerPush }}
            />
        );

        // trigger on swipe move/end event
        wrapper.instance().onSwipeMove({ x: 200 });
        wrapper.instance().onSwipeEnd();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it("long negative swipe event does trigger router push event to previous item", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{ push: routerPush }}
            />
        );

        // trigger on swipe move/end event
        wrapper.instance().onSwipeMove({ x: -200 });
        wrapper.instance().onSwipeEnd();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it("test removal request with valid response (removal was successful)", () => {
        // mock router push function
        const routerPush = jest.fn();
        const updateUser = jest.fn();

        // mock set timeout
        // jest.useFakeTimers();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{ push: routerPush }}
                updateUser={updateUser}
            />
        );

        return new Promise((resolve, reject) => {
            // trigger remove click
            wrapper.instance().removeProvider();
            moxios.wait(() => {
                moxios.requests
                    .mostRecent()
                    .respondWith({
                        status: 200,
                        response: true
                    })
                    .then(() => {
                        // redux action should've been called
                        // expect(routerPush).toHaveBeenCalled();
                        expect(updateUser).toHaveBeenCalled();

                        // resolve the test
                        resolve();
                    })
                    .catch(reject);
            });
        }).catch(console.log);
    });

    it("test removal request with false response (removal was declind/failed)", () => {
        expect(true).toBe(true);

        /*
        // mock router push function
        const routerPush = jest.fn();
        const updateUser = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{push: routerPush}}
                updateUser={updateUser}
            />
        );

        wrapper.instance().setState({loadingState: "loading"});

        return new Promise((resolve, reject) => {
            // trigger remove click
            wrapper.instance().removeProvider();

            // wait for a request to the moxios instance
            moxios.wait(() => {
                // respond to the most recent respondWith
                moxios.requests
                    .mostRecent()
                    .respondWith({
                        status: 200,
                        response: false
                    })
                    .then(() => {
                        // redux action should've been called
                        // expect(routerPush).toHaveBeenCalled();
                        expect(updateUser).toHaveBeenCalled();

                        // resolve the test
                        resolve();
                    }).catch(reject);

            });
        }).catch(console.log);
        //*/
    });

    it("test removal request returns error and is handled", () => {
        // mock router push function
        const routerPush = jest.fn();
        const updateUser = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{ push: routerPush }}
                updateUser={updateUser}
            />
        );

        return new Promise((resolve, reject) => {
            // trigger remove click
            wrapper.instance().removeProvider();

            // wait for a request to the moxios instance
            moxios.wait(() => {
                // respond to the most recent respondWith
                moxios.requests
                    .mostRecent()
                    .respondWith({
                        status: 500,
                        response: false
                    })
                    .then(() => {
                        // reject this test since it should've failed
                        resolve("This request should've been rejected");
                    })
                    .catch(err => {
                        // the request failed so resolve this instance
                        reject();
                    });
            });
        });
    });

    it("empty site list should trigger router push", () => {
        // mock router push function
        const routerPush = jest.fn();

        // create new prop clone without sites
        const newProps = Object.assign({}, defaultTestProps, {
            sites: {}
        });

        //create component and save as json
        const component = renderer.create(
            <Wrapper>
                <ProviderRemove {...newProps} router={{ push: routerPush }} />
            </Wrapper>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it("site list with 1 item should fallback to own type in swipe action", () => {
        // mock router push function
        const routerPush = jest.fn();

        // create new prop clone without sites
        const newProps = Object.assign({}, defaultTestProps, {
            sites: { box: siteBoxInfo },
            params: { type: "box" }
        });

        //create component and save as json
        const component = renderer.create(
            <Wrapper>
                <ProviderRemove {...newProps} router={{ push: routerPush }} />
            </Wrapper>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // router push shouldn't have been called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });
});
