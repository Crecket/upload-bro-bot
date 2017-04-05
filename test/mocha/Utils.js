const assert = require('assert');
const path = require('path');

describe('Utils', () => {
    const Utils = require('../../src/Utils.js');
    describe('#ensureFolderExists()', () => {
        it('should verify folder exists', () => {
            Utils.ensureFolderExists(path.resolve('../mocha'));
        });
    });
});
