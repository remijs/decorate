'use strict'
const merge = require('merge')

module.exports = function() {
  return (next, target, plugin, cb) => {
    target.decorate = function(prop, method) {
      let extension = {}
      if (typeof prop === 'string') {
        extension[prop] = method
      } else if (typeof prop === 'object') {
        merge(extension, prop)
      } else {
        throw new Error('invalid arguments passed to decorate')
      }

      merge(this, extension)
      merge(this.root, extension)
    }

    next(target, plugin, cb)
  }
}
