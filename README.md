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
* dates, regExp, Promises, node.js buffers are cloned
* iterators are transformed to arrays
* functions will be executed (this makes generate extensible)

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

repeat
======
This can be used to generate an array of multiple objects:
```js
var repeat = require('occamsrazor-generate/extra/repeat');
var gen3Users = repeat(genUser, 3);
gen3Users();
// I got:
// [ { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   { firstName: 'Jack', lastName: 'Yates', age: 53 } ]
```
It is equivalent to:
```js
var gen3Users = repeat({
  firstName: chance('first'),
  lastName: chance('last'),
  age: chance('age')
}, 3);
```
There is also a variation returning an iterator:
```js
var repeatIter = require('occamsrazor-generate/extra/repeat-iter');
var iter3Users = repeatIter(genUser, 3);
```

shuffle
=======
This is a sligthly modified version of chance.shuffle that applies generate recursively to every item:
```js
var shuffle = require('occamsrazor-generate/extra/shuffle');
var users = shuffle(gen3Users);
```

pickone, pickset
================
picks one or more items from an array or a generator function:
```js
var pickone = require('occamsrazor-generate/extra/pickone');
var pickset = require('occamsrazor-generate/extra/pickset');
var genUser = pickone(gen3Users);
var gen2User = pickset(gen3Users, 2);
```
