occamsrazor-generate
====================
[![Build Status](https://travis-ci.org/sithmel/occamsrazor-generate.svg?branch=master)](https://travis-ci.org/sithmel/occamsrazor-generate)

Data generator

There are many cases where you want to generate random data. Testing, having random data for trying out or demoing your applicationetc.
This library simplifies this task.

Compatibility
=============
occamsrazor-generate is compatible with es5, but also works fine with es6 features: Map, Set and iterables. It uses commonjs for backward compatibility.

generate
========
The main function is generate. It creates a function that returns an object:
```js
const generate = require('occamsrazor-generate')

const generator = generate({ a: 1, b: 2 })
generator() // returns { a: 1, a: 2 }
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
const genNull = generate(null)
genNull() // returns null


const getRandomNumber = () => Math.random() * 10
const genCoordinate = generate({
  x: getRandomNumber,
  y: getRandomNumber
})

genCoordinate() // returns for example { x: 6, y: 3 }

const genUser = generate({
  title: /(mr|ms|mrs)/,
  name: /[A-Z][a-z]{4,10} [A-Z][a-z]{4,10}/
})

genUser() // returns { title: 'mr', name: 'Ekdcsrlyl Cfrpsugx' }
```

Override generated values
-------------------------
The function returned by generate can optionally take an argument. This is merged into the generated object. You can also use a function and this will be used to transform the generated object into something else.
```js
genUser({ id: 1 }) // returns { id: 1, title: 'mr', name: 'Ekdcsrlyl Cfrpsugx' }

// or

getUser((obj) => return { ...obj, id: obj.name.replace(' ', '-').toLowerCase() }) // returns { id: 'ekdcsrlyl-cfrpsugx', title: 'mr', name: 'Ekdcsrlyl Cfrpsugx' }
```

chancejs integration
====================
[Chance](http://chancejs.com) is a nice library to generate random values. This library includes a wrapper to use it.
```js
const chance = require('occamsrazor-generate/extra/chance')
```
The **chance** function takes the method as first argument and the other arguments as subsequent arguments. So for example:
```js
const randomInt = chance('integer', {min: -20, max: 20})
randomInt()
```
calls behind the scene:
```js
const chanceLib = require('chance')
chanceLib.integer({min: -20, max: 20})
```

With this wrapper you can generate an object with random properties:
```js
const genCoordinate = generate({
  x: chance('integer', {min: -20, max: 20}),
  y: chance('integer', {min: -20, max: 20})
})

genCoordinate()

// generate a random user
const genUser = generate({
  firstName: chance('first'),
  lastName: chance('last'),
  age: chance('age')
})

genUser()
// I got: { firstName: 'Ruby', lastName: 'Delgado', age: 58 }
```

shuffle
=======
This is a sligthly modified version of chance.shuffle that applies generate recursively to every item:
```js
const shuffle = require('occamsrazor-generate/extra/shuffle')
const users = shuffle(gen3Users)
```

pick
====
picks an item from an array:
```js
const pick = require('occamsrazor-generate/extra/pick')
const genNumbers = pick([1, 2, 3])
```
You can also add "weights" to make sure items are picked with a specific frequency:
```js
const pick = require('occamsrazor-generate/extra/pick')
const dice = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1])
```
The latter represent a roll of 2 dice with 6 faces.

arrayOf
=======
This can be used to generate an array containing multiple items:
```js
const arrayOf = require('occamsrazor-generate/extra/arrayOf')
const gen3Users = arrayOf(genUser, 3)
gen3Users()
// I got:
// [ { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   { firstName: 'Jack', lastName: 'Yates', age: 53 } ]
```
It is equivalent to:
```js
const gen3Users = arrayOf({
  firstName: chance('first'),
  lastName: chance('last'),
  age: chance('age')
}, 3)
```
**arrayOf** has a lot of parameters:
* **len**: number of generated items
* **minLen**: minimum number of generated items
* **maxLen**: maximum number of generated items
* **unique**: if true, every item will be unique
* **comparator**: this optional function is used to check if 2 items are the same (check the documentation of http://chancejs.com/)

For example:
```js
const genUsersDifferentAges = arrayOf(genUser, {
  minLen: 3,
  maxLen: 30,
  unique: true,
  comparator: (arr, val) => {
    if (arr.length === 0) {
      return false
    } else {
      // If a match has been found, short circuit check and just return
      return arr.reduce((acc, item) => acc ? acc : item.age === val.age, false)
    }
  } })
genUsersDifferentAges()
// between 3 and 30 users all with different ages
```

objectOf
========
It has the same options of **arrayOf** but returns an object instead. The object has unique keys by default.
```js
const objectOf = require('occamsrazor-generate/extra/objectOf')
const gen3Users = objectOf(genUser, 3)
gen3Users()
// I got:
// { '1': { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   '2': { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   '3': { firstName: 'Jack', lastName: 'Yates', age: 53 } }
```
But you can determine the key using a function that takes as input every item.
```js
const gen3Users = objectOf(genUser, { len: 3, key: (item) => item.firstName + '-' + item.lastName })
gen3Users();
// I got:
// { 'Alfred-Bowers': { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   'Edith-Wheeler': { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   'Jack-Yates': { firstName: 'Jack', lastName: 'Yates', age: 53 } }
```

iterableOf
==========
This returns an iterable of generated items:
```js
const iterableOf = require('occamsrazor-generate/extra/iterableOf')
const gen3Users = iterableOf(genUser, 3)
for (const user of gen3Users()) {
  console.log(user)
}
// I got:
// [ { firstName: 'Alfred', lastName: 'Bowers', age: 54 },
//   { firstName: 'Edith', lastName: 'Wheeler', age: 40 },
//   { firstName: 'Jack', lastName: 'Yates', age: 53 } ]
```
**iterableOf** has a this arguments:
* **len**: number of generated items
* **minLen**: minimum number of generated items
* **maxLen**: maximum number of generated items

mapItems
=================
It is useful to generate an array or an object with values related to each other.
```js
const mapItems = require('occamsrazor-generate/extra/mapItems')

const genPeople = mapItems([
  { user: chance('first') },
  { user: chance('first') },
  { user: chance('first') }
], (item, i) =>  Object.assign({}, item, { id: i }))

const genPeople = mapItems({
  id1: { user: chance('first') },
  id2: { user: chance('first') },
  id3: { user: chance('first') }
}, (item, key) => Object.assign({}, item, { id: key }))
```
The callback takes as arguments the current item, the index and the whole array/object.
The object passed to both these functions are transformed in functions using **generate**.
The callback can also be a string, in that case it is transformed in a function returning the property with that name.
