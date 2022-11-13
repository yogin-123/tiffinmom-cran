/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
const con = require('../../../../config/database')
const { PER_PAGE } = require('../../../../config/constants')
const moment = require('moment')
const asyncLoop = require('node-async-loop')
const { totalCount } = require('../../../../config/common')

const tbl_modifiers = 'tbl_modifiers'
const tbl_modifiers_set = 'tbl_modifiers_set'

module.exports = {
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                              Add Modifiers Set                                 /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  add_modifiers_set(params) {
    return new Promise((resolve, reject) => {
      const insertBulkData = []
      asyncLoop(params.modifiers_sets, (item, next) => {
        insertBulkData.push({
          user_id: params.login_user_id,
          name: item.name,
          sorting_number: item.sorting_number,
          price: item.price,
          insert_datetime: moment().format('X')
        })
        next()
      }, () => {
        con.query(`INSERT INTO ${tbl_modifiers_set}(user_id,name,sorting_number,price,insert_datetime) SET ?`, [insertBulkData], (error, result) => {
          if (!error) {
            resolve()
          } else {
            reject()
          }
        })
      })
    })
  },
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                             Edit Modifiers Set                                 /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  edit_modifiers_set(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        name: params.name,
        sorting_number: params.sorting_number,
        price: params.price,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE ${tbl_modifiers_set} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                         Change Modifiers Set Status                            /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  change_modifiers_set_status(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        is_active: params.status,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE ${tbl_modifiers_set} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                            Modifiers Set List                                  /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  modifiers_set_list(params) {
    return new Promise((resolve, reject) => {
      let where = ''
      let order_by = ''
      if (params.search) {
        where = `AND name LIKE '%${params.search}%'`
      }
      if (params.sort_by_column && params.sort_by_order) {
        order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`
      } else {
        order_by = 'ORDER BY id DESC'
      }
      con.query(`SELECT id,name,sorting_number,price,is_active,insert_datetime FROM ${tbl_modifiers_set} WHERE is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
        if (!error && result[0]) {
          totalCount(tbl_modifiers_set, (count) => {
            resolve({
              page: parseInt(params.page) + 1,
              count,
              result
            })
          })
        } else {
          reject()
        }
      })
    })
  },
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                               Add Modifiers                                    /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  add_modifiers(params) {
    return new Promise((resolve, reject) => {
      const insertData = {
        user_id: params.login_user_id,
        name: params.name,
        required_number: params.required_number,
        sorting_number: params.sorting_number,
        toppings_ids: params.toppings_ids,
        insert_datetime: moment().format('X')
      }
      con.query(`INSERT INTO ${tbl_modifiers} SET ?`, insertData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                               Edit Modifiers                                   /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  edit_modifiers(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        name: params.name,
        required_number: params.required_number,
        sorting_number: params.sorting_number,
        toppings_ids: params.toppings_ids,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE ${tbl_modifiers} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                           Change Modifiers Status                              /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  change_modifiers_status(params) {
    return new Promise((resolve, reject) => {
      const updateData = {
        is_active: params.status,
        update_datetime: moment().format('X')
      }
      con.query(`UPDATE ${tbl_modifiers} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
        if (!error) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                              Modifiers List                                    /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  modifiers_list(params) {
    return new Promise((resolve, reject) => {
      let where = ''
      let order_by = ''
      if (params.search) {
        where = `AND name LIKE '%${params.search}%'`
      }
      if (params.sort_by_column && params.sort_by_order) {
        order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`
      } else {
        order_by = 'ORDER BY id DESC'
      }
      con.query(`SELECT id,name,required_number,sorting_number,toppings_ids,is_active,insert_datetime FROM ${tbl_modifiers} WHERE is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
        if (!error && result[0]) {
          totalCount(tbl_modifiers, (count) => {
            resolve({
              page: parseInt(params.page) + 1,
              count,
              result
            })
          })
        } else {
          reject()
        }
      })
    })
  }
}
