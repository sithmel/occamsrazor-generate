var chance = require('./chance')
var generate = require('../lib/generate')

module.exports = function iterableOf (obj, opts) {
  var func = generate(obj)
  var minLen, maxLen, len

  if (typeof opts === 'object') {
    minLen = opts.minLen
    maxLen = opts.maxLen
    len = opts.len
  } else if (typeof opts === 'undefined') {
    len = Infinity
  } else {
    len = opts
  }

  return function _iterableOf () {
    var n
    if (!((typeof minLen === 'number' && typeof maxLen === 'number') || typeof len === 'number')) {
      n = Infinity
    } else {
      n = len || chance('natural', { min: minLen, max: maxLen })()
    }

    var iterable = function () {
      return {
        next: function () {
          if (n === 0) return { done: true }
          n--
          return { done: false, value: func() }
        }
      }
    }
      
    iterable[Symbol.iterator] = iterable
    return iterable
  }
}
