"use strict";
import Utils from "../../../client/Helpers/Utils.js";

describe("Utils", () => {
    describe("#getHashParams", () => {
        it('returns a object with key "a"', () => {
            window.location.hash = "a=b";
            expect(Utils.getHashParams()).toHaveProperty("a", "b");
        });

        it("runs without a hash value in url", () => {
            Utils.getHashParams();
        });
    });

    describe("#ucfirst", () => {
        it("first character becomes uppercase", () => {
            expect(Utils.ucfirst("a")).toBe("A");
        });
    });
});
