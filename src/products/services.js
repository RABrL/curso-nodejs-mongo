const { ObjectId } = require('mongodb')
const { Database } = require('../database/index')
const { ProductsUtils } = require('./utils')

const COLLECTION = 'products'

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

const create = async (product) => {
  const collection = await Database(COLLECTION)
  const result = await collection.insertOne(product)
  return result.insertedId
}

const update = async (id, product) => {
  const collection = await Database(COLLECTION)
  const result = await collection.replaceOne({ _id: new ObjectId(id) }, product)
  return result.matchedCount
}

const deleteProduct = async (id) => {
  const collection = await Database(COLLECTION)
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount
}

const generateReport = async (res, name) => {
  const products = await getAll()
  ProductsUtils.excelGenerator(products, res, name)
}

module.exports.ProductsSerivice = {
  getAll,
  getById,
  create,
  generateReport,
  update,
  deleteProduct
}
