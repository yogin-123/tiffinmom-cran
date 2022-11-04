/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
const con = require('../../../../config/database')
const { PER_PAGE, S3_URL, TIFFIN_IMAGE } = require('../../../../config/constants')
const moment = require('moment')
const { totalCount } = require('../../../../config/common')
const asyncLoop = require('node-async-loop')

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
        const insertBulkData = []
        const insertRelationBulkData = []
        asyncLoop(params.categorys, (item, next) => {
          insertBulkData.push([params.login_user_id, item.name, item.quantity, moment().format('X'), item.position])
          if (item?.tiffin_id?.length) {
            for (const tiffin of item.tiffin_id) {
              for (const items of item.items_id) {
                con.query(`select * from tbl_tiffin_category where name='${item.name}'`, (err, category) => {
                  if (err) console.log(err)
                  insertRelationBulkData.push([tiffin, category[0].id, items.id, new Date().getTime(), new Date().getTime(), items.position])
                  con.query('INSERT INTO tbl_tiffin_relation(tiffin_id,category_id,tiffin_detail_id,created_at,updated_at, position) set ?', [insertRelationBulkData], (insertError, insertResult) => {
                    if (insertError) console.log(insertError)
                    else {
                      console.log({ insertError })
                      reject()
                    }
                  })
                })
              }
            }
          } else if (item?.items_id?.length) {
            for (const items of item.items_id) {
              con.query(`select * from tbl_tiffin_category where name='${item.name}'`, (err, category) => {
                if (err) console.log(err)
                insertRelationBulkData.push([category[0].id, items.id, new Date().getTime(), new Date().getTime(), items.position])
                con.query('INSERT INTO tbl_tiffin_relation(category_id,tiffin_detail_id,created_at,updated_at, position) set ?', [insertRelationBulkData], (insertError, insertResult) => {
                  if (insertError) reject()
                })
              })
            }
          }
          next()
        })
        con.query('INSERT INTO tbl_tiffin_category(user_id,name,quantity,insert_datetime,position) values ?', [insertBulkData], (error, result) => {
          if (error) {
            console.log(error)
            reject()
          } else {
            resolve()
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
  },
  edit_tiffin_category(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        name: params.name,
        quantity: params.quantity,
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
  tiffin_category_list(params) {
    return new Promise((resolve, reject) => {
      let where = ''
      let order_by = ''
      if (params.search) {
        where += `AND name LIKE '%${params.search}%'`
      }
      if (params.sort_by_column && params.sort_by_order) {
        order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`
      } else {
        order_by = 'ORDER BY id DESC'
      }
      let limit = ''
      if (!['-1', -1].includes(params.page)) {
        limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`
      }
      con.query(`SELECT * FROM tbl_tiffin_category WHERE is_active != 'Delete' ${where} ${order_by} ${limit}`, (error, result) => {
        if (!error && result[0]) {
          totalCount('tbl_tiffin_category', (count) => {
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
  add_tiffin_items(params) {
    return new Promise((resolve, reject) => {
      const insertBulkData = []
      for (const item of params.items) {
        insertBulkData.push([item.name, item.price, moment().format('X')])
      }
      con.query('INSERT INTO tbl_tiffin_detail(name,price,insert_datetime) VALUES ?', [insertBulkData], (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  edit_tiffin_item(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        name: params.name,
        price: params.price,
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
