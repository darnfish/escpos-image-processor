'use strict';

const GaussianKernel = require('..');

describe('gaussian kernel', function () {
    it('default options', function () {
        const kernel = new GaussianKernel();
        kernel.compute([1, 2], [1, 2]).should.equal(1);
    });
});
