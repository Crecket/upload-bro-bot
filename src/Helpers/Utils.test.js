const assert = require('assert');
const path = require('path');

describe('Utils', () => {
    const Utils = require('./Utils.js');
    describe('#ensureFolderExists()', () => {
        it('should verify folder exists', () => {
            Utils.ensureFolderExists(path.resolve('../Helpers'));
        });
    });
});
