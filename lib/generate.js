var RandExp = require('randexp')
var _merge = require('lodash/merge')

function genRegExp (re) {
  var generator = new RandExp(re)
  return function () {
    return generator.gen()
  }
};

function isRegExp (o) {
  return typeof o === 'object' && Object.prototype.toString.call(o) === '[object RegExp]'
}

function genItself (v) {
  return function () { return v }
}

function genArray (arr) {
  return function () {
    var output = []
    for (var i = 0; i < arr.length; i++) {
      output[i] = generate(arr[i])()
    }
    return output
  }
}

function genObject (obj) {
  return function () {
    var output = obj.constructor ? new obj.constructor() : {}
    for (var attr in obj) {
      output[attr] = generate(obj[attr])()
    }
    return output
  }
}

function genMap (m) {
  return function () {
    return new Map(Array.from(m.entries()).map(function (entry) {
      var k = entry[0]
      var v = entry[1]
      return [k, generate(v)()]
    }))
  }
}

function genSet (m) {
  return function () {
    return new Set(Array.from(m.entries()).map(function (entry) {
      // var k = entry[0]
      var v = entry[1]
      return generate(v)()
    }))
  }
}

function genDate (date) {
  return function () {
    return new date.constructor(date.getTime())
  }
}

function genIter (iter) {
  return function () {
    return Array.from(iter)
  }
}

function generate (value, mergeArgument) {
  var genFunc
  if (typeof value === 'number' ||
    typeof value === 'undefined' ||
    typeof value === 'string' ||
    value === null ||
    typeof value === 'boolean') {
    genFunc = genItself(value)
  } else if (typeof value === 'function') {
    genFunc = value
  } else if (Array.isArray(value)) {
    genFunc = genArray(value)
  } else if (Object.prototype.toString.call(value) === '[object Date]') {
    genFunc = genDate(value)
  } else if (isRegExp(value)) {
    genFunc = genRegExp(value)
  } else if (Map && value instanceof Map) {
    genFunc = genMap(value)
  } else if (Set && value instanceof Set) {
    genFunc = genSet(value)
  } else if (typeof value === 'object' && 'next' in value) {
    genFunc = genIter(value)
  } else if (typeof value === 'object') {
    genFunc = genObject(value)
  }

  if (mergeArgument) {
    return function _generate () {
      var generatedData = genFunc()
      var objToMerge = typeof mergeArgument === 'function' ? mergeArgument(generatedData) : mergeArgument
      return _merge(generatedData, objToMerge)
    }
  }

  return genFunc
}

module.exports = generate
