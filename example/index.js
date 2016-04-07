const remi = require('remi')
const remiDecorate = require('..')

const app = {}
const registrator = remi(app)
//! Registering the extension
registrator.hook(remiDecorate())

/*! Once the `remi-decorate` extension is registered, the remi plugins can decorate the target app.

The `.decorate` method can be used to extend the app's API.*/

function plugin (app, opts, next) {
  // The app can be decorated by one property at once
  app.decorate('sayHello', () => 'Hello world!');

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
  console.log(app.sayHello())

  console.log(app.uaCapital)

  console.log(app.uaTimezone)

  next()
}

plugin2.attributes = {
  name: 'plugin2',
  dependencies: 'plugin',
}

registrator.register([plugin, plugin2])
