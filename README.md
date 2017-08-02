occamsrazor-generate
====================
[![Build Status](https://travis-ci.org/sithmel/occamsrazor-generate.svg?branch=master)](https://travis-ci.org/sithmel/occamsrazor-generate)

Data generator

There are many cases where you want to generate random data. Testing, having random data for trying out or demoing your applicationetc.
This library simplifies this task.

generate
========
The main function is generate. It creates a function that returns an object:
```js
var generate = require('occamsrazor-generate');

var generator = generate({ a: 1, b: 2 });
generator(); // returns { a: 1, a: 2 }
```
The argument passed to **generate** is a kind of DSL to describe the shape of the object returned.
It works with these rules:
* numbers, undefined, strings, null and booleans are returned as they are
* an array generates an array of the same length. Every item will be subjected to these rules
* an object generates an object with the same attributes. Every value will be subjected to these rules. ES6 Maps and Sets works the same.
* regular expressions generate a string that matches them
* dates are cloned
* iterators are transformed to arrays
* functions will be executed (this makes **generate** extensible)

So for example:
```js
var genNull = generate(null);
genNull(); // returns null


var getRandomNumber = function () { return Math.random() * 10 };
var genCoordinate = generate({
  x: getRandomNumber,
  y: getRandomNumber
});

genCoordinate(); // returns for example { x: 6, y: 3 }

var genUser = generate({
  title: /(mr|ms|mrs)/,
  name: /[A-Z][a-z]{4,10} [A-Z][a-z]{4,10}/
});

genUser(); // returns { title: 'mr', name: 'Ekdcsrlyl Cfrpsugx' }
```

chancejs integration
====================
[Chance](http://chancejs.com) is a nice library to generate random values. This library includes a wrapper to use it.
```js
var chance = require('occamsrazor-generate/extra/chance');
```
The **chance** function takes the method as first argument and the other arguments as subsequent arguments. So for example:
```js
var randomInt = chance('integer', {min: -20, max: 20});
randomInt();
```
calls behind the scene:
```js
var chanceLib = require('chance');
chanceLib.integer({min: -20, max: 20});
```

With this wrapper you can generate an object with random properties:
```js
var genCoordinate = generate({
  x: chance('integer', {min: -20, max: 20}),
  y: chance('integer', {min: -20, max: 20})
});

genCoordinate();

// generate a random user
var genUser = generate({
  firstName: chance('first'),
  lastName: chance('last'),
  age: chance('age')
});

genUser();
// I got: { firstName: 'Ruby', lastName: 'Delgado', age: 58 }
```

shuffle
=======
This is a sligthly modified version of chance.shuffle that applies generate recursively to every item:
```js
var shuffle = require('occamsrazor-generate/extra/shuffle');
var users = shuffle(gen3Users);
```

pick
====
picks an item from an array:
```js
var pick = require('occamsrazor-generate/extra/pick');
var genNumbers = pick([1, 2, 3]);
```
You can also add "weights" to make sure items are picked with a specific frequency:
```js
var pick = require('occamsrazor-generate/extra/pick');
var dice = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]);
```
The latter represent a roll of 2 dice with 6 faces.

arrayOf
=======
This can be used to generate an array containing multiple items:
```js
var arrayOf = require('occamsrazor-generate/extra/arrayOf');
var gen3Users = arrayOf(genUser, 3);
gen3Users();
// I got:
// [ { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   { firstName: 'Jack', lastName: 'Yates', age: 53 } ]
```
It is equivalent to:
```js
var gen3Users = arrayOf({
  firstName: chance('first'),
  lastName: chance('last'),
  age: chance('age')
}, 3);
```
**arrayOf** has a lot of parameters:
* **len**: number of generated items
* **minLen**: minimum number of generated items
* **maxLen**: maximum number of generated items
* **unique**: if true, every item will be unique
* **comparator**: this optional function is used to check if 2 items are the same (check the documentation of http://chancejs.com/)

For example:
```js
var genUsersDifferentAges = arrayOf(genUser, {
  minLen: 3,
  maxLen: 30,
  unique: true,
  comparator: function (arr, val) {
    if (arr.length === 0) {
      return false
    } else {
      // If a match has been found, short circuit check and just return
      return arr.reduce((acc, item) => acc ? acc : item.age === val.age, false);
    }
  } });
genUsersDifferentAges();
// between 3 and 30 users all with different ages
```

objectOf
========
It has the same options of **arrayOf** but returns an object instead. The object has unique keys by default.
```js
var objectOf = require('occamsrazor-generate/extra/objectOf');
var gen3Users = objectOf(genUser, 3);
gen3Users();
// I got:
// { '1': { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   '2': { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   '3': { firstName: 'Jack', lastName: 'Yates', age: 53 } }
```
But you can determine the key using a function that takes as input every item.
```js
var gen3Users = objectOf(genUser, { len: 3, key: function (item) { return item.firstName + '-' + item.lastName; }});
gen3Users();
// I got:
// { 'Alfred-Bowers': { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   'Edith-Wheeler': { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   'Jack-Yates': { firstName: 'Jack', lastName: 'Yates', age: 53 } }
```

mapItem, mapItems
=================
mapItem runs the output of a function in a function.
```js
var mapItem = require('occamsrazor-generate/extra/mapItem');
var genPerson = mapItem({
  yearBorn: chance('year', { min: 1930, max: 1995 })
}, function (item) {
  return Object.assign({}, item, { yearDeath: (parseInt(item.yearBorn) + chanceLib.age()).toString() });
});
```
It is useful to create values relative between them.
mapItems is the same idea but it runs on an array or a map.
```js
var mapItems = require('occamsrazor-generate/extra/mapItems');
var genPeople = mapItems([
  { user: chance('first') },
  { user: chance('first') },
  { user: chance('first') }
], function (item, i) {
  return Object.assign({}, item, { id: i });
});
```
The callback takes as arguments the current item, the index and the whole array.
It can also run on object values:
```js
var genPeople = mapItems({
  id1: { user: chance('first') },
  id2: { user: chance('first') },
  id3: { user: chance('first') }
}, function (item, key) {
  return Object.assign({}, item, { id: key });
});
```
The callback takes as arguments the current item, the key and the whole object.
Very important! the object passed to both these functions are transformed in functions using **generate**.
The callback can also be a string, in that case it is transformed in a function returning the property with that name.
