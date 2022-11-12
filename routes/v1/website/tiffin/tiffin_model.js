/* eslint-disable camelcase */
/* eslint-disable prefer-promise-reject-errors */
const connection = require('../../../../config/database')
const asyncLoop = require('node-async-loop')
const { S3_URL, TIFFIN_IMAGE } = require('../../../../config/constants')

module.exports = {
  tiffin_list(params) {
    return new Promise((resolve, reject) => {
      const { state_id } = params
      let where = ''
      if (state_id) {
        where = `AND state_id = ${state_id}`
      }
      connection.query(`SELECT CONCAT('${S3_URL + TIFFIN_IMAGE}',image) AS image,id,title,delivery_on,price,description FROM tbl_tiffins WHERE is_active = 'Active' ${where}`, (error, result) => {
        if (!error && result[0]) {
          resolve(result)
        } else {
          reject()
        }
      })
    })
  },
  tiffin_detail(params) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT CONCAT('${S3_URL + TIFFIN_IMAGE}',image) AS image,id,title,delivery_on,price,description FROM tbl_tiffins WHERE is_active = 'Active' AND id = ${params.tiffin_id} LIMIT 1`, (error, result) => {
        if (!error && result[0]) {
          connection.query(`SELECT tc.id,tc.name,tc.quantity,tc.position FROM tbl_tiffin_relation as ttr left join tbl_tiffin_detail AS td on td.id = ttr.tiffin_detail_id JOIN tbl_tiffin_category AS tc ON tc.id = ttr.category_id WHERE tc.is_active = 'Active' AND td.is_active = 'Active' AND ttr.tiffin_id = ${params.tiffin_id} GROUP BY ttr.category_id order by tc.position ASC`, (categoryError, categoryResult) => {
            if (!categoryError && categoryResult[0]) {
              asyncLoop(categoryResult, (item, next) => {
                connection.query(`SELECT ttr.id,td.name,td.price FROM tbl_tiffin_relation as ttr left join tbl_tiffin_detail as td on td.id = ttr.tiffin_detail_id WHERE td.is_active = 'Active' AND ttr.tiffin_id = ${params.tiffin_id} AND ttr.category_id = ${item.id} order by ttr.position ASC`, (itemsError, itemResult) => {
                  if (!itemsError && itemResult[0]) {
                    item.item = itemResult
                  }
                  next()
                })
              }, () => {
                result[0].category = categoryResult
                resolve(result[0])
              })
            } else {
              reject()
            }
          })
        } else {
          reject()
        }
      })
    })
  }
}
