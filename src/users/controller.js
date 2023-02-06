const debug = require('debug')('app:module-users-controller')
const { UsersService } = require('./services')
const { Response } = require('../common/response')
const createError = require('http-errors')

module.exports.UsersController = {
  getUsers: async (req, res) => {
    try {
      const users = await UsersService.getAll()
      Response.success(res, 200, 'Lista de usuarios', users)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getUser: async (req, res) => {
    try {
      const { params: { id } } = req
      const user = await UsersService.getById(id)
      if (!user) return Response.error(res, new createError.NotFound())
      Response.success(res, 200, `Usuario ${id}`, user)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  createUser: async (req, res) => {
    try {
      const { body } = req
      if (!body || Object.keys(body).length === 0) return Response.error(res, new createError.BadRequest())
      const insertedId = await UsersService.create(body)
      Response.success(res, 201, `Usuario ${body.name} agregado`, insertedId)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  updateUser: async (req, res) => {
    try {
      const { params: { id }, body } = req
      if (!body || Object.keys(body).length === 0) return Response.error(res, new createError.BadRequest())
      const dataUpdate = {
        $set: {
          ...body
        }
      }
      const result = await UsersService.update(id, dataUpdate)
      if (result === 0) return Response.error(res, new createError.NotFound())
      Response.success(res, 200, 'Usuario actualizado')
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { params: { id } } = req
      const user = await UsersService.getById(id)
      if (!user) return Response.error(res, new createError.NotFound())
      await UsersService.deleteUser(id)
      Response.success(res, 200, `Usuario ${user.name} eliminado con exito`)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  }
}
