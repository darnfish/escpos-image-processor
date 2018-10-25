import mcch from '..';

describe('monotoneChainConvexHull', () => {
    it('basic square', () => {
        assert(
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 0]]
        );
    });

    it('rectangle with inside points', () => {
        assert(
            [[1, 1], [3, 0], [2, 1], [3, 2], [1, 2], [0, 2], [0, 0]],
            [[0, 0], [0, 2], [3, 2], [3, 0]]
        );
    });

    it('more complex shape', () => {
        assert(
            [[-1, -1], [0, 0], [0, -2], [1, 0], [1, 2], [4, 1], [0, 8], [3, 6], [2, 4]],
            [[-1, -1], [0, 8], [3, 6], [4, 1], [0, -2]]
        );
    });

    it('already sorted', () => {
        expect(mcch([[0, 0], [0, 2], [1, 1], [1, 2], [2, 1], [3, 0], [3, 2]], {sorted: true}))
            .toEqual([[0, 0], [0, 2], [3, 2], [3, 0]]);
    });
});

function assert(input, output) {
    expect(mcch(input)).toEqual(output);
}
