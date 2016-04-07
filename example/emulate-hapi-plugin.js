// plugin
module.exports = (plugin, opts, next) => {
  plugin.decorate('server', 'foo', 'bar')

  console.log(plugin.foo)

  // this will throw an exception because the first parameter is not 'server'
  plugin.decorate('foo', 'bar')

  next()
}
