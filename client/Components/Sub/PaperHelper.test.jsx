import PaperHelper from'./PaperHelper.jsx';

import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

describe('<PaperHelper />', () => {
    it('renders children when passed', () => {
        const wrapper = shallow(
            <PaperHelper><h1>Some Text</h1></PaperHelper>
        );
        expect(wrapper.contains(<h1>Some Text</h1>)).to.equal(true);
    });
});
