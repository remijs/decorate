'use strict'
const merge = require('merge')

module.exports = function() {
  return (next, target, plugin, cb) => {
    function toExtension(prop, method) {
      if (typeof prop === 'string') {
        let extension = {}
        extension[prop] = method
        return extension
      }

      if (typeof prop === 'object') {
        return prop
      }

      throw new Error('invalid arguments passed to decorate')
    }

    target.decorate = function(prop, method) {
      let extension = toExtension(prop, method)

      merge(this, extension)
      merge(this.root, extension)
    }

    next(target, plugin, cb)
  }
}
