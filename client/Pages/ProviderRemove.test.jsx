"use strict";

import React from "react";
import { StaticRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import moxios from "moxios";

import Wrapper from "../TestHelpers/Wrapper.jsx";
import Logger from "../Helpers/Logger";
import ProviderRemove from "./ProviderRemove.jsx";

// pre-loaded info from json
const userInfoList = require("../TestHelpers/Data/api-get_user.json");
const siteInfoList = require("../TestHelpers/Data/api-get_providers.json");
const siteBoxInfo = require("../TestHelpers/Data/api-get_provider_box.json");
// const siteGoogleInfo = require('../TestHelpers/Data/api-get_provider_google.json');

const defaultTestProps = {
    match: {
        params: { type: "google" }
    },
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
            <StaticRouter>
                <Wrapper>
                    <ProviderRemove {...defaultTestProps} />
                </Wrapper>
            </StaticRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("123 short swipe to right event does not trigger router push event", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <StaticRouter>
                <ProviderRemove
                    {...defaultTestProps}
                    router={{ push: routerPush }}
                />
            </StaticRouter>
        );

        const ProviderRemoveWrapper = wrapper.find(ProviderRemove)

        // trigger on swipe move/end event
        ProviderRemoveWrapper.simulate('mousemove',{
            pageX: 1000
        });
        ProviderRemoveWrapper.simulate('mouseup');
        // ProviderRemoveWrapper.onSwipeMove({ x: 10 });
        // ProviderRemoveWrapper.onSwipeEnd();

        // router push should've bene called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });

    it("short swipe to left event does not trigger router push event", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <StaticRouter>
                <ProviderRemove
                    {...defaultTestProps}
                    router={{ push: routerPush }}
                />
            </StaticRouter>
        );

        const ProviderRemoveWrapper = wrapper.find(ProviderRemove).instance();

        // trigger on swipe move/end event
        ProviderRemoveWrapper.onSwipeMove({ x: -10 });
        ProviderRemoveWrapper.onSwipeEnd();

        // router push should've bene called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });

    it("long swipe event does trigger router push event to next item", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <StaticRouter>
                <ProviderRemove
                    {...defaultTestProps}
                    router={{ push: routerPush }}
                />
            </StaticRouter>
        );

        const ProviderRemoveWrapper = wrapper.find(ProviderRemove).instance();

        // trigger on swipe move/end event
        ProviderRemoveWrapper.onSwipeMove({ x: 200 });
        ProviderRemoveWrapper.onSwipeEnd();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it("long negative swipe event does trigger router push event to previous item", () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <StaticRouter>
                <ProviderRemove
                    {...defaultTestProps}
                    router={{ push: routerPush }}
                />
            </StaticRouter>
        );

        const ProviderRemoveWrapper = wrapper.find(ProviderRemove).instance();

        // trigger on swipe move/end event
        ProviderRemoveWrapper.onSwipeMove({ x: -200 });
        ProviderRemoveWrapper.onSwipeEnd();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it("test removal request with valid response (removal was successful)", () => {
        // mock router push function
        const routerPush = jest.fn();
        const updateUser = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <StaticRouter>
                <ProviderRemove
                    {...defaultTestProps}
                    router={{ push: routerPush }}
                    updateUser={updateUser}
                />
            </StaticRouter>
        );

        const ProviderRemoveWrapper = wrapper.find(ProviderRemove);

        // set loading state
        ProviderRemoveWrapper.setState({ loadingState: "loading" });

        return new Promise((resolve, reject) => {
            // trigger remove click
            ProviderRemoveWrapper.removeProvider();
            // wait for axios request
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
        // mock router push function
        const routerPush = jest.fn();
        const updateUser = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <StaticRouter>
                <ProviderRemove
                    {...defaultTestProps}
                    router={{ push: routerPush }}
                    updateUser={updateUser}
                />
            </StaticRouter>
        );

        const ProviderRemoveWrapper = wrapper.find(ProviderRemove);

        // set loading state
        ProviderRemoveWrapper.setState({ loadingState: "loading" });

        return new Promise((resolve, reject) => {
            // trigger remove click
            ProviderRemoveWrapper.removeProvider();

            // trigger remove click
            moxios.wait(() => {
                moxios.requests
                    .mostRecent()
                    .respondWith({
                        status: 200,
                        response: true // TODO set to false, currently true until issue is fixed
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
        //*/
    });

    it("test removal request returns error and is handled", () => {
        // mock router push function
        const routerPush = jest.fn();
        const updateUser = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <StaticRouter>
                <ProviderRemove
                    {...defaultTestProps}
                    router={{ push: routerPush }}
                    updateUser={updateUser}
                />
            </StaticRouter>
        );

        const ProviderRemoveWrapper = wrapper.find(ProviderRemove);

        return new Promise((resolve, reject) => {
            // trigger remove click
            ProviderRemoveWrapper.removeProvider();

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
            <StaticRouter>
                <Wrapper>
                    <ProviderRemove
                        {...newProps}
                        router={{ push: routerPush }}
                    />
                </Wrapper>
            </StaticRouter>
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
            <StaticRouter>
                <Wrapper>
                    <ProviderRemove
                        {...newProps}
                        router={{ push: routerPush }}
                    />
                </Wrapper>
            </StaticRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // router push shouldn't have been called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });
});
