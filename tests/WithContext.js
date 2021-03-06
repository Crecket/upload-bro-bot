import React from "react";
import { mount, shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { getMuiTheme } from "material-ui/styles";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// the theme we want to include in our context
import LightBlue from "../client/Themes/LightBlue";

// navigator fallback for server-side rendering
const navigatorHelper =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";

// the muitheme context
const muiTheme = getMuiTheme(LightBlue, { userAgent: navigatorHelper });

// the final context object
const context = { muiTheme };

// render functions with the required context
export const Shallow = (node, options = { location: "/dashboard" }) => {
    return shallow(
        <MemoryRouter initialEntries={[options.location]}>
            <MuiThemeProvider muiTheme={muiTheme}>
                {node}
            </MuiThemeProvider>
        </MemoryRouter>,
        {
            context: context
        }
    );
};

export const Mount = (node, options = { location: "/dashboard" }) => {
    return mount(
        <MemoryRouter initialEntries={[options.location]}>
            <MuiThemeProvider muiTheme={muiTheme}>
                {node}
            </MuiThemeProvider>
        </MemoryRouter>,
        {
            context: context
        }
    );
};

export const Renderer = (node, options = { location: "/dashboard" }) => {
    return renderer.create(
        <MemoryRouter initialEntries={[options.location]}>
            <MuiThemeProvider muiTheme={muiTheme}>
                {node}
            </MuiThemeProvider>
        </MemoryRouter>
    );
};
