var assert = require('chai').assert;
var shuffle = require('../extra/shuffle');
var pick = require('../extra/pick');
var sequence = require('../extra/sequence');

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

describe('pick', function () {
  it('is a function', function () {
    assert.typeOf(pick, 'function');
  });
  it('picks one', function () {
    var func = pick([1, 2, 3]);
    var item = func();
    assert.isTrue(item === 1 || item === 2 || item === 3);
  });
  it('picks one (weights)', function () {
    var func = pick([1, 2, 3], [100, 0, 0]);
    var item = func();
    assert.equal(item, 1);
  });
});

describe('sequence', function () {
  it('is a function', function () {
    assert.typeOf(sequence, 'function');
  });
  it('sequences', function () {
    var func = sequence(2, 1);
    var items = func();
    assert.deepEqual(items, [1, 1]);
  });
  it('sequences (using times)', function () {
    var func = sequence({ times: 2 }, 1);
    var items = func();
    assert.deepEqual(items, [1, 1]);
  });
  it('sequences (using min, max)', function () {
    var func = sequence({ min: 1, max: 3 }, 1);
    var items = func();
    assert.isTrue(items.length >= 1 && items.length <= 3);
  });
  it('sequences (using unique)', function () {
    var func = sequence({ times: 2, unique: true }, pick([1, 2, 3, 4]));
    var items = func();
    assert.equal(items.length, 2);
    assert.notEqual(items[0], items[1]);
  });
  it('sequences (key)', function () {
    var func = sequence({ times: 2, key: function (val) {
      return val.toString();
    } }, pick([1, 2]));
    var items = func();
    assert.deepEqual(items, { '1': 1, '2': 2 });
  });

});
