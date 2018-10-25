import maybeToPrecision from '../maybeToPrecision';

describe('maybeToPrecision', () => {
    it('positive number - no digit', () => {
        expect(maybeToPrecision(0)).toEqual('0');
        expect(maybeToPrecision(10)).toEqual('10');
        expect(maybeToPrecision(0.052469)).toEqual('0.052469');
    });

    it('positive number - digit', () => {
        expect(maybeToPrecision(0, 1)).toEqual('0');
        expect(maybeToPrecision(0, 2)).toEqual('0.0');
        expect(maybeToPrecision(0.52469, 3)).toEqual('0.525');
    });

    it('negative number - no digit', () => {
        expect(maybeToPrecision(-0)).toEqual('0');
        expect(maybeToPrecision(-10)).toEqual('- 10');
        expect(maybeToPrecision(-0.052469)).toEqual('- 0.052469');
    });

    it('negative number - digit', () => {
        expect(maybeToPrecision(-0, 1)).toEqual('0');
        expect(maybeToPrecision(-0, 2)).toEqual('0.0');
        expect(maybeToPrecision(-0.52469, 3)).toEqual('- 0.525');
        expect(maybeToPrecision(-4, 3)).toEqual('- 4.00');
    });

    it('wrong digit option', () => {
        expect(function () {
            maybeToPrecision(0, 0);
        }).toThrow(/argument must be between 1 and 21/);
    });
});
