"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter, StaticRouter } from "react-router-dom";
import { mount } from "enzyme";

// selector components
import MainAppbarPopover from "./Sub/MainAppbarPopover";

// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import Wrapper from "../TestHelpers/Wrapper.jsx";
import MainAppbar from "./MainAppbar.jsx";

const userInfoList = require("../TestHelpers/Data/api-get_user.json");

describe("<MainAppbar />", () => {
    it("matches snapshot with verified user", () => {
        const tree = renderer.create(
            <StaticRouter location={"/dashboard"} context={{}}>
                <Wrapper>
                    <MainAppbar
                        themeList={["LightBlue"]}
                        user_info={userInfoList}
                    />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches snapshot without verified user", () => {
        const tree = renderer.create(
            <StaticRouter location={"/dashboard"} context={{}}>
                <Wrapper>
                    <MainAppbar themeList={["LightBlue"]} user_info={false} />
                </Wrapper>
            </StaticRouter>
        );
        expect(tree).toMatchSnapshot();
    });

    // it("clickevent for popover", () => {
    //     const wrapper = shallow(
    //         <StaticRouter location={"/dashboard"} context={{}}>
    //             <MainAppbar themeList={["LightBlue"]} user_info={false}/>
    //         </StaticRouter>
    //     );
    //
    //     wrapper.instance();
    // });

    it("themeSwitcher click event", () => {
        const themeSwitch = jest.fn();
        const wrapper = mount(
            <MemoryRouter initialEntries={["/dashboard"]} initialIndex={0}>
                <Wrapper>
                    <MainAppbar
                        themeList={["LightBlue"]}
                        setTheme={themeSwitch}
                        user_info={false}
                    />
                </Wrapper>
            </MemoryRouter>
        );

        wrapper.setState({

        })

        wrapper.find(Menu).props().onItemTouchTap({
            persist: () => {},
        });

        // get the popover
        const PopoverElement = wrapper.find(MainAppbarPopover);
        console.log(PopoverElement.nodes.length);
        PopoverElement.simulate("click");

        // get the theme selector dropdown item
        const FirstMenuItem = PopoverElement.find('[primaryText="Change Theme"]');
        console.log(FirstMenuItem.nodes.length);
        // FirstMenuItem.simulate("click");

        // expect the setTheme function to have been called with the "Dark" theme
        expect(themeSwitch).toHaveBeenCalledWith("Dark");
    });
});
