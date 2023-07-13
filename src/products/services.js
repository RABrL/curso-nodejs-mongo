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

const update = async (id, dataUpdate) => {
  const collection = await Database(COLLECTION)
  const result = await collection.updateOne({ _id: new ObjectId(id) }, dataUpdate)
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

const productAlreadyExist = async (name) => {
  const nameCapitalize = name.charAt(0).toUpperCase() + name.slice(1)
  const products = await getAll()
  return products.find(product => product.name === nameCapitalize)
}

module.exports.ProductsService = {
  getAll,
  getById,
  create,
  generateReport,
  update,
  deleteProduct,
  productAlreadyExist
}
