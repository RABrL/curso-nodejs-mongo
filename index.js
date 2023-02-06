const express = require('express')
const debug = require('debug')('app:main')

const { Config } = require('./src/config/index')
const { ProductsAPI } = require('./src/products')
const { SalesAPI } = require('./src/sales')
const { UsersAPI } = require('./src/users')

const app = express()

app.use(express.json())

ProductsAPI(app)
UsersAPI(app)
SalesAPI(app)

// modulos

app.listen(Config.port, () => {
  debug(`Servidor escuchando en el puerto ${Config.port}`)
})
