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
      const { body: { name, email, age = null } } = req
      if (!name || !email) return Response.error(res, new createError.BadRequest())

      if (await UsersService.userAlreadyExist(email)) {
        return Response.error(res, new createError.Conflict(`Ya existe un usuario con el email ${email}`))
      }

      const insertedId = await UsersService.create({ name, email: email.toLowerCase(), age })
      Response.success(res, 201, `Usuario ${name} agregado`, insertedId)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  updateUser: async (req, res) => {
    try {
      const { params: { id }, body } = req
      const { name, email, age } = body

      if (!name && !email && !age) return Response.error(res, new createError.BadRequest())

      const user = await UsersService.getById(id)
      if (!user) return Response.error(res, new createError.NotFound())

      if (email && await UsersService.userAlreadyExist(email)) {
        return Response.error(res, new createError.Conflict(`Ya existe un usuario con el email ${email}`))
      }
      const dataUpdate = {
        $set: {
          name: name || user.name,
          email: email || user.email,
          age: age || user.age
        }
      }
      await UsersService.update(id, dataUpdate)
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
