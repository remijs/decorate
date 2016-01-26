'use strict'
const chai = require('chai')
const expect = chai.expect
const plugiator = require('plugiator')

const Remi = require('remi')
const decorate = require('..')

describe('decorate', function() {
  let remi
  let app

  beforeEach(function() {
    app = {}
    remi = new Remi({
      extensions: [{ extension: decorate }],
    })
  })

  it('should decorate with a single property', function() {
    let plugin1 = plugiator.anonymous((app, options) => {
      app.decorate('server', 'foo', 1)
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
    })
    let plugin2 = plugiator.anonymous((app, options) => {
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
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

    return remi.register(app, plugins)
      .then(() => expect(app.foo).to.eq(1))
  })

  it('should decorate with with multiple properties', function() {
    let plugin1 = plugiator.anonymous((app, options) => {
      app.decorate('server', {
        foo: 1,
      })
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
    })
    let plugin2 = plugiator.anonymous((app, options) => {
      expect(app.foo).to.eq(1)
      expect(app.root.foo).to.eq(1)
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

    return remi.register(app, plugins)
      .then(() => expect(app.foo).to.eq(1))
  })

  it('should share the decorated elements through register invocations', function() {
    let plugin = plugiator.anonymous((app, options) => {
      app.decorate('server', 'foo', 'bar')
    })

    return remi
      .register(app, plugin)
      .then(() => {
        expect(app.foo).to.eq('bar')

        return remi.register(app, [plugiator.noop()])
      })
      .then(() => {
        expect(app.foo).to.eq('bar')
      })
  })

  it('should through error if invalid parameters passed', function(done) {
    let plugin = plugiator.anonymous((app, options) => {
      app.decorate('server', 111)
    })

    remi.register(app, plugin)
      .catch(err => {
        expect(err).to.be.instanceOf(Error)
        done()
      })
  })
})
