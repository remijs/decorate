'use strict'
const chai = require('chai')
const expect = chai.expect
const plugiator = require('plugiator')

const remi = require('remi')
const decorate = require('..')

describe('decorate', function() {
  let registrator
  let app

  beforeEach(function() {
    app = {}
    registrator = remi(app)
    registrator.hook(decorate())
  })

  it('should decorate with a single property', function() {
    let plugin1 = plugiator.anonymous((app, options, next) => {
      app.decorate('server', 'foo', 1)
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
      next()
    })
    let plugin2 = plugiator.anonymous((app, options, next) => {
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
      next()
    })

    let plugins = [
      {
        register: plugin1,
        options: {foo: 1},
      },
      {
        register: plugin2,
      },
    ]

    return registrator.register(plugins)
      .then(() => expect(app.foo).to.eq(1))
  })

  it('should decorate with with multiple properties', function() {
    let plugin1 = plugiator.anonymous((app, options, next) => {
      app.decorate('server', {
        foo: 1,
      })
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
      next()
    })
    let plugin2 = plugiator.anonymous((app, options, next) => {
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
      next()
    })

    let plugins = [
      {
        register: plugin1,
        options: {foo: 1},
      },
      {
        register: plugin2,
      },
    ]

    return registrator.register(plugins)
      .then(() => expect(app.foo).to.eq(1))
  })

  it('should share the decorated elements through register invocations', function() {
    let plugin = plugiator.anonymous((app, options, next) => {
      app.decorate('server', 'foo', 'bar')
      next()
    })

    return registrator
      .register(plugin)
      .then(() => {
        expect(app.foo).to.eq('bar')

        return registrator.register([plugiator.noop()])
      })
      .then(() => {
        expect(app.foo).to.eq('bar')
      })
  })

  it('should through error if invalid parameters passed', function(done) {
    let plugin = plugiator.anonymous((app, options, next) => {
      app.decorate('server', 111)
      next()
    })

    registrator.register(plugin)
      .catch(err => {
        expect(err).to.be.instanceOf(Error, 'invalid arguments passed to decorate')
        done()
      })
  })

  it('should through error if decoration type is not server', function(done) {
    let plugin = plugiator.anonymous((app, options, next) => {
      app.decorate(111)
      next()
    })

    registrator.register(plugin)
      .catch(err => {
        expect(err).to.be.instanceOf(Error, 'Only "server" type is supported')
        done()
      })
  })
})
