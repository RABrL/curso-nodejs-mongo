const { ObjectId } = require('mongodb')
const { Database } = require('../database/index')

const COLLECTION = 'users'

/**
 *
 * @returns return one array of objects
 */
const getAll = async () => {
  const collection = await Database(COLLECTION)
  return await collection.find({}).toArray()
}

const getById = async (id) => {
  const collection = await Database(COLLECTION)
  return await collection.findOne({ _id: new ObjectId(id) })
}

const create = async (user) => {
  const collection = await Database(COLLECTION)
  const result = await collection.insertOne(user)
  return result.insertedId
}

const update = async (id, dataUpdate) => {
  const collection = await Database(COLLECTION)
  const result = await collection.updateOne({ _id: new ObjectId(id) }, dataUpdate)
  return result.matchedCount
}

const deleteUser = async (id) => {
  const collection = await Database(COLLECTION)
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount
}

module.exports.UsersService = {
  getAll,
  getById,
  create,
  update,
  deleteUser
}
