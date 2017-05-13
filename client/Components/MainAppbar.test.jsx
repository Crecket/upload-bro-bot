"use strict";

import React from "react";
import {Mount, Renderer} from "../Helpers/Test/WithContext";
// selector components
// import MainAppbarPopover from "./Sub/MainAppbarPopover";
// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";
import MainAppbar from "./MainAppbar";
injectTapEventPlugin();

const userInfoList = require("../Helpers/Test/Data/api-get_user.json");

describe("<MainAppbar />", () => {
    it("matches snapshot with verified user", () => {
        const tree = Renderer(
            <MainAppbar themeList={["LightBlue"]} user_info={userInfoList}/>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without verified user", () => {
        const tree = Renderer(
            <MainAppbar themeList={["LightBlue"]} user_info={false}/>
        );
        expect(tree).toMatchSnapshot();
    });

    it("themeSwitcher click event", () => {
        const themeSwitch = jest.fn();
        const wrapper = Mount(
            <MainAppbar
                themeList={["LightBlue"]}
                setTheme={themeSwitch}
                user_info={false}
            />
        );

        // open the menu
        // console.log(wrapper.debug());
        return;
        // wrapper.childAt(0).childAt(0).setState({ open: true });
        wrapper.update();

        // select this item
        const ThemeSelectorMenuItem = wrapper.find("#theme-changer-menu-item");

        // show the theme list
        ThemeSelectorMenuItem.props().onItemTouchTap({
            persist: () => {
            }
        });

        // attempt to click the menu item
        wrapper.find("#DarkTheme").simulate("click");

        // expect the setTheme function to have been called with the "Dark" theme
        expect(themeSwitch).toHaveBeenCalledWith("Dark");
    });
});
