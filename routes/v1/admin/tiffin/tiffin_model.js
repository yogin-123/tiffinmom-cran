/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
const con = require('../../../../config/database')
const { PER_PAGE, S3_URL, TIFFIN_IMAGE } = require('../../../../config/constants')
const moment = require('moment')
const { totalCount } = require('../../../../config/common')
const asyncLoop = require('node-async-loop')
const sequelize = require('../../../../config/sequelize')
const { Op } = require('sequelize')
const { tbl_tiffin_category, tbl_tiffin_detail, tbl_tiffin_relation, tbl_tiffins } = require('../../../../models')

module.exports = {
  add_tiffin(params) {
    return new Promise((resolve, reject) => {
      const insertData = {
        state_id: params.state_id,
        image: params.image,
        title: params.title,
        delivery_on: params.delivery_on,
        price: params.price,
        description: params.description,
        insert_datetime: moment().format('X')
      }
      con.query('INSERT INTO tbl_tiffins SET ?', insertData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  edit_tiffin(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        state_id: params.state_id,
        title: params.title,
        delivery_on: params.delivery_on,
        price: params.price,
        description: params.description,
        update_datetime: moment().format('X')
      }
      if (params.image) {
        updateData.image = params.image
      }
      con.query(`UPDATE tbl_tiffins SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  change_tiffin_status(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        is_active: params.status,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE tbl_tiffins SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  tiffin_list(params) {
    return new Promise((resolve, reject) => {
      let where = ''
      let order_by = ''
      if (params.search) {
        where += `AND t.name LIKE '%${params.search}%'`
      }
      if (params.sort_by_column && params.sort_by_order) {
        order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`
      } else {
        order_by = 'ORDER BY t.id DESC'
      }
      let limit = ''
      if (!['-1', -1].includes(params.page)) {
        limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`
      }
      con.query(`SELECT t.*,CONCAT('${S3_URL + TIFFIN_IMAGE}',t.image) AS image,s.name AS state_name FROM tbl_tiffins AS t JOIN tbl_state AS s ON s.id = t.state_id WHERE t.is_active != 'Delete' ${where} ${order_by} ${limit}`, (error, result) => {
        if (!error && result[0]) {
          totalCount('tbl_tiffin', (count) => {
            resolve({
              page: parseInt(params.page) + 1,
              count: (count - 1),
              result
            })
          })
        } else {
          reject()
        }
      })
    })
  },
  add_tiffin_category(params) {
    try {
      return new Promise(async (resolve, reject) => {
        asyncLoop(params.categorys, async (item, next) => {
          const [resCat, metaData] = await sequelize.query(`select * from tbl_tiffin_category where name = '${item.name}' and is_active != 'Delete'`)
          if (resCat.length) return reject('Already Exists')
          const insertBulkData = [params.login_user_id, item.name, item.quantity, 'Active', moment().format('X'), item.position]
          const [insertResult, insertMetaData] = await sequelize.query('INSERT INTO tbl_tiffin_category(user_id,name,quantity,is_active,insert_datetime,position) values (?)', { replacements: [insertBulkData], type: sequelize.QueryTypes.INSERT })
          if (insertResult) {
            if (item?.items_id.length && item?.tiffin_id.length) {
              asyncLoop(item.tiffin_id, (tiffinId, tiffinNext) => {
                asyncLoop(item.items_id, async (itemsId, itemsNext) => {
                  const insertRelationBulkData = [tiffinId, insertResult, itemsId.id, new Date().getTime(), new Date().getTime(), itemsId.position]
                  const [insertResultRelation, insertResultMetaData] = await sequelize.query('INSERT INTO tbl_tiffin_relation(tiffin_id, category_id, tiffin_detail_id, created_at, updated_at, position) values (?)', { replacements: [insertRelationBulkData], type: sequelize.QueryTypes.INSERT })
                  itemsNext()
                })
                tiffinNext()
              })
            } else {
              if (item?.tiffin_id.length) {
                asyncLoop(item.tiffin_id, async (tiffinId, tiffinNext) => {
                  const insertRelationBulkData = [tiffinId, insertResult, null, new Date().getTime(), new Date().getTime(), null]
                  const [insertResultRelation, insertResultMetaData] = await sequelize.query('INSERT INTO tbl_tiffin_relation(tiffin_id, category_id, tiffin_detail_id, created_at, updated_at, position) values (?)', { replacements: [insertRelationBulkData], type: sequelize.QueryTypes.INSERT })

                  tiffinNext()
                })
              }
              if (item?.items_id.length) {
                asyncLoop(params.items_id, async (itemsId, itemsNext) => {
                  const insertRelationBulkData = [null, insertResult, itemsId.id, new Date().getTime(), new Date().getTime(), itemsId.position]
                  const [insertResultRelation, insertResultMetaData] = await sequelize.query('INSERT INTO tbl_tiffin_relation(tiffin_id, category_id, tiffin_detail_id, created_at, updated_at, position) values (?)', { replacements: [insertRelationBulkData], type: sequelize.QueryTypes.INSERT })
                  itemsNext()
                })
              }
            }
          } else return reject()
          next()
        }, (err) => {
          console.log({ err })
          if (err) reject()
          resolve()
        })
      })
    } catch (error) {
      return error
    }
  },
  edit_tiffin_category(params) {
    return new Promise(async (resolve, reject) => {
      const updateData = {
        name: params.name,
        price: params.price,
        update_datetime: moment().format('X')
      }
      const check = await tbl_tiffin_category.findOne({ where: { name: params.name, id: { [Op.ne]: params.id }, is_active: { [Op.ne]: 'Delete' } }, raw: true })
      if (check) return reject('Already exists')
      await tbl_tiffin_category.update(updateData, { where: { id: params.id } })
      tbl_tiffin_relation.destroy({ where: { category_id: params.id } }).then(async () => {
        if (params.tiffin_id?.length && params.items_id?.length) {
          for (const tiffin of params.tiffin_id) {
            for (const items of params.items_id) {
              const insertQuery = {
                category_id: params.id,
                tiffin_id: tiffin,
                tiffin_detail_id: items.id,
                position: items.position,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime()
              }
              await tbl_tiffin_relation.create(insertQuery)
            }
          }
        } else {
          if (params.tiffin_id?.length) {
            for (const tiffin of params.tiffin_id) {
              const insertQuery = {
                category_id: params.id,
                tiffin_id: tiffin,
                tiffin_detail_id: null,
                position: null,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime()
              }
              await tbl_tiffin_relation.create(insertQuery)
            }
          }
          if (params.items_id?.length) {
            for (const item of params.items_id) {
              const insertQuery = {
                category_id: params.id,
                tiffin_id: null,
                items_id: item.id,
                position: item.position,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime()
              }
              await tbl_tiffin_relation.create(insertQuery)
            }
          }
        }
      })
      resolve()
    })
  },
  change_tiffin_category_status(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        is_active: params.status,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE tbl_tiffin_category SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  async tiffin_category_list(params) {
    const query = {}
    const order = []
    let where = ''
    let order_by
    if (params.search) {
      Object.assign(query, { name: { [Op.iLike]: `%${params.search}%` } })
      where += `AND name LIKE '%${params.search}%'`
    }
    if (params.sort_by_column && params.sort_by_order) {
      order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`
      order.push([params.sort_by_column, params.sort_by_order])
    } else {
      order_by = 'ORDER BY id DESC'
      order.push(['id', 'DESC'])
    }
    let limit = ''
    if (!['-1', -1].includes(params.page)) {
      limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`
    }

    const result = await sequelize.query(`SELECT * FROM tbl_tiffin_category WHERE is_active != 'Delete' ${where} ${order_by} ${limit}`, { type: sequelize.QueryTypes.SELECT })
    for await (const category of result) {
      const items = await sequelize.query(`SELECT ttd.id, ttd.name, ttd.price, ttd.is_active, ttr.position FROM tbl_tiffin_relation ttr inner join tbl_tiffin_detail ttd on ttd.id = tiffin_detail_id where ttr.category_id = ${category.id} and ttd.is_active = 'Active' GROUP by ttr.tiffin_detail_id ORDER BY position ASC`, { type: sequelize.QueryTypes.SELECT })
      const tiffins = await sequelize.query(`SELECT tt.id, tt.title, tt.price, tt.is_active FROM tbl_tiffin_relation ttr inner join tbl_tiffins tt on tt.id = tiffin_id where ttr.category_id = ${category.id} and tt.is_active = 'Active' GROUP by ttr.tiffin_id`, { type: sequelize.QueryTypes.SELECT })
      category.items_id = items
      category.tiffin_id = tiffins.map((ele) => ele.id)
    }
    if (result.length) {
      const [[count], countMeta] = await sequelize.query('SELECT COUNT(id) AS total FROM tbl_tiffin_category WHERE is_active != \'Delete\'', { types: sequelize.QueryTypes.SELECT })
      return {
        page: parseInt(params.page) + 1,
        count: count.total - 1,
        result
      }
    }
  },
  add_tiffin_items(params) {
    return new Promise(async (resolve, reject) => {
      const insertBulkData = []
      for (const item of params.items) {
        const exists = await tbl_tiffin_detail.findOne({ where: { name: item.name } })
        if (exists) return reject('Already Exists')
        else tbl_tiffin_detail.create({ name: item.name, price: item.price, insert_datetime: moment().format('X') })
        insertBulkData.push({
          name: item.name, price: item.price, is_active: 'Active', insert_datetime: moment().format('X')
        })
      }
      await tbl_tiffin_detail.bulkCreate(insertBulkData)
      resolve()
    })
  },
  edit_tiffin_item(params) {
    return new Promise(async (resolve, reject) => {
      const updateData = {
        name: params.name,
        price: params.price,
        update_datetime: moment().format('X')
      }

      const exists = await tbl_tiffin_detail.count({ where: { name: params.name, is_active: 'Active', id: { [Op.ne]: params.id } } })

      if (exists) return reject('Already Exists')

      else await tbl_tiffin_detail.update(updateData, { where: { id: params.id } })

      resolve()
    })
  },
  change_tiffin_item_status(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        is_active: params.status,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE tbl_tiffin_detail SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  tiffin_items_list(params) {
    return new Promise((resolve, reject) => {
      let where = ''
      let order_by = ''
      if (params.search) {
        where += `and ttd.name LIKE '%${params.search}%'`
      }
      // if (params.category_id) {
      //   if (where) where += `AND ttr.category_id = ${params.category_id}`
      //   else where += `where ttr.category_id = ${params.category_id}`
      // }
      if (params.sort_by_column && params.sort_by_order) {
        order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`
      } else {
        order_by = 'ORDER BY ttd.id DESC'
      }
      let limit = ''
      if (!['-1', -1].includes(params.page)) {
        limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`
      }

      const findQuery = 'select * from tbl_tiffin_detail as ttd where ttd.is_active != \'Delete\''
      const countQuery = 'select count(id) as total from tbl_tiffin_detail as ttd where ttd.is_active != \'Delete\''

      con.query(`${findQuery} ${where} ${order_by} ${limit}`, (error, result) => {
        if (!error && result[0]) {
          con.query(`${countQuery} ${where}`, (countError, countResult) => {
            let count = 0
            if (!countError && countResult[0]) {
              count = countResult[0].total
            }
            // totalCount(`tbl_tiffin_detail`, (count) => {
            resolve({
              page: parseInt(params.page) + 1,
              count,
              result
            })
            // })
          })
        } else {
          reject()
        }
      })
    })
  }
}
