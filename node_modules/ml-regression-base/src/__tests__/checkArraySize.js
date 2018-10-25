import checkArrayLength from '../checkArrayLength';

describe('checkArrayLength', () => {
    it('throws on different Length', () => {
        const expected = /x and y arrays must have the same length/;
        expect(() => checkArrayLength([], [1])).toThrow(expected);
        expect(() => checkArrayLength([1], [])).toThrow(expected);
        expect(() => checkArrayLength([1], [1, 2])).toThrow(expected);
    });

    it('throws if not arrays', () => {
        const expected = /x and y must be arrays/;
        expect(() => checkArrayLength(null, [1])).toThrow(expected);
        expect(() => checkArrayLength([], null)).toThrow(expected);
        expect(() => checkArrayLength()).toThrow(expected);
        expect(() => checkArrayLength(42, [])).toThrow(expected);
        expect(() => checkArrayLength([], 'hello')).toThrow(expected);
    });

    it('does nothing if same Length', () => {
        checkArrayLength([1], [2]);
        checkArrayLength([], []);
        checkArrayLength(new Array(10), new Array(10));
    });
});
