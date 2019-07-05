/* eslint-env node, mocha */
var assert = require('chai').assert
var shuffle = require('../extra/shuffle')
var pick = require('../extra/pick')
var mapItems = require('../extra/mapItems')
var mapItem = require('../extra/mapItem')
var arrayOf = require('../extra/arrayOf')
var iterableOf = require('../extra/iterableOf')
var objectOf = require('../extra/objectOf')

describe('shuffle', function () {
  it('is a function', function () {
    assert.typeOf(shuffle, 'function')
  })
  it('shuffles', function () {
    var func = shuffle([1, 2, 3])
    var items = func()
    assert.isTrue(items[0] === 1 || items[0] === 2 || items[0] === 3)
  })
})

describe('pick', function () {
  it('is a function', function () {
    assert.typeOf(pick, 'function')
  })
  it('picks one', function () {
    var func = pick([1, 2, 3])
    var item = func()
    assert.isTrue(item === 1 || item === 2 || item === 3)
  })
  it('picks one (weights)', function () {
    var func = pick([1, 2, 3], [100, 0, 0])
    var item = func()
    assert.equal(item, 1)
  })
})

describe('mapItem', function () {
  it('is a function', function () {
    assert.typeOf(mapItem, 'function')
  })
  it('maps a single item', function () {
    var func = mapItem(3, function (item) { return item * 2 })
    var item = func()
    assert.equal(item, 6)
  })
  it('maps a single item using iteratee', function () {
    var func = mapItem({ a: 3 }, 'a')
    var item = func()
    assert.equal(item, 3)
  })
})

describe('mapItems', function () {
  it('is a function', function () {
    assert.typeOf(mapItems, 'function')
  })
  it('maps an array', function () {
    var func = mapItems([1, 2, 3], function (item, index) { return item * index })
    var item = func()
    assert.deepEqual(item, [0, 2, 6])
  })
  it('maps an array using iteratee', function () {
    var func = mapItems([{ a: 1 }, { a: 2 }, { a: 3 }], 'a')
    var item = func()
    assert.deepEqual(item, [1, 2, 3])
  })
  it('maps an object', function () {
    var func = mapItems({ a: 1, b: 2, c: 3 }, function (v, key) { return v + key })
    var item = func()
    assert.deepEqual(item, { a: '1a', b: '2b', c: '3c' })
  })
  it('maps an object using iteratee', function () {
    var func = mapItems({ a: { id: 1 }, b: { id: 2 }, c: { id: 3 } }, 'id')
    var item = func()
    assert.deepEqual(item, { a: 1, b: 2, c: 3 })
  })
})

describe('arrayOf', function () {
  it('is a function', function () {
    assert.typeOf(arrayOf, 'function')
  })
  it('defaults to 1', function () {
    var func = arrayOf(1)
    var items = func()
    assert.deepEqual(items, [1])
  })
  it('uses a number as options', function () {
    var func = arrayOf(1, 2)
    var items = func()
    assert.deepEqual(items, [1, 1])
  })
  it('uses len', function () {
    var func = arrayOf(1, { len: 2 })
    var items = func()
    assert.deepEqual(items, [1, 1])
  })
  it('uses minLen, maxLen', function () {
    var func = arrayOf(1, { minLen: 1, maxLen: 3 })
    var items = func()
    assert.isTrue(items.length >= 1 && items.length <= 3)
  })
  it('uses unique', function () {
    var func = arrayOf(pick([1, 2, 3, 4]), { len: 2, unique: true })
    var items = func()
    assert.equal(items.length, 2)
    assert.notEqual(items[0], items[1])
  })
})

describe('iterableOf', function () {
  it('is a function', function () {
    assert.typeOf(iterableOf, 'function')
  })
  it('defaults to 1', function () {
    var func = iterableOf(1, 3)
    var items = Array.from(func())
    assert.deepEqual(items, [1, 1, 1])
  })
  it('uses len', function () {
    var func = iterableOf(1, { len: 2 })
    var items = Array.from(func())
    assert.deepEqual(items, [1, 1])
  })
  it('uses minLen, maxLen', function () {
    var func = iterableOf(1, { minLen: 1, maxLen: 3 })
    var items = Array.from(func())
    assert.isTrue(items.length >= 1 && items.length <= 3)
  })
})

describe('objectOf', function () {
  it('is a function', function () {
    assert.typeOf(objectOf, 'function')
  })
  it('defaults to 1', function () {
    var func = objectOf(1)
    var items = func()
    assert.deepEqual(Object.values(items), [1])
  })
  it('uses a number as options', function () {
    var func = objectOf(1, 2)
    var items = func()
    assert.deepEqual(Object.values(items), [1, 1])
  })
  it('uses key', function () {
    var c = 0
    var func = objectOf(1, { len: 2, key: function (n) { return c++ } })
    var items = func()
    assert.deepEqual(items, { '0': 1, '1': 1 })
  })
})
