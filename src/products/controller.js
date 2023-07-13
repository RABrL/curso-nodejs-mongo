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
      const { body: { name, cost, stock } } = req
      if (!name || !cost || !stock) return Response.error(res, new createError.BadRequest())

      const nameCapitalize = name.charAt(0).toUpperCase() + name.slice(1)

      if (await ProductsService.productAlreadyExist(nameCapitalize)) {
        return Response.error(res, new createError.Conflict(`Ya existe un producto con el nombre ${nameCapitalize}`))
      }

      const insertedId = await ProductsService.create({ name: nameCapitalize, cost, stock })

      Response.success(res, 201, `Producto ${nameCapitalize} agregado con exito`, insertedId)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { params: { id }, body } = req
      const { name, cost, stock } = body
      if (!name && !cost && !stock) return Response.error(res, new createError.BadRequest())
      let nameCapitalize = name
      const product = await ProductsService.getById(id)
      if (!product) return Response.error(res, new createError.NotFound())

      if (name) {
        nameCapitalize = name.charAt(0).toUpperCase() + name.slice(1)
        if (await ProductsService.productAlreadyExist(nameCapitalize)) {
          return Response.error(res, new createError.Conflict(`Ya existe un producto con el nombre ${nameCapitalize}`))
        }
        body.name = nameCapitalize
      }
      const dataUpdate = {
        $set: {
          name: nameCapitalize || product.name,
          cost: cost || product.cost,
          stock: stock || product.stock
        }
      }
      await ProductsService.update(id, dataUpdate)
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
