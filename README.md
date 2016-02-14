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

let app = {}
let registrator = remi(app)
registrator.hook(remiDecorate())
```

Once the `remi-decorate` extension is registered, the remi plugins can decorate the target app.

The `.decorate` method can be used to extend the app's API.

``` js
function plugin(app, opts, next) {
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
function plugin2(app, opts, next) {
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


## License

MIT © [Zoltan Kochan](https://github.com/zkochan)
