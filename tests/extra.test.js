var assert = require('chai').assert;
var shuffle = require('../extra/shuffle');
var pick = require('../extra/pick');
var many = require('../extra/many');

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

describe('many', function () {
  it('is a function', function () {
    assert.typeOf(many, 'function');
  });
  it('defaults to 1', function () {
    var func = many(1);
    var items = func();
    assert.deepEqual(items, [1]);
  });
  it('uses a number as options', function () {
    var func = many(1, 2);
    var items = func();
    assert.deepEqual(items, [1, 1]);
  });
  it('uses len', function () {
    var func = many(1, { len: 2 });
    var items = func();
    assert.deepEqual(items, [1, 1]);
  });
  it('uses minLen, maxLen', function () {
    var func = many(1, { minLen: 1, maxLen: 3 });
    var items = func();
    assert.isTrue(items.length >= 1 && items.length <= 3);
  });
  it('uses unique', function () {
    var func = many(pick([1, 2, 3, 4]), { len: 2, unique: true });
    var items = func();
    assert.equal(items.length, 2);
    assert.notEqual(items[0], items[1]);
  });
  it('generates a object', function () {
    var func = many(pick([1, 2]), { len: 2, key: function (val) {
      return val.toString();
    } });
    var items = func();
    assert.deepEqual(items, { '1': 1, '2': 2 });
  });
  it('uses a map', function () {
    var func = many(1, { len: 2, map: function (n) { return n + 3; } });
    var items = func();
    assert.deepEqual(items, [4, 4]);
  });
  it('uses a map with an object', function () {
    var func = many(pick([1, 2]), { len: 2, key: function (val) {
      return val.toString();
    },
    map: function (n) { return n + 3; }});
    var items = func();
    assert.deepEqual(items, { '1': 4, '2': 5 });
  });
  describe('alternative init style', function () {
    it('init using opts', function () {
      var func = many(1).opts({ len: 2 });
      var items = func();
      assert.deepEqual(items, [1, 1]);
    });
    it('init using len', function () {
      var func = many(1).len(2);
      var items = func();
      assert.deepEqual(items, [1, 1]);
    });
    it('init using chaining', function () {
      var func = many(1).minLen(1).maxLen(3);
      var items = func();
      assert.isTrue(items.length >= 1 && items.length <= 3);
    });
  });

});
