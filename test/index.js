'use strict'
var describe = require('mocha').describe
var it = require('mocha').it
var beforeEach = require('mocha').beforeEach
var chai = require('chai')
var expect = chai.expect
var plugiator = require('plugiator')
var objectAssign = require('object-assign')

var remi = require('remi')
var decorate = require('..')

describe('decorate', function () {
  var registrator
  var app

  beforeEach(function () {
    app = {}
    registrator = remi(app)
    registrator.hook(decorate())
  })

  it('should decorate with a single property', function () {
    return registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          app.decorate('foo', 1)
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
        plugiator.anonymous(function (app, options, next) {
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
      ])
      .then(function () { expect(app.foo).to.eq(1) })
  })

  it('should decorate with multiple properties', function () {
    return registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          app.decorate({
            foo: 1,
          })
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
        plugiator.anonymous(function (app, options, next) {
          expect(app.foo).to.eq(1)
          expect(app.root.foo).to.eq(1)
          next()
        }),
      ])
      .then(function () { expect(app.foo).to.eq(1) })
  })

  it('should share the decorated elements through register invocations', function () {
    return registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          app.decorate('foo', 'bar')
          next()
        }),
      ])
      .then(function () {
        expect(app.foo).to.eq('bar')
        return registrator.register([plugiator.noop()])
      })
      .then(function () {
        expect(app.foo).to.eq('bar')
      })
  })

  it('should through error if invalid parameters passed', function (done) {
    registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          app.decorate(111)
          next()
        }),
      ])
      .catch(function (err) {
        expect(err).to.be.instanceOf(Error, 'invalid arguments passed to decorate')
        done()
      })
  })

  it('should decorate even if the target was changed by a different hook', function () {
    registrator.hook(function (next, target, opts, cb) {
      next(objectAssign({}, target), opts, cb)
    })

    return registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          app.decorate('foo', 1)
          expect(app.foo).to.eq(1)
          next()
        }),
      ])
      .then(function () { expect(app.foo).to.eq(1) })
  })

  it('should throw error when trying to rewrite an existing property', function (done) {
    registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          app.decorate('foo', 111)
          app.decorate('foo', 111)
          next()
        }),
      ])
      .catch(function (err) {
        expect(err).to.be.instanceOf(Error, 'Server decoration already defined: foo')
        done()
      })
  })
})

describe('decorate.emulateHapi', function () {
  var registrator
  var app

  beforeEach(function () {
    app = {}
    registrator = remi(app)
    registrator.hook(decorate.emulateHapi())
  })

  it('should through error if decoration type is not server and emulating hapi', function () {
    return registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          expect(function () { app.decorate('foo', 111) })
            .to.throw(Error, 'Only "server" type is supported')
          next()
        }),
      ])
  })

  it('should not through error if decoration type is server and emulating hapi', function () {
    return registrator
      .register([
        plugiator.anonymous(function (app, options, next) {
          app.decorate('server', 'foo', 111)
          expect(app.foo).to.eq(111)
          next()
        }),
      ])
  })
})
