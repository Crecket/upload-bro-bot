// load ENV
require('dotenv').config();

const assert = require('assert');

describe('Logger', () => {
    const Logger = require('../src/Logger.js');
    describe('#write()', () => {
        it('should run', () => {
            Logger.write('');
        });
    });
    describe('#overwrite()', () => {
        it('should run', () => {
            Logger.overwrite('');
        });
    });
});