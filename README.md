<!--@'# ' + package.name-->
# remi-decorate
<!--/@-->

<!--@package.description-->
A remi extension that adds the decorate method to the target
<!--/@-->

<!--@shields.flatSquare('deps', 'travis', 'coveralls', 'npm')-->
[![Dependency status](https://img.shields.io/david/remijs/remi-decorate.svg?style=flat-square)](https://david-dm.org/remijs/remi-decorate)
[![Build status](https://img.shields.io/travis/remijs/remi-decorate.svg?style=flat-square)](https://travis-ci.org/remijs/remi-decorate)
[![Test coverage](https://img.shields.io/coveralls/remijs/remi-decorate.svg?style=flat-square)](https://coveralls.io/r/remijs/remi-decorate?branch=master)
[![NPM version](https://img.shields.io/npm/v/remi-decorate.svg?style=flat-square)](https://www.npmjs.com/package/remi-decorate)
<!--/@-->

<!--@installation()-->
## Installation

This module is installed via npm:

``` sh
npm install remi-decorate --save
```
<!--/@-->


## Usage

Registering the extension

```js
const remi = require('remi')
const remiDecorate = require('remi-decorate')

const app = {}
const registrator = remi(app)
registrator.hook(remiDecorate())
```

Once the `remi-decorate` extension is registered, the remi plugins can decorate the target app.

The `.decorate` method can be used to extend the app's API.

``` js
function plugin (app, opts, next) {
  // The app can be decorated by one property at once
  app.decorate('sayHello', () => console.log('Hello world!'));

  // or by several properties at once
  app.decorate({
    uaCapital: 'Kyiv',
    uaTimezone: 'EET',
  });

  next()
}

plugin.attributes = {
  name: 'plugin',
}

// the decorations will be available in the other plugins
function plugin2 (app, opts, next) {
  app.sayHello()
  //> Hello world!

  console.log(app.uaCapital)
  //> Kyiv

  console.log(app.uaTimezone)
  //> EET

  next()
}

plugin2.attributes = {
  name: 'plugin2',
  dependencies: 'plugin',
}
```


### `decorate.emulateHapi(type, prop, method)`

Hapi's server has a similar decorate function but it expects a `type` parameter
which has to be the first. `decorate.emulate` allows to extend remi with a hapi alike decorate function that supports server decoration:

```js
const remi = require('remi')
const remiDecorate = require('remi-decorate')

const app = {}
const registrator = remi(app)
registrator.hook(remiDecorate.emulateHapi())


// plugin
module.exports = (plugin, opts, next) => {
  plugin.decorate('server', 'foo', 'bar')

  console.log(plugin.foo)
  //> bar

  // this will throw an exception because the first parameter is not 'server'
  plugin.decorate('foo', 'bar')

  next()
}
```

Emulating hapi might be useful when developing some modules that want to reuse plugins that were developed for hapi.


<!--@license()-->
## License

MIT © [Zoltan Kochan](http://kochan.io)
<!--/@-->

***

<!--@devDependencies()-->
## Dev Dependencies

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [istanbul](https://github.com/gotwarlost/istanbul): Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. Supports all JS coverage use cases including unit tests, server side functional tests
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mos](https://github.com/zkochan/mos): A pluggable module that injects content into your markdown files via hidden JavaScript snippets
- [plugiator](https://github.com/zkochan/plugiator): hapi plugins creator
- [remi](https://github.com/remijs/remi): A plugin registrator.

<!--/@-->
