const assert = require('assert');
const path = require('path');

describe('Utils', () => {
    const Utils = require('./Utils.js');

    describe('ensureFolderExists()', () => {

        it('should do nothing and return false', async () => {
            const folderAttempt = await Utils.ensureFolderExists(path.resolve(__dirname + '/../Helpers'));
            // expect false since folder exists
            expect(folderAttempt).toEqual(false);
        });

        it('should create folder and return true', async () => {
            // set path for target folder
            const folderTarget = __dirname + '/../../Downloads/test_folder_' + (new Date()).getTime();
            // attempt to create the new folder
            const folderAttempt = await Utils.ensureFolderExists(path.resolve(folderTarget));
            // expect true since folder shouldn't exist
            expect(folderAttempt).toEqual(true);
        });

        it('should fail and reject', async () => {
            try {
                // set path for target folder
                const folderTarget = __dirname + '/a/b/c/d/e/f/g';

                // attempt to create the impossible folder
                await Utils.ensureFolderExists(path.resolve(folderTarget));
            } catch (ex) {
                expect(ex);
            }
        });

    });

});
