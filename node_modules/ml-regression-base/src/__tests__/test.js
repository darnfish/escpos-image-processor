import BaseRegression from '..';

class NoPredict extends BaseRegression {}
class Basic extends BaseRegression {
    constructor(factor) {
        super();
        this.factor = factor;
    }
    _predict(x) {
        return x * this.factor;
    }
}

describe('base regression', () => {
    it('should not be directly constructable', () => {
        expect(function () {
            new BaseRegression();
        }).toThrow(/BaseRegression must be subclassed/);
    });

    it('should throw if _predict is not implemented', () => {
        const reg = new NoPredict();
        expect(function () {
            reg.predict(0);
        }).toThrow(/_predict must be implemented/);
    });

    it('should do a basic prediction', () => {
        const basic = new Basic(2);
        expect(basic.predict(1)).toEqual(2);
        expect(basic.predict(2)).toEqual(4);
        expect(basic.predict([2, 3])).toEqual([4, 6]);
    });

    it('should throw on invalid value', () => {
        const basic = new Basic(2);
        expect(function () {
            basic.predict();
        }).toThrow(/must be a number or array/);
    });

    it('should implement dummy predictor functions', () => {
        const basic = new Basic(2);
        basic.train(); // should not throw
        expect(basic.toString()).toEqual('');
        expect(basic.toLaTeX()).toEqual('');
    });

    it('should implement a scoring function', () => {
        const basic = new Basic(2);
        expect(basic.score([1, 2], [2, 4])).toEqual({
            r: 1,
            r2: 1,
            chi2: 0,
            rmsd: 0
        });
        expect(basic.score([1, 2], [0.5, 2])).toEqual({
            r: 1,
            r2: 1,
            chi2: 6.5,
            rmsd: 8
        });
    });
});
