var chance = require('./chance');
var generate = require('../lib/generate');
var keyBy = require('lodash/keyBy');

module.exports = function sequence(opts, obj) {
  var func = generate(obj);
  var min, max, times, unique, comparator, key;

  if (typeof opts === 'object') {
    min = opts.min;
    max = opts.max;
    times = opts.times;
    unique = opts.unique;
    comparator = opts.comparator;
    key = opts.key;
  } else {
    times = opts;
  }

  if (!((typeof min === 'number' && typeof max === 'number') || typeof times === 'number')) {
    throw new Error('You should either use "times" or "min" and "max"');
  }

  return function () {
    var n = times ? times : chance('natural', { min: min, max: max })();
    var arr;
    if (unique) {
      arr = chance('unique', func, n, { comparator: comparator })();
    } else {
      arr = [];
      for (var i = 0; i < n; i++) {
        arr.push(func());
      }
    }
    if (key) {
      return keyBy(arr, opts.key);
    }
    return arr;
  };
};
