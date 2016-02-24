'use strict'
module.exports = opts => {
  opts = opts || {}
  const emulateHapi = opts.emulateHapi === true

  return (next, target, plugin, cb) => {
    function decorate(target, prop, method) {
      if (typeof prop === 'object') {
        Object.keys(prop).forEach(key => decorate(target, key, prop[key]))
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

    target.decorate = function() {
      if (!emulateHapi) return decorate(this, arguments[0], arguments[1])

      if (arguments[0] !== 'server') {
        throw new Error('Only "server" type is supported')
      }

      return decorate(this, arguments[1], arguments[2])
    }

    next(target, plugin, cb)
  }
}
