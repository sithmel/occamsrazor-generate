var assert = require('chai').assert;
var shuffle = require('../extra/shuffle');
var pickone = require('../extra/pickone');
var pickset = require('../extra/pickset');
var repeat = require('../extra/repeat');
var repeatIter = require('../extra/repeat-iter');

describe('shuffle', function () {
  it('is a function', function () {
    assert.typeOf(shuffle, 'function');
  });
  it('shuffles', function () {
    var func = shuffle([1, 2, 3]);
    var items = func();
    assert.isTrue(items[0] === 1 || items[0] === 2 || items[0] === 3);
  });
});

describe('pickone', function () {
  it('is a function', function () {
    assert.typeOf(pickone, 'function');
  });
  it('picks one', function () {
    var func = pickone([1, 2, 3]);
    var item = func();
    assert.isTrue(item === 1 || item === 2 || item === 3);
  });
});

describe('pickset', function () {
  it('is a function', function () {
    assert.typeOf(pickset, 'function');
  });
  it('picks a set', function () {
    var func = pickset([1, 2, 3], 2);
    var items = func();
    assert.equal(items.length, 2);
    assert.isTrue(items[0] === 1 || items[0] === 2 || items[0] === 3);
  });
});

describe('repeat', function () {
  it('is a function', function () {
    assert.typeOf(repeat, 'function');
  });
  it('repeats', function () {
    var func = repeat(1, 2);
    var items = func();
    assert.deepEqual(items, [1, 1]);
  });
});

describe('repeatIter', function () {
  it('is a function', function () {
    assert.typeOf(repeat, 'function');
  });
  it('repeats', function () {
    var func = repeat(1, 2);
    var items = func();
    assert.deepEqual(items, [1, 1]);
  });
});
