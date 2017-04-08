import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import Center from './Center.jsx';

describe('<Center />', () => {
    it('matches snapshot', () => {
        const tree = renderer.create(
            <Center/>
        );
        expect(tree).toMatchSnapshot();
    });

    it('renders children when passed', () => {
        const wrapper = shallow(
            <Center><p>Some Text</p></Center>
        );
        expect(wrapper.contains(<p>Some Text</p>)).toBe(true);
    });
});
