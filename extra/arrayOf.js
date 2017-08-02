var chance = require('./chance');
var generate = require('../lib/generate');

module.exports = function arrayOf(obj, opts) {
  var func = generate(obj);
  var minLen, maxLen, len, unique, comparator;

  if (typeof opts === 'object') {
    minLen = opts.minLen;
    maxLen = opts.maxLen;
    len = opts.len;
    unique = opts.unique;
    comparator = opts.comparator;
  } else if (typeof opts === undefined) {
    len = 1;
  } else {
    len = opts;
  }

  return function _arrayOf() {
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

    return arr;
  };
};
