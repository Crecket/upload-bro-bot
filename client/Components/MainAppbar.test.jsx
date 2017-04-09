"use strict";

import React from 'react';
import renderer from 'react-test-renderer';

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

});
