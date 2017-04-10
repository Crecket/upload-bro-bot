"use strict";

import React from 'react';
import renderer from 'react-test-renderer';

import Wrapper from '../TestHelpers/Wrapper.jsx';
import DropboxLoginCallback from'./DropboxLoginCallback.jsx';

const userInfoList = require('../TestHelpers/Data/api-get_user.json');
const siteInfoList = require('../TestHelpers/Data/api-get_providers.json');
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme();

describe('<DropboxLoginCallback />', () => {
    it('matches snapshot with verified user and site list available', () => {
        const tree = renderer.create(
            <Wrapper>
                <DropboxLoginCallback sites={siteInfoList}
                                      user_info={userInfoList}/>
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it('matches snapshot without verified user', () => {
        const tree = renderer.create(
            <Wrapper>
                <DropboxLoginCallback sites={siteInfoList}
                                      user_info={false}/>
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

    it('matches snapshot without verified user and without sites', () => {
        const tree = renderer.create(
            <Wrapper>
                <DropboxLoginCallback sites={{}}
                                      user_info={false}/>
            </Wrapper>
        );
        expect(tree).toMatchSnapshot();
    });

});
