var chance = require('./chance');
var generate = require('../lib/generate');

module.exports = function pick(array, weights) {
  if (weights) {
    return chance('weighted', generate(array)(), weights);
  }
  return chance('pickone', generate(array)());
};
