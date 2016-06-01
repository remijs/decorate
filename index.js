'use strict'
module.exports = function (opts) {
  return function (next, target, plugin, cb) {
    target.decorate = function (prop, method) {
      return decorate(this, prop, method)
    }

    next(target, plugin, cb)
  }
}

module.exports.emulateHapi = function (opts) {
  return function (next, target, plugin, cb) {
    target.decorate = function (type, prop, method) {
      if (type !== 'server') {
        throw new Error('Only "server" type is supported')
      }

      return decorate(this, prop, method)
    }

    next(target, plugin, cb)
  }
}

function decorate (target, prop, method) {
  if (typeof prop === 'object') {
    Object.keys(prop).forEach(function (key) {
      decorate(target, key, prop[key])
    })
    return
  }

  if (typeof prop !== 'string') {
    throw new Error('invalid arguments passed to decorate')
  }

  if (target[prop]) {
    throw new Error('Server decoration already defined: ' + prop)
  }

  target[prop] = method
  target.root[prop] = method
}
