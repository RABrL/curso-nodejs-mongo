const express = require('express')
const { SalesController } = require('./controller')
const router = express.Router()

module.exports.SalesAPI = (app) => {
  router
    .get('/', SalesController.getSales) // http://localhost:3000/api/products/
    .get('/:id', SalesController.getSale) // http://localhost:3000/api/products/23
    .post('/', SalesController.createSale)
    .put('/:id', SalesController.updateSale)
    .delete('/:id', SalesController.deleteSale)

  app.use('/api/sales', router)
}
