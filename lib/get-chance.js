var Chance = require('chance');

function getChance(seed) {
  var chance = new Chance(seed);
  return function (method) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
      return chance[method].apply(chance, args);
    };
  };
}

module.exports = getChance;
