"use strict";

import React from 'react';
import renderer from 'react-test-renderer';

import Wrapper from '../../TestHelpers/Wrapper.jsx';
import ProviderBlocks from'./ProviderBlocks.jsx';

const siteTestList = require('../../TestHelpers/Data/api-get_providers.json');
const userInfoList = require('../../TestHelpers/Data/api-get_user.json');

describe('<Home />', () => {
    it('matches snapshot', () => {
        const tree = renderer.create(
            <Wrapper><ProviderBlocks provider_sites={siteTestList}
                                     user_provider_sites={userInfoList.provider_sites}/></Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it('matches snapshot with empty sites list and with a user list', () => {
        const tree = renderer.create(
            <Wrapper><ProviderBlocks provider_sites={{}}
                                     user_provider_sites={userInfoList.provider_sites}/></Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it('matches snapshot with empty sites list and empty user list', () => {
        const tree = renderer.create(
            <Wrapper><ProviderBlocks provider_sites={{}}
                                     user_provider_sites={{}}/></Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });
});
