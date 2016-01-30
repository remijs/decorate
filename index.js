'use strict'
const merge = require('merge')

module.exports = function() {
  return (next, target, plugin, cb) => {
    let extension = {
      decorate(type, prop, method) {
        if (type !== 'server')
          throw new Error('Only "server" type is supported')

        if (typeof prop === 'string') {
          extension[prop] = method
        } else if (typeof prop === 'object') {
          merge(extension, prop)
        } else {
          throw new Error('invalid arguments passed to decorate')
        }

        merge(target, extension)
        merge(target.root, extension)
      },
    }

    next(merge(target, extension), plugin, cb)
  }
}
