if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev'
const express = require('express')
const app = express()
const compression = require('compression')
const cors = require('cors')
const routes = require('./routes/route')
require('./config/sequelize')
const { APP_NAME, PORT } = require('./config/constants')

require('events').EventEmitter.defaultMaxListeners = 0

app.use(cors())
app.use(compression()) // use compression
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', routes)

try {
  app.listen(PORT, () => console.log(`${APP_NAME} server is starting on ${PORT} port`))
} catch (error) {
  console.log('Failed to start server.')
}

(async () => {
  const { tbl_tiffin_detail_old, tbl_tiffins, tbl_cart_detail, tbl_tiffin_relation, tbl_cart, tbl_tiffin_category, tbl_tiffin_detail } = require('./models')
  const { Op } = require('sequelize')
  const allOrders = await tbl_cart.findAll()
  for (const ele of allOrders.map((ele) => ele.get({ plain: true }))) {
    const allOrdersDetail = await tbl_cart_detail.findAll({ where: { cart_id: ele.id, id: { [Op.gt]: 298 } } })
    if (allOrdersDetail.length) {
      for (const orderDetail of allOrdersDetail.map((ele) => ele.get({ plain: true }))) {
        if (orderDetail.tiffin_detail_id !== 0) {
          const oldItem = await tbl_tiffin_detail_old.findOne({ where: { id: orderDetail.tiffin_detail_id }, raw: true })
          const newItem = await tbl_tiffin_detail.findOne({ where: { name: oldItem.name }, raw: true })
          const allRelation = await tbl_tiffin_relation.findOne({ where: { tiffin_id: ele.tiffin_id, category_id: oldItem.category_id, tiffin_detail_id: newItem.id }, raw: true })
          if (!allRelation) {
            console.log({ allRelation })
            const relation = await tbl_tiffin_relation.create({ tiffin_id: ele.tiffin_id, category_id: oldItem.category_id, tiffin_detail_id: newItem.id })
            const x = await tbl_cart_detail.findOne({ where: { id: orderDetail.id } })
            const update = await x.update({ tiffin_detail_id: relation.getDataValue('id') })
            console.log({ update })
          } else {
            const x = await tbl_cart_detail.findOne({ where: { id: orderDetail.id } })
            const update = await x.update({ tiffin_detail_id: allRelation.id })
            console.log({ update })
          }
        }
      }
    }
  }
})()
