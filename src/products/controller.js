const debug = require('debug')('app:module-products-controller')
const { ProductsSerivice } = require('./services')
const { Response } = require('../common/response')
const createError = require('http-errors')

module.exports.ProductsController = {
  getProducts: async (req, res) => {
    try {
      const products = await ProductsSerivice.getAll()
      Response.success(res, 200, 'Lista de productos', products)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getProduct: async (req, res) => {
    try {
      const { params: { id } } = req
      const product = await ProductsSerivice.getById(id)
      if (!product) return Response.error(res, new createError.NotFound())
      Response.success(res, 200, `Producto ${id}`, product)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  createProduct: async (req, res) => {
    try {
      const { body } = req
      if (!body || Object.keys(body).length === 0) return Response.error(res, new createError.BadRequest())
      const insertedId = await ProductsSerivice.create(body)
      Response.success(res, 201, `Producto ${body.name} agregado `, insertedId)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { params: { id }, body } = req
      if (!body || Object.keys(body).length === 0) return Response.error(res, new createError.BadRequest())
      const result = await ProductsSerivice.update(id, body)
      if (result === 0) return Response.error(res, new createError.NotFound())
      Response.success(res, 200, `Producto ${body.name} actualizado`)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { params: { id } } = req
      const result = await ProductsSerivice.deleteProduct(id)
      if (result === 1) return Response.success(res, 200, `Product ${id} eliminado con exito`)
      Response.error(res, new createError.NotFound())
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  generateReport: (req, res) => {
    try {
      ProductsSerivice.generateReport(res, 'inventario')
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  }
}
