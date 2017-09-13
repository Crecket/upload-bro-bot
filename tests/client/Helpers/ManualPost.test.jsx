"use strict";
const ManualPost = require("../../../client/Helpers/ManualPost");

describe("#ManualPost", () => {
    it("returns a callable function", () => {
        const f = ManualPost("/");
        f();
    });
});
