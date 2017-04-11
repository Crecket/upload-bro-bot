"use strict";

import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

import Wrapper from '../TestHelpers/Wrapper.jsx';
import ProviderRemove from'./ProviderRemove.jsx';

const userInfoList = require('../TestHelpers/Data/api-get_user.json');
const siteInfoList = require('../TestHelpers/Data/api-get_providers.json');
const siteGoogleInfo = require('../TestHelpers/Data/api-get_provider_google.json');
const siteBoxInfo = require('../TestHelpers/Data/api-get_provider_box.json');

const defaultTestProps = {
    params: {type: "google"},
    sites: siteInfoList,
    user_info: userInfoList
};

describe('<ProviderRemove />', () => {
    it('matches snapshot', () => {
        //create component and save as json
        const component = renderer.create(
            <Wrapper>
                <ProviderRemove {...defaultTestProps}/>
            </Wrapper>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('short swipe event does not trigger router push event', () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{push: routerPush}}
            />
        );

        // trigger on swipe move/end event
        wrapper.instance().onSwipeMove({x: 100});
        wrapper.instance().onSwipeEnd();

        // router push should've bene called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });

    it('long swipe event does trigger router push event to next item', () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{push: routerPush}}
            />
        );

        // trigger on swipe move/end event
        wrapper.instance().onSwipeMove({x: 200});
        wrapper.instance().onSwipeEnd();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it('long negative swipe event does trigger router push event to previous item', () => {
        // mock router push function
        const routerPush = jest.fn();

        //create component and save as json
        const wrapper = shallow(
            <ProviderRemove
                {...defaultTestProps}
                router={{push: routerPush}}
            />
        );

        // trigger on swipe move/end event
        wrapper.instance().onSwipeMove({x: -200});
        wrapper.instance().onSwipeEnd();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it('empty site list should trigger router push', () => {
        // mock router push function
        const routerPush = jest.fn();

        // create new prop clone without sites
        const newProps = Object.assign({}, defaultTestProps, {
            sites: {}
        });

        //create component and save as json
        const component = renderer.create(
            <Wrapper>
                <ProviderRemove
                    {...newProps}
                    router={{push: routerPush}}
                />
            </Wrapper>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // router push should've been called
        expect(routerPush).toHaveBeenCalled();
    });

    it('site list with 1 item should fallback to own type in swipe action', () => {
        // mock router push function
        const routerPush = jest.fn();

        // create new prop clone without sites
        const newProps = Object.assign({}, defaultTestProps, {
            sites: {box: siteBoxInfo},
            params: {type: "box"}
        });

        //create component and save as json
        const component = renderer.create(
            <Wrapper>
                <ProviderRemove
                    {...newProps}
                    router={{push: routerPush}}
                />
            </Wrapper>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // router push shouldn't have been called
        expect(routerPush).toHaveBeenCalledTimes(0);
    });

});
