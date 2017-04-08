"use strict";

import ForceLogin from'./ForceLogin.jsx';

describe('#ForceLogin', () => {
    it('runs without errors', () => {
        ForceLogin({})
    });

    it('runs without errors', () => {
        ForceLogin({
            router: {
                location: {
                    pathname: "/"
                }
            }
        })
    });
});

