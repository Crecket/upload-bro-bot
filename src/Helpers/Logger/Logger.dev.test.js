const assert = require("assert");

// set debug to true for logger enviroment test
process.env.DEBUG = "true";
const Logger = require("../Logger.js");

describe("Logger", () => {
    describe("preProcess()", () => {
        it("should return uppercase version", () => {
            const processResult = Logger.preProcess({ title: "ab" });
            expect(processResult).toHaveProperty("title", "AB");
        });
    });

    describe("trace()", () => {
        it("should trace function", () => {
            expect(Logger).toHaveProperty("trace");
        });
    });

    describe("debug()", () => {
        it("should debug function", () => {
            expect(Logger).toHaveProperty("debug");
        });
    });

    describe("info()", () => {
        it("should info function", () => {
            expect(Logger).toHaveProperty("info");
        });
    });

    describe("warn()", () => {
        it("should warn function", () => {
            expect(Logger).toHaveProperty("warn");
        });
    });

    describe("error()", () => {
        it("should error function", () => {
            expect(Logger).toHaveProperty("error");
        });
    });
});
