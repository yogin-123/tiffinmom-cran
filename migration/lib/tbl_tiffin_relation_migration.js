const con = require('../../config/database')

module.exports = {
  migration1: async function () {
    con.query('SELECT * FROM tbl_tiffin_detail group by name, price', async (err, results) => {
      if (err) console.log(err)
      else {
        for await (const result of results) {
          con.query(`SELECT * FROM tbl_tiffin_detail WHERE name = '${result.name}' and price = ${result.price}`, async (err1, results1) => {
            if (results1) {
              for await (const result1 of results1) {
                const insertQuery = {
                  tiffin_id: result1.tiffin_id,
                  category_id: result1.category_id,
                  tiffin_detail_id: result.id,
                  created_at: new Date().getTime(),
                  updated_at: new Date().getTime()
                }
                con.query('INSERT INTO tbl_tiffin_relation SET ?', insertQuery, (insertErr, insertResult) => {
                  console.log({ insertErr, insertResult })
                })
                //   con.query(`DELETE FROM tbl_tiffin_detail WHERE name = '${result.name}' and price = ${result.price} and id != ${result.id}`, (deleteErr, deleteResult) => {
                //     console.log({ deleteErr, deleteResult })
                //   })
              }
            }
          })
        }
      }
    })
  },
  migrtaionUsingSequelizeForTiffins: async () => {
    const { tbl_tiffin_detail_old, tbl_tiffins, tbl_order_tiffin_detail, tbl_tiffin_relation, tbl_order_detail, tbl_tiffin_category, tbl_tiffin_detail } = require('./models')
    const oldItems = await tbl_tiffin_detail_old.findAll({ group: ['name', 'price'] })
    if (oldItems.length) {
      for (const oldItem of oldItems.map((ele) => ele.get({ plain: true }))) {
        let items = await tbl_tiffin_detail_old.findAll({ where: { name: oldItem.name, price: oldItem.price } })
        items = items.map((ele) => ele.get({ plain: true }))
        for (const item of items) {
          if (item.id !== oldItem.id) {
            await tbl_tiffin_detail.destroy({ where: { id: item.id } })
            console.log({ id: item.id }, oldItem.id)
          }
          console.log({ tiffin_id: item.tiffin_id, category_id: item.category_id, tiffin_detail_id: oldItem.id })
          await tbl_tiffin_relation.create({ tiffin_id: item.tiffin_id, category_id: item.category_id, tiffin_detail_id: oldItem.id })
        }
      }
    }
    // const allOrders = await tbl_order_detail.findAll()
    // allOrders.map((ele) => ele.get({ plain: true })).forEach(async (ele) => {
    //   const allOrdersDetail = await tbl_order_tiffin_detail.findAll({ where: { order_id: ele.id } })
    //   if (allOrdersDetail.length) {
    //     for (const orderDetail of allOrdersDetail.map((ele) => ele.get({ plain: true }))) {
    //       const oldItem = await tbl_tiffin_detail_old.findOne({ where: { id: orderDetail.category_id }, raw: true })
    //       const newItem = await tbl_tiffin_detail.findOne({ where: { name: oldItem.name }, raw: true })
    //       if (!newItem) console.log({ oldItem })
    //       // const allRelation = await tbl_tiffin_relation.findAll({ where: { tiffin_id: ele.tiffin_id, category_id: oldItem.category_id, tiffin_detail_id: newItem ? newItem.id :  } })
    //       // console.log(allRelation.map((ele) => ele.get({ plain: true })))
    //     }
    //   }
    // })
  },
  migrationForSeqyelizeForOrders: async () => {
    const { tbl_tiffin_detail_old, tbl_tiffins, tbl_order_tiffin_detail, tbl_tiffin_relation, tbl_order_detail, tbl_tiffin_category, tbl_tiffin_detail } = require('./models')
    const allOrders = await tbl_order_detail.findAll()
    allOrders.map((ele) => ele.get({ plain: true })).forEach(async (ele) => {
      const allOrdersDetail = await tbl_order_tiffin_detail.findAll({ where: { order_id: ele.id } })
      if (allOrdersDetail.length) {
        for (const orderDetail of allOrdersDetail.map((ele) => ele.get({ plain: true }))) {
          const oldItem = await tbl_tiffin_detail_old.findOne({ where: { id: orderDetail.category_id }, raw: true })
          const newItem = await tbl_tiffin_detail.findOne({ where: { name: oldItem.name }, raw: true })
          // if (!newItem) console.log({ oldItem })
          // else console.log(oldItem)
          const allRelation = await tbl_tiffin_relation.findOne({ where: { tiffin_id: ele.tiffin_id, category_id: oldItem.category_id, tiffin_detail_id: newItem.id }, raw: true })

          await tbl_order_tiffin_detail.update({ category_id: allRelation.id }, { where: { id: orderDetail.id } })

          // if (!allRelation.length) {
          //   await tbl_tiffin_relation.create({ tiffin_id: ele.tiffin_id, category_id: oldItem.category_id, tiffin_detail_id: newItem.id })
          // }

          // if (allRelation.length > 1) {
          //   console.log(allRelation)
          //   allRelation.forEach(async (elem, index) => {
          //     if (index !== 0) {
          //       await tbl_tiffin_relation.destroy({ where: { id: elem.id } })
          //     }
          //   })
          // } else console.log('jalsa karo')
        }
      }
    })
  },
  migrationForSequelizeForCart: async () => {
    const { tbl_tiffin_detail_old, tbl_tiffins, tbl_cart_detail, tbl_tiffin_relation, tbl_cart, tbl_tiffin_category, tbl_tiffin_detail } = require('./models')
    const allOrders = await tbl_cart.findAll()
    for (const ele of allOrders.map((ele) => ele.get({ plain: true }))) {
      const allOrdersDetail = await tbl_cart_detail.findAll({ where: { cart_id: ele.id } })
      if (allOrdersDetail.length) {
        for (const orderDetail of allOrdersDetail.map((ele) => ele.get({ plain: true }))) {
          if (orderDetail.tiffin_detail_id !== 0) {
            const oldItem = await tbl_tiffin_detail_old.findOne({ where: { id: orderDetail.tiffin_detail_id }, raw: true })
            const newItem = await tbl_tiffin_detail.findOne({ where: { name: oldItem.name }, raw: true })
            const allRelation = await tbl_tiffin_relation.findOne({ where: { tiffin_id: ele.tiffin_id, category_id: oldItem.category_id, tiffin_detail_id: newItem.id }, raw: true })
            // if (!allRelation.length) {
            //   const x = await tbl_tiffin_relation.create({ tiffin_id: ele.tiffin_id, category_id: oldItem.category_id, tiffin_detail_id: newItem.id })
            //   console.log({ x })
            // }

            // if (allRelation.length > 1) {
            //   allRelation.forEach(async (elem, index) => {
            //     if (index !== 0) {
            //       await tbl_tiffin_relation.destroy({ where: { id: elem.id } })
            //     }
            //   })
            // } else console.log('jalsa karo')
            // console.log({ allRelation })
            const x = await tbl_cart_detail.findOne({ where: { id: orderDetail.id } })
            const update = await x.update({ tiffin_detail_id: allRelation.id })
            console.log({ update })
          }
        }
      }
    }
  }
}
