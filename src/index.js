if (process.env['NODE_ENV'] !== 'production') {
    require('babel-register')
    require('../src/app.js')
} else
    require('../lib/app.js')