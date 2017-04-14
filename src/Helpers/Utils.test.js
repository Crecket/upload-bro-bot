const assert = require("assert");
const path = require("path");
const Utils = require("./Utils.js");

describe("Utils", () => {
    describe("ensureFolderExists()", () => {
        it("should do nothing and return false", async () => {
            // attempt to create a folder that already exists
            const folderAttempt = await Utils.ensureFolderExists(
                path.resolve(__dirname)
            );
            // expect false since folder exists
            expect(folderAttempt).toEqual(false);
        });

        it("should create folder and return true", async () => {
            // set path for target folder
            const folderTarget =
                __dirname +
                "/../../downloads/test_folder_" +
                new Date().getTime();
            // attempt to create the new folder
            const folderAttempt = await Utils.ensureFolderExists(
                path.resolve(folderTarget)
            );
            // expect true since folder shouldn't exist
            expect(folderAttempt).toEqual(true);
        });

        it("should fail and reject", async () => {
            try {
                // set path for target folder
                const folderTarget = __dirname + "/a/b/c/d/e/f/g";

                // attempt to create the impossible folder
                await Utils.ensureFolderExists(path.resolve(folderTarget));
            } catch (ex) {
                expect(ex);
            }
        });
    });
});
