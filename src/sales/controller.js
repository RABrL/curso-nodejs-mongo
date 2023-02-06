const debug = require('debug')('app:module-sales-controller')
const { SalesService } = require('./services')
const { ProductsService } = require('../products/services')
const { UsersService } = require('../users/services')
const { Response } = require('../common/response')
const createError = require('http-errors')

module.exports.SalesController = {
  getSales: async (req, res) => {
    try {
      const sales = await SalesService.getAll()
      Response.success(res, 200, 'Lista de ventas', sales)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getSale: async (req, res) => {
    try {
      const { params: { id } } = req
      const sale = await SalesService.getById(id)
      if (!sale) return Response.error(res, new createError.NotFound())
      Response.success(res, 200, `Venta ${id}`, sale)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  createSale: async (req, res) => {
    try {
      const { body: { user: username, product: productName, amount } } = req
      if (!username || !productName || !amount) return Response.error(res, new createError.BadRequest())

      // Si el usuario no existe
      const users = await UsersService.getAll()
      const userExist = users.filter(user => user.name === username)[0]
      if (!userExist) return Response.error(res, new createError.NotFound(`El usuario '${username}' no esta registrado`))

      // si el producto a vender no existe
      const products = await ProductsService.getAll()
      const productExist = products.filter(product => product.name === productName)[0]
      if (!productExist) return Response.error(res, new createError.Conflict(`El producto '${productName}' no existe`))

      // si no hay la cantidad suficiente
      if (productExist.stock < amount) return Response.error(res, new createError.NotFound(`Solo hay ${productExist.stock} ${productName} en el inventario`))

      // si todo sale bien
      const dataUpdate = {
        $set: {
          stock: productExist.stock - amount
        }
      }
      ProductsService.update(productExist._id, dataUpdate)
      const result = await SalesService.create({ user: username, product: productName, productId: productExist._id, amount, cost: productExist.cost * amount })
      Response.success(res, 201, `Venta ${result._id} creada`, result)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  updateSale: async (req, res) => {
    try {
      const { params: { id }, body: { product: productName, amount } } = req
      if (!productName || !amount) return Response.error(res, new createError.BadRequest())

      const products = await ProductsService.getAll()
      const product = products.filter(product => product.name === productName)[0]
      if (!product) return Response.error(res, new createError.Conflict(`El producto '${productName}' no existe`))

      // si el producto es el mismo
      const sale = await SalesService.getById(id)
      if (sale.product === productName) {
        if (sale.amount < amount) {
          // si no hay la cantidad suficiente
          if (product.stock < amount - sale.amount) return Response.error(res, new createError.NotFound(`Solo hay ${product.stock} ${productName} en el inventario`))
          const productUpdate = {
            $set: {
              stock: product.stock - (amount - sale.amount)
            }
          }
          await ProductsService.update(product._id, productUpdate)
        } else {
          const productUpdate = {
            $set: {
              stock: product.stock + (sale.amount - amount)
            }
          }
          await ProductsService.update(product._id, productUpdate)
        }
        const saleUpdate = {
          $set: {
            amount,
            cost: amount * product.cost
          }
        }
        await SalesService.update(id, saleUpdate)
        return Response.success(res, 201, `Venta ${id} actualizada`)
      }

      // Si el producto es diferente

      // si no hay la cantidad suficiente
      if (product.stock < amount) return Response.error(res, new createError.NotFound(`Solo hay ${product.stock} ${productName} en el inventario`))

      // Actualizo el stock del producto anterior
      const productOld = await ProductsService.getById(sale.productId)
      const productOldUpdate = {
        $set: {
          stock: productOld.stock + sale.amount
        }
      }
      await ProductsService.update(productOld._id, productOldUpdate)

      // Actualizo el stock del producto a cambiar
      const productUpdate = {
        $set: {
          stock: product.stock - amount
        }
      }
      await ProductsService.update(product._id, productUpdate)

      // Actualizo la venta
      const saleUpdate = {
        $set: {
          product: productName,
          productId: product._id,
          amount,
          cost: amount * product.cost
        }
      }
      await SalesService.update(id, saleUpdate)
      Response.success(res, 200, `Venta ${id} actualizada`)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  deleteSale: async (req, res) => {
    try {
      const { params: { id } } = req
      const sale = await SalesService.getById(id)
      if (!sale) return Response.error(res, new createError.NotFound())
      await SalesService.deleteSale(id)
      Response.success(res, 200, `Venta ${sale._id} eliminada con exito`)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  }
}
