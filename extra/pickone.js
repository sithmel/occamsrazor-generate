var chance = require('./chance');
var generate = require('../lib/generate');

module.exports = function pickOne(array) {
  return chance('pickone', generate(array)());
};
