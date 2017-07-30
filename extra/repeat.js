var chance = require('chance');
var generate = require('../lib/generate');

module.exports = function repeat(obj, min, max) {
  var func = generate(obj);
  return function () {
    var n = typeof max === 'undefined' ? min : chance.natural({ min: min, max: max });
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr.push(func());
    }
    return arr;
  };
};
