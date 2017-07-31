var RandExp = require('randexp');

module.exports = function genRegExp(re) {
  var generator = new RandExp(re);
  return function () {
    return generator.gen();
  };
};
