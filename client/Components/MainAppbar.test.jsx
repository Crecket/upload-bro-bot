"use strict";

import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

import Wrapper from '../TestHelpers/Wrapper.jsx';
import MainAppbar from'./MainAppbar.jsx';

const userInfoList = require('../TestHelpers/Data/api-get_user.json');

describe('<MainAppbar />', () => {
    it('matches snapshot with verified user', () => {
        const tree = renderer.create(
            <Wrapper>
                <MainAppbar themeList={["Dark"]}
                            user_info={userInfoList}/>
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it('matches snapshot without verified user', () => {
        const tree = renderer.create(
            <Wrapper>
                <MainAppbar themeList={["Dark"]}
                            user_info={false}/>
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it('clickevent for popover', () => {
        const wrapper = shallow(
            <MainAppbar themeList={["Dark"]}
                        user_info={false}/>
        );

        wrapper.instance();
    });

    it('themeSwitcher click event', () => {
        const themeSwitch = jest.fn();
        const wrapper = shallow(
            <MainAppbar themeList={["Dark"]}
                        setTheme={themeSwitch}
                        user_info={false}/>
        );

        // attempt themeswitcher click event
        const themeSwitcherFunc = wrapper.instance().themeSwitcher("Dark");

        // call the returned function
        themeSwitcherFunc();

        // expect the setTheme function to have been called with the "Dark" theme
        expect(themeSwitch).toHaveBeenCalledWith("Dark");
    });

});
