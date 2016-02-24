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
    return registrator
      .register([
        plugiator.anonymous((app, options, next) => {
          app.decorate('foo', 1)
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
        plugiator.anonymous((app, options, next) => {
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
      ])
      .then(() => expect(app.foo).to.eq(1))
  })

  it('should decorate with multiple properties', function() {
    return registrator
      .register([
        plugiator.anonymous((app, options, next) => {
          app.decorate({
            foo: 1,
          })
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
        plugiator.anonymous((app, options, next) => {
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
      ])
      .then(() => expect(app.foo).to.eq(1))
  })

  it('should share the decorated elements through register invocations', function() {
    return registrator
      .register([
        plugiator.anonymous((app, options, next) => {
          app.decorate('foo', 'bar')
          next()
        }),
      ])
      .then(() => {
        expect(app.foo).to.eq('bar')
        return registrator.register([plugiator.noop()])
      })
      .then(() => {
        expect(app.foo).to.eq('bar')
      })
  })

  it('should through error if invalid parameters passed', function(done) {
    registrator
      .register([
        plugiator.anonymous((app, options, next) => {
          app.decorate(111)
          next()
        }),
      ])
      .catch(err => {
        expect(err).to.be.instanceOf(Error, 'invalid arguments passed to decorate')
        done()
      })
  })

  it('should through error if decoration type is not server', function() {
    app = {}
    registrator = remi(app)
    registrator.hook(decorate({
      emulateHapi: true,
    }))

    return registrator
      .register([
        plugiator.anonymous((app, options, next) => {
          expect(() => app.decorate('foo', 111))
            .to.throw(Error, 'Only "server" type is supported')
          next()
        }),
      ])
  })

  it('should decorate even if the target was changed by a different hook', function() {
    registrator.hook((next, target, opts, cb) => {
      next(Object.assign({}, target), opts, cb)
    })

    return registrator
      .register([
        plugiator.anonymous((app, options, next) => {
          app.decorate('foo', 1)
          expect(app.foo).to.eq(1)
          next()
        }),
      ])
      .then(() => expect(app.foo).to.eq(1))
  })

  it('should throw error when trying to rewrite an existing property', function(done) {
    registrator
      .register([
        plugiator.anonymous((app, options, next) => {
          app.decorate('foo', 111)
          app.decorate('foo', 111)
          next()
        }),
      ])
      .catch(err => {
        expect(err).to.be.instanceOf(Error, 'Server decoration already defined: foo')
        done()
      })
  })
})
