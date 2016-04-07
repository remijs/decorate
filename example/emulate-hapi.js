const remi = require('remi')
const remiDecorate = require('..')

const app = {}
const registrator = remi(app)
registrator.hook(remiDecorate.emulateHapi())

registrator.register(require('./emulate-hapi-plugin'))
