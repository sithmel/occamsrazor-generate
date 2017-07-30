var chance = require('./chance');
var generate = require('../lib/generate');

module.exports = function shuffle(array) {
  return chance('shuffle', generate(array)());
};
