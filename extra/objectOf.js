var arrayOf = require('./arrayOf')
var keyBy = require('lodash/keyBy')
var uniqueId = require('lodash/uniqueId')

function getId () {
  return uniqueId()
}

module.exports = function objectOf (obj, opts) {
  var genArr = arrayOf(obj, opts)
  var key = opts && opts.key ? opts.key : getId
  return function _objectOf () {
    var arr = genArr()
    return keyBy(arr, key)
  }
}
