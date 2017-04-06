'use strict';
require('dotenv').config({silent: true});

import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Center from './Center.jsx';

describe('<Center />', () => {
    it('it renders', () => {
        const wrapper = shallow(<Center />);
        expect(true);
    });
});
