process.env.DEBUG = false;

const Logger = require("../../../../client/Helpers/Logger.js");

describe("#Logger", () => {
    it("trace function available", () => {
        expect(Logger).toHaveProperty("trace");
    });
    it("debug function available", () => {
        expect(Logger).toHaveProperty("debug");
    });
    it("info function available", () => {
        expect(Logger).toHaveProperty("info");
    });
    it("warn function available", () => {
        expect(Logger).toHaveProperty("warn");
    });
    it("error function available", () => {
        expect(Logger).toHaveProperty("error");
    });
});
