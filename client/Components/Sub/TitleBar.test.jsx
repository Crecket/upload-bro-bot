import TitleBar from'./TitleBar.jsx';

import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

describe('<TitleBar />', () => {
    it('renders children when passed in', () => {
        const wrapper = shallow(
            <TitleBar>Some Text</TitleBar>
        );

        expect(wrapper.contains(<h1>Some Text</h1>)).to.equal(true);
    });
});
