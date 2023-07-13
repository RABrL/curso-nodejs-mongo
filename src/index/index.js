const express = require('express')
const createError = require('http-errors')
const { Response } = require('../common/response')

module.export.IndexAPI = (app) => {
  const router = express.Router()

  router.get('/', (res, req) => {
    const menu = {
      products: `https://${req.headers.host}/api/products`,
      sales: `https://${req.headers.host}/api/sales`,
      users: `https://${req.headers.host}/api/users`
    }

    Response.success(res, 200, 'API Inventario', menu)
  })

  app.use('/', router)
}

module.export.NotFoundAPI = (app) => {
  const router = express.Router()

  router.all('*', (req, res) => {
    Response.error(res, new createError.NotFound())
  })

  app.use('/', router)
}
