"use strict";
import ForceLogin from'./ForceLogin.jsx';

let inputParams = {
    initialCheck: true,
    user_info: {},
    router: {
        location: {
            pathname: "/"
        },
        push: () => {
        }
    }
};

describe('#ForceLogin', () => {
    it('runs without errors', () => {
        ForceLogin({})
    });

    it('logged in and redirects to dashboard', () => {
        expect(ForceLogin(inputParams, true)).toBe(true);
    });

    it('logged in and does not redirect to dashboard', () => {
        expect(ForceLogin(inputParams, false)).toBe(true);
    });

    it('not logged in and redirects to home', () => {
        inputParams.user_info = false;
        inputParams.router.location.pathname = "/dashboard";
        expect(ForceLogin(inputParams, true)).toBe(false);
    });

    it('not logged in and does not redirect to home', () => {
        inputParams.user_info = false;
        inputParams.router.location.pathname = "/dashboard";
        expect(ForceLogin(inputParams, false)).toBe(false);
    });
});

