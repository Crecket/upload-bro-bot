const assert = require('assert');
const expect = require('chai').expect;

describe('Logger', () => {
    const Logger = require('./Logger.js');
    describe('#trace()', () => {
        it('should trace function', () => {
            expect(Logger).to.have.property('trace')
        });
    });
    describe('#debug()', () => {
        it('should debug function', () => {
            expect(Logger).to.have.property('debug')
        });
    });
    describe('#info()', () => {
        it('should info function', () => {
            expect(Logger).to.have.property('info')
        });
    });
    describe('#warn()', () => {
        it('should warn function', () => {
            expect(Logger).to.have.property('warn');
        });
    });
    describe('#error()', () => {
        it('should error function', () => {
            expect(Logger).to.have.property('error')
        });
    });
});
