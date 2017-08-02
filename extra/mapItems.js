var generate = require('../lib/generate');
var mapValues = require('lodash/mapValues');
var map = require('lodash/map');
var isPlainObject = require('lodash/isPlainObject');

module.exports = function mapItems(obj, func) {
  var gen = generate(obj);
  return function () {
    var items = gen();
    if (Array.isArray(items)) {
      return map(items, func);
    } else if (isPlainObject(items)) {
      return mapValues(items, func);
    } else {
      throw new Error('Invalid object. You can map plain objects or arrays');
    }
  };
};
