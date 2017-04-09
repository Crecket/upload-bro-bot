"use strict";
import ForceLogin from'./ForceLogin.jsx';

const inputParamsDefault = {
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

// make 2 copies so we don't cause problems with immutability 
let verifiedParams = Object.assign({}, inputParamsDefault);
let unverifiedParams = Object.assign({}, inputParamsDefault, {user_info: false});

describe('#ForceLogin', () => {
    it('runs without errors with empty props', () => {
        ForceLogin({})
    });

    // logged in scenarios
    it('logged in and redirects to dashboard', () => {
        verifiedParams.router.location.pathname = "/";
        expect(ForceLogin(verifiedParams, true)).toBe(true);
    });
    it('logged in and does nothing while page is correct', () => {
        verifiedParams.router.location.pathname = "/dashboard";
        expect(ForceLogin(verifiedParams, true)).toBe(true);
    });
    it('logged in and does nothing while page is incorrect', () => {
        verifiedParams.router.location.pathname = "/";
        expect(ForceLogin(verifiedParams, false)).toBe(true);
    });
    it('logged in and does nothing while page is correct', () => {
        verifiedParams.router.location.pathname = "/dashboard";
        expect(ForceLogin(verifiedParams, false)).toBe(true);
    });

    // not logged in scenarios
    it('not logged in and does nothing while page is correct', () => {
        unverifiedParams.router.location.pathname = "/";
        expect(ForceLogin(unverifiedParams, true)).toBe(false);
    });
    it('not logged in and redirects home while page is incorrect', () => {
        unverifiedParams.router.location.pathname = "/dashboard";
        expect(ForceLogin(unverifiedParams, true)).toBe(false);
    });
    it('not logged in and does nothing while page is correct', () => {
        unverifiedParams.router.location.pathname = "/";
        expect(ForceLogin(unverifiedParams, false)).toBe(false);
    });
    it('not logged in and does nothing while page is incorrect', () => {
        unverifiedParams.router.location.pathname = "/dashboard";
        expect(ForceLogin(unverifiedParams, false)).toBe(false);
    });
});

