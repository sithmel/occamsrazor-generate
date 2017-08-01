var chance = require('./chance');
var generate = require('../lib/generate');
var keyBy = require('lodash/keyBy');
var mapValues = require('lodash/mapValues');
var map = require('lodash/map');

module.exports = function many(obj, opts) {
  var func = generate(obj);
  var minLen, maxLen, len, unique, comparator, key, mapFunc;

  var setup = function (opts) {
    if (typeof opts === 'object') {
      minLen = opts.minLen;
      maxLen = opts.maxLen;
      len = opts.len;
      unique = opts.unique;
      comparator = opts.comparator;
      key = opts.key;
      mapFunc = opts.map;
    } else if (typeof opts === undefined) {
      len = 1;
    } else {
      len = opts;
    }
  };

  setup(opts);

  var closure = function _sequence() {
    var n;
    if (!((typeof minLen === 'number' && typeof maxLen === 'number') || typeof len === 'number')) {
      n = 1;
    } else {
      n = len ? len : chance('natural', { min: minLen, max: maxLen })();
    }

    var arr, output;
    if (unique) {
      arr = chance('unique', func, n, { comparator: comparator })();
    } else {
      arr = [];
      for (var i = 0; i < n; i++) {
        arr.push(func());
      }
    }

    if (key) {
      output = keyBy(arr, opts.key);
      output = mapFunc ? mapValues(output, mapFunc) : output;
    } else {
      output = mapFunc ? map(arr, mapFunc) : arr;
    }

    return output;
  };

  closure.opts = function (options) {
    setup(options);
    return closure;
  };

  closure.minLen = function (n) { minLen = n; return closure; };
  closure.maxLen = function (n) { maxLen = n; return closure; };
  closure.len = function (n) { len = n; return closure; };
  closure.unique = function () { unique = true; return closure; };
  closure.comparator = function (f) { comparator = f; return closure; };
  closure.key = function (k) { key = k; return closure; };
  closure.map = function (f) { mapFunc = f; return closure; };

  return closure;
};
