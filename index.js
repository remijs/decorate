'use strict'
const merge = require('merge')

module.exports = () => {
  return (next, target, plugin, cb) => {
    target.decorate = function(prop, method) {
      if (typeof prop === 'object') {
        Object.keys(prop).forEach(key => this.decorate(key, prop[key]))
        return
      }

      if (typeof prop !== 'string') {
        throw new Error('invalid arguments passed to decorate')
      }

      if (this[prop]) {
        throw new Error('Server decoration already defined: ' + prop)
      }

      this[prop] = method
      this.root[prop] = method
    }

    next(target, plugin, cb)
  }
}
