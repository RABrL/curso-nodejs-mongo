const { MongoClient } = require('mongodb')
const debug = require('debug')('app:module-database')
const { Config } = require('../config/index')

let connection = null

module.exports.Database = (collection) => new Promise(async (resolve, reject) => {
  try {
    // singelton
    if (!connection) {
      const client = new MongoClient(Config.mongoUri)
      connection = await client.connect()
      debug('Nueva conexion realizada con mongo atlas')
    }
    debug('Reutilizando conexion')
    const db = connection.db(Config.mongoDbname)
    resolve(db.collection(collection))
  } catch (err) {
    reject(err)
  }
})
