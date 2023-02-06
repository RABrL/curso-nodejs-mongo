const { ObjectId } = require('mongodb')
const { Database } = require('../database/index')

const COLLECTION = 'sales'

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

const create = async (sale) => {
  const collection = await Database(COLLECTION)
  const result = await collection.insertOne(sale)
  return {
    _id: result.insertedId,
    ...sale
  }
}

const update = async (id, dataUpdate) => {
  const collection = await Database(COLLECTION)
  const result = await collection.updateOne({ _id: new ObjectId(id) }, dataUpdate)
  return result.matchedCount
}

const deleteSale = async (id) => {
  const collection = await Database(COLLECTION)
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount
}

module.exports.SalesService = {
  getAll,
  getById,
  create,
  update,
  deleteSale
}
