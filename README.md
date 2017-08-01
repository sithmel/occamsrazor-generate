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
* dates, Promises, node.js buffers are cloned
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

many
====
This can be used to generate an array or an object containing multiple items:
```js
var many = require('occamsrazor-generate/extra/many');
var gen3Users = many(genUser, 3);
gen3Users();
// I got:
// [ { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   { firstName: 'Jack', lastName: 'Yates', age: 53 } ]
```
It is equivalent to:
```js
var gen3Users = many({
  firstName: chance('first'),
  lastName: chance('last'),
  age: chance('age')
}, 3);
```
**many** has a lot of parameters and supports 2 different ways for being configured. You can:
pass a number (number of items):
```js
many(genUser, 3)
```
using an object:
```js
many(genUser, { len: 3 });
// or
many(genUser, { minLen: 3, maxLen: 10 });
```
Setting the options with the "opts" method:
```js
many(genUser).opts({ minLen: 3, maxLen: 10 });
```
Setting the options individually:
```js
many(genUser).minLen(3).maxLen(10);
```
The function will be returned after every method call.

many (options)
--------------
* **len**: number of generated items
* **minLen**: minimum number of generated items
* **maxLen**: maximum number of generated items
* **unique**: if true, every item will be unique
* **comparator**: this optional function is used to check if 2 items are the same (check the documentation of http://chancejs.com/)
* **key**: using this option, you will get an object instead of an array. **Key** can be a function that returns the key, it takes as argument the respective item. **Key** can also be a string: In that case the key will be equal the property of the item with the same name.
* **map**: allows to modify an item. If can be a function or a string (in the same way as **key**). The function takes as arguments: (currentItem, index/key, entireArray/entireObject)

For example:
```js
var genUsers = many(genUser)
.len(3) // generate 3 items
.unique() // they should be unique
.comparator((arr, val) => { // specifically it should not exists more than one with the same name and surname
  // If this is the first element, we know it doesn't exist
  if (arr.length === 0) {
    return false
  } else {
    // If a match has been found, short circuit check and just return
    return arr.reduce((acc, item) => acc ? acc : `${item.firstName}-${item.lastName}` === `${val.firstName}-${val.lastName}`, false)
  }
})
.key((item) => `${item.firstName}-${item.lastName}`); // I build a map using as a key firstName-lastName
.map((item, key) => Object.assign({}, item, { id: key })); // I copy the key in the object as "id"
```
I should get:
```js
genUsers();
// {
//   'Alfred-Bowers': { id: 'Alfred-Bowers', firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   'Alfred-Bowers': { id: 'Edith-Wheeler', firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   'Alfred-Bowers': { id: 'Jack-Yates', firstName: 'Jack', lastName: 'Yates', age: 53 }
// }
```
**map** is also very useful when you want to calculate a field that is related to another.

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
