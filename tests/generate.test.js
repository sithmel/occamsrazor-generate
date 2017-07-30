var assert = require('chai').assert;
var generate = require('../lib/generate');
var range = require('iter-tools/lib/range');

describe('generate', function () {
  it('is a function', function () {
    assert.typeOf(generate, 'function');
  });
  it('returns a function', function () {
    assert.typeOf(generate(), 'function');
  });
  it('returns itself', function () {
    assert.equal(generate(undefined)(), undefined);
    assert.equal(generate(null)(), null);
    assert.equal(generate(3)(), 3);
    assert.equal(generate('hello')(), 'hello');
    assert.equal(generate(true)(), true);
  });
  it('returns function', function () {
    var f = function () {};
    assert.equal(generate(f), f);
  });
  it('clones an object', function () {
    assert.deepEqual(generate({ a: 1 })(), { a: 1 });
  });
  it('clones an object (deep)', function () {
    assert.deepEqual(generate({ a: { b: 2 } })(), { a: { b: 2 } });
  });
  it('clones an array', function () {
    assert.deepEqual(generate([1, 2, 3])(), [1, 2, 3]);
  });
  it('clones a nested structure', function () {
    assert.deepEqual(generate([1, { a: { c: [ 1, 2, 3 ] } }, 3])(), [1, { a: { c: [ 1, 2, 3 ] } }, 3]);
  });
  it('executes a function', function () {
    var f = function () { return 5; };
    assert.deepEqual(generate([1, f, 3])(), [1, 5, 3]);
  });
  it('clones a date', function () {
    var d = new Date();
    assert.isFalse(generate(d)() === d);
    assert.equal(generate(d)().getTime(), d.getTime());
  });
  it('clones a Map', function () {
    var m = new Map();
    m.set('hello', 'world');
    assert.isFalse(generate(m)() === m);
    assert.equal(generate(m)().get('hello'), m.get('hello'));
  });
  it('clones a Set', function () {
    var s = new Set();
    s.add('hello');
    assert.isFalse(generate(s)() === s);
    assert.isTrue(generate(s)().has('hello'));
  });
  it('clones a RegExp', function () {
    var re = /123/;
    assert.isFalse(generate(re)() === re);
    assert.equal(generate(re)().toString(), '/123/');
  });
  it('clones a Promise', function (done) {
    var p = Promise.resolve();
    assert.isFalse(generate(p)() === p);
    generate(p)()
    .then(function () {
      done();
    });
  });
  it('clones a Buffer', function () {
    var buffer = Buffer.from('123');
    assert.isFalse(generate(buffer)() === buffer);
    assert.equal(generate(buffer)().toString(), '123');
  });
  it('unrolls an iterator', function () {
    assert.deepEqual(generate(range(3))(), [0, 1, 2]);
  });
});
