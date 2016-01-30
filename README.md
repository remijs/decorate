# remi-decorate

A remi extension that adds the decorate method to the target

[![Dependency Status](https://david-dm.org/remijs/decorate/status.svg?style=flat)](https://david-dm.org/remijs/decorate)
[![Build Status](https://travis-ci.org/remijs/decorate.svg?branch=master)](https://travis-ci.org/remijs/decorate)
[![npm version](https://badge.fury.io/js/remi-decorate.svg)](http://badge.fury.io/js/remi-decorate)
[![Coverage Status](https://coveralls.io/repos/remijs/decorate/badge.svg?branch=master&service=github)](https://coveralls.io/github/remijs/decorate?branch=master)


## Installation

```
npm i remi-decorate
```


## Usage

Registering the extension

```js
const remi = require('remi')
const remiDecorate = require('remi-decorate')

let registrator = remi(remiDecorate())
```

Once the remi-decorate extension is registered, the remi plugins can decorate the target app

The `.decorate` method can be used to extend the app's API.

```js
function plugin(app, opts, next) {
  /* The app can be decorated by one property at once */
  app.decorate('server', 'foo', function() {
    console.log('foo');
  });

  /* or by several properties at once */
  app.decorate('server', {
    bar: 23,
    qax: 54
  });
  
  next()
}

plugin.attributes = {
  name: 'plugin',
}

// the decorations will be available in the other plugins
function plugin2(app, opts, next) {
  console.log(app.foo);
  console.log(app.bar);
  console.log(app.qax);
  
  next()
}

plugin2.attributes = {
  name: 'plugin2',
  dependencies: 'plugin',
}
```


## License

MIT
