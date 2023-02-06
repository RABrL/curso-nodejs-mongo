const excelGenerator = (products, res, name) => {
  const xl = require('excel4node')

  products = products.map(product => {
    const id = product._id.toString()
    delete product._id
    return {
      id,
      ...product
    }
  })

  const wb = new xl.Workbook()
  const ws = wb.addWorksheet('inventario')
  for (let i = 1; i <= products.length; i++) {
    for (let j = 1; j <= Object.values(products[0]).length; j++) {
      const data = Object.values(products[i - 1])[j - 1]
      if (typeof data === 'string') {
        ws.cell(i, j).string(data)
      } else {
        ws.cell(i, j).number(data)
      }
    }
  }
  wb.write(`${name}.xlsx`, res)
}

module.exports.ProductsUtils = {
  excelGenerator
}
