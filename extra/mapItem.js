var generate = require('../lib/generate');
var iteratee = require('lodash/iteratee');

module.exports = function mapItem(obj, func) {
  var gen = generate(obj);
  func = iteratee(func);
  return function () {
    return func(gen());
  };
};
