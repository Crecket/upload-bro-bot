const assert = require('assert');

describe('Logger', () => {
    const Logger = require('../../src/Helpers/Logger.js');
    describe('#trace()', () => {
        it('should output empty string', () => {
            Logger.trace('');
        });
    });
    describe('#debug()', () => {
        it('should output empty string', () => {
            Logger.debug('');
        });
    });
    describe('#info()', () => {
        it('should output empty string', () => {
            Logger.info('');
        });
    });
    describe('#warn()', () => {
        it('should output empty string', () => {
            Logger.warn('');
        });
    });
    describe('#error()', () => {
        it('should output empty string', () => {
            Logger.error('');
        });
    });
});
