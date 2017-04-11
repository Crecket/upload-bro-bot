"use strict";

import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

import Wrapper from '../TestHelpers/Wrapper.jsx';
import Home from'./Home.jsx';

const siteTestList = require('../TestHelpers/Data/api-get_providers.json');

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

    it('lifeCycle will update event works', () => {
        const wrapper = shallow(
            <Home sites={{}}/>
        );
        wrapper.instance().setState({a: true});
    });
});
