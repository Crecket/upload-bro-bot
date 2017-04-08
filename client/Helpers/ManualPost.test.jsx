"use strict";
const ManualPost = require('./ManualPost');

describe('#ManualPost', () => {
    it('returns a callable function', () => {
        const f = ManualPost('/');
        f();
    });
});

