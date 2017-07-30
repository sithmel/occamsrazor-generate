var regexpClone = require('regexp-clone');

var NativeMap;
try {
  NativeMap = Map;
} catch (_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  NativeMap = undefined;
}

var NativeSet;
try {
  NativeSet = Set;
} catch (_) {
  NativeSet = undefined;
}

var NativePromise;
try {
  NativePromise = Promise;
} catch (_) {
  NativePromise = undefined;
}

var NativeBuffer;
try {
  NativeBuffer = Buffer;
} catch (_) {
  NativeBuffer = undefined;
}

function isRegExp(o) {
  return typeof o === 'object' && Object.prototype.toString.call(o) === '[object RegExp]';
}

function genItself(v) {
  return function () { return v; };
}

function genArray(arr) {
  return function () {
    var output = [];
    for (var i = 0; i < arr.length; i++) {
      output[i] = generate(arr[i])();
    }
    return output;
  };
}

function genObject(obj) {
  return function () {
    var output = obj.constructor ? new obj.constructor() : {};
    for (var attr in obj) {
      output[attr] = generate(obj[attr])();
    }
    return output;
  };
}

function genMap(m) {
  return function () {
    return new NativeMap(Array.from(m.entries()).map(function (entry) {
      var k = entry[0];
      var v = entry[1];
      return [k, generate(v)()];
    }));
  };
}

function genSet(m) {
  return function () {
    return new NativeSet(Array.from(m.entries()).map(function (entry) {
      var k = entry[0];
      var v = entry[1];
      return generate(v)();
    }));
  };
}

function genDate(date) {
  return function () {
    return new date.constructor(date.getTime());
  };
}

function genPromise(p) {
  return function () {
    return new NativePromise(function (resolve, reject) {
      p.then(function (value) {
        resolve(value);
      },
      function (err) {
        reject(err);
      });
    });
  };
}

function genBuffer(b) {
  return function () {
    var child = new Buffer(b.length);
    b.copy(child);
    return child;
  };
}

function genRE(value) {
  return function () {
    return regexpClone(value);
  };
}

function generate(value) {
  if (typeof value === 'number' ||
    typeof value === 'undefined' ||
    typeof value === 'string' ||
    value === null ||
    typeof value === 'boolean') {
    return genItself(value);
  } else if (typeof value === 'function') {
    return value;
  } else if (Array.isArray(value)) {
    return genArray(value);
  } else if (Object.prototype.toString.call(value) === '[object Date]') {
    return genDate(value);
  } else if (isRegExp(value)) {
    return genRE(value);
  } else if (NativeMap && value instanceof NativeMap) {
    return genMap(value);
  } else if (NativeSet && value instanceof NativeSet) {
    return genSet(value);
  } else if (NativePromise && value instanceof NativePromise) {
    return genPromise(value);
  } else if (NativeBuffer && NativeBuffer.isBuffer(value)) {
    return genBuffer(value);
  } else if (typeof value === 'object') {
    return genObject(value);
  }
}

module.exports = generate;
