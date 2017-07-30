var chance = require('./chance');
var generate = require('../lib/generate');

module.exports = function pickSet(array, n) {
  return chance('pickset', generate(array)(), n);
};
