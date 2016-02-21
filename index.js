'use strict'
const merge = require('merge')

module.exports = () => {
  return (next, target, plugin, cb) => {
    function toExtension(prop, method) {
      if (typeof prop === 'string') {
        const extension = {}
        extension[prop] = method
        return extension
      }

      if (typeof prop === 'object') {
        return prop
      }

      throw new Error('invalid arguments passed to decorate')
    }

    target.decorate = function(prop, method) {
      const extension = toExtension(prop, method)

      merge(this, extension)
      merge(this.root, extension)
    }

    next(target, plugin, cb)
  }
}
