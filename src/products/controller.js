const debug = require('debug')('app:module-products-controller')
const { ProductsService } = require('./services')
const { Response } = require('../common/response')
const createError = require('http-errors')

module.exports.ProductsController = {
  getProducts: async (req, res) => {
    try {
      const products = await ProductsService.getAll()
      Response.success(res, 200, 'Lista de productos', products)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getProduct: async (req, res) => {
    try {
      const { params: { id } } = req
      const product = await ProductsService.getById(id)
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
      const insertedId = await ProductsService.create(body)
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
      const dataUpdate = {
        $set: {
          ...body
        }
      }
      const result = await ProductsService.update(id, dataUpdate)
      if (result === 0) return Response.error(res, new createError.NotFound())
      Response.success(res, 200, 'Producto actualizado')
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { params: { id } } = req
      const product = await ProductsService.getById(id)
      if (!product) return Response.error(res, new createError.NotFound())
      await ProductsService.deleteProduct(id)
      Response.success(res, 200, `Product ${product.name} eliminado con exito`)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  generateReport: (req, res) => {
    try {
      ProductsService.generateReport(res, 'inventario')
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  }
}
