"use strict";

import React from 'react';
import renderer from 'react-test-renderer';

import Wrapper from '../TestHelpers/Wrapper.jsx';
import Home from'./Home.jsx';

const siteTestList = require('../TestHelpers/Data/ApiProviderList.json');

describe('<Home />', () => {
    it('matches snapshot', () => {
        const tree = renderer.create(
            <Wrapper><Home sites={siteTestList}/></Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it('matches snapshot without sites', () => {
        const tree = renderer.create(
            <Wrapper><Home sites={{}}/></Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });
});
