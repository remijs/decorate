# remi-decorate

A remi extension that adds the decorate method to the target

[![Dependency Status](https://david-dm.org/remijs/remi-decorate/status.svg?style=flat)](https://david-dm.org/remijs/remi-decorate)
[![Build Status](https://travis-ci.org/remijs/remi-decorate.svg?branch=master)](https://travis-ci.org/remijs/remi-decorate)
[![npm version](https://badge.fury.io/js/remi-decorate.svg)](http://badge.fury.io/js/remi-decorate)
[![Coverage Status](https://coveralls.io/repos/remijs/remi-decorate/badge.svg?branch=master&service=github)](https://coveralls.io/github/remijs/remi-decorate?branch=master)


## Installation

``` sh
npm i remi-decorate
```


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


## License

MIT © [Zoltan Kochan](https://www.kochan.io)
