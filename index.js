const express = require('express')
const debug = require('debug')('app:main')

const { Config } = require('./src/config/index')
const { ProductsAPI } = require('./src/products')
const { SalesAPI } = require('./src/sales')
const { UsersAPI } = require('./src/users')
const { IndexAPI, NotFoundAPI } = require('./src/index/index')

const app = express()
app.use(express.json())

IndexAPI(app)
ProductsAPI(app)
UsersAPI(app)
SalesAPI(app)
NotFoundAPI(app)

// modulos

app.listen(Config.port, () => {
  debug(`Servidor levantado en http://localhost:${Config.port}`)
})
