'use strict';

var euclidean = require('..');

var v1 = [0, 1, 4, 6, 2];
var v2 = [3, 6, 9, 4, 3];
var v3 = [5, 4, 1, 6, 9];

describe('euclidean distance', function () {
    it('should return 0 with itself', function () {
        euclidean(v1, v1).should.equal(0);
    });

    it('should be correct', function () {
        euclidean(v1, v2).should.equal(8);
        euclidean(v1, v3).should.equal(Math.sqrt(euclidean.squared(v1, v3)));
    });
});

describe('squared euclidean distance', function () {
    it('should return 0 with itself', function () {
        euclidean.squared(v1, v1).should.equal(0);
    });

    it('should be correct', function () {
        euclidean.squared(v1, v2).should.equal(64);
    });
});
