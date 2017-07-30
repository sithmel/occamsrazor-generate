var assert = require('chai').assert;
var getChance = require('../lib/get-chance');

describe('getChance', function () {
  var chance = getChance();

  it('is a function', function () {
    assert.typeOf(chance, 'function');
  });

  it('uses chancejs to create number', function () {
    var randomNumber = chance('integer');
    assert.typeOf(randomNumber, 'function');
    assert.typeOf(randomNumber(), 'number');
  });

  it('uses chancejs with arguments', function () {
    var randomString = chance('string', { pool: 'abcde' });
    assert.typeOf(randomString, 'function');
    assert.match(randomString(),/[abcde]+/);
  });
});
