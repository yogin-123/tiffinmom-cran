/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
const connection = require('../../../../config/database')
const moment = require('moment')
const { APP_NAME, S3_URL, PRODUCT_IMAGE, PER_PAGE, TIFFIN_IMAGE } = require('../../../../config/constants')
const { send_email } = require('../../../../config/common')
const template = require('../../../../config/template')
const { tbl_cart: CartModel, tbl_cart_detail: CartDetailModel } = require('../../../../models')
const asyncLoop = require('node-async-loop')

const tbl_category = 'tbl_category'
const tbl_product = 'tbl_product'
const tbl_cart = 'tbl_cart'
const tbl_orders = 'tbl_orders'

module.exports = {
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                               Category List                                    /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  categorys(params) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT id,name FROM ${tbl_category} WHERE is_active = 'Active' AND state_id = ${params.state_id} ORDER BY id DESC`, (error, result) => {
        if (!error && result[0]) {
          resolve(result)
        } else {
          reject()
        }
      })
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                               Product List                                     /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  products(params) {
    return new Promise((resolve, reject) => {
      let limit = ''
      if (!['-1', -1].includes(params.page)) {
        limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`
      }
      connection.query(`SELECT id,CONCAT('${S3_URL + PRODUCT_IMAGE}',image) AS image,name,price,description FROM ${tbl_product} WHERE is_active = 'Active' AND category_id = ${params.category_id} ORDER BY id DESC ${limit}`, (error, result) => {
        if (!error && result[0]) {
          resolve(result)
        } else {
          reject()
        }
      })
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                                Add To Cart                                     /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  add_to_cart(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = { where: {} }
        if (params.type === 'Tiffin') {
          Object.assign(query.where, { tiffin_id: params.tiffin_id })
          where = `AND tiffin_id = ${params.tiffin_id}`
        } else {
          Object.assign(query.where, { product_id: params.product_id })
          where = `AND product_id = ${params.product_id}`
        }

        Object.assign(query.where, { user_id: params.login_user_id })

        const result = await CartModel.findOne(query, { raw: true })
        if (result) {
          if ([0, '0'].includes(params.quantity)) {
            // connection.query('SET SQL_SAFE_UPDATES=0;')
            await CartModel.destroy({ where: { id: result.id } })
            await CartDetailModel.destroy({ where: { cart_id: result.id } })
            resolve('updated')
          } else {
            const updateData = {
              quantity: params.quantity,
              price: params.price,
              update_datetime: moment().format('X')
            }
            await CartModel.update(updateData, { where: { id: result.id } })
            await CartDetailModel.destroy({ where: { cart_id: result.id } })
            if (['Tiffin'].includes(params.type)) {
              const insertBulkData = []
              for (const item of params.tiffin_detail_id) {
                const itemInsertQuery = {
                  cart_id: result.id,
                  tiffin_detail_id: item.detail_id,
                  quantity: item.quantity,
                  insert_datetime: moment().format('X')
                }
                insertBulkData.push(itemInsertQuery)
              }
              await CartDetailModel.bulkCreate(insertBulkData)
              resolve('updated')
            } else {
              resolve('added')
            }
            resolve('updated')
          }
        } else {
          const insertData = {
            user_id: params.login_user_id,
            state_id: params.state_id,
            quantity: params.quantity,
            price: params.price,
            type: params.type,
            insert_datetime: moment().format('X')
          }
          if (params.type === 'Tiffin') {
            insertData.tiffin_id = params.tiffin_id
          } else {
            insertData.product_id = params.product_id
          }
          const insertResult = await CartModel.create(insertData)
          if (insertResult) {
            if (['Tiffin'].includes(params.type)) {
              const insertBulkData = []
              for (const item of params.tiffin_detail_id) {
                const itemInsertQuery = {
                  cart_id: insertResult.getDataValue('id'),
                  tiffin_detail_id: item.detail_id,
                  quantity: item.quantity,
                  insert_datetime: moment().format('X')
                }
                insertBulkData.push(itemInsertQuery)
              }
              await CartDetailModel.bulkCreate(insertBulkData)
              resolve('added')
            } else {
              resolve('added')
            }
          } else {
            reject('added')
          }
        }
      } catch (error) {
        console.log(error)
      }
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                                 Cart List                                      /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  cart_list(params) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT id,type,quantity,price,product_id,tiffin_id FROM ${tbl_cart} WHERE is_active = 'Active' AND quantity != 0 AND user_id = ${params.login_user_id} ORDER BY id DESC`, (error, result) => {
        if (!error && result[0]) {
          asyncLoop(result, (item, next) => {
            if (item.type === 'Tiffin') {
              connection.query(`SELECT title,description,CONCAT('${S3_URL + TIFFIN_IMAGE}',image) AS image FROM tbl_tiffins WHERE id = ${item.tiffin_id} AND is_active = 'Active' LIMIT 1`, (tiffinError, tiffinResult) => {
                connection.query(`SELECT tc.id,tc.name,td.name AS descripion,cd.tiffin_detail_id,cd.quantity FROM tbl_cart_detail AS cd left join tbl_tiffin_relation ttr on ttr.id = cd.tiffin_detail_id JOIN tbl_tiffin_detail AS td ON td.id = ttr.tiffin_detail_id JOIN tbl_tiffin_category AS tc ON tc.id = ttr.category_id WHERE cd.cart_id = ${item.id} AND cd.is_active = 'Active'`, (detailError, detailResult) => {
                  item.image = tiffinResult[0].image
                  item.name = tiffinResult[0].title
                  item.description = tiffinResult[0].description
                  item.tiffin_detail_id = detailResult
                  next()
                })
              })
            } else {
              connection.query(`SELECT CONCAT('${S3_URL + PRODUCT_IMAGE}',image) AS image,name,description FROM tbl_product WHERE id = ${item.product_id} LIMIT 1`, (detailError, detailResult) => {
                item.image = detailResult[0].image
                item.name = detailResult[0].name
                item.description = detailResult[0].description
                next()
              })
            }
          }, () => {
            connection.query(`SELECT us.id,s.name,s.tiffin_id,s.quantity,us.use_quantity,t.price FROM tbl_user_subscription AS us JOIN tbl_subscription_plan AS s ON s.id = us.subscription_id JOIN tbl_tiffins AS t ON t.id = s.tiffin_id WHERE us.user_id = ${params.login_user_id} AND us.use_quantity < s.quantity`, (userSubscriptionError, userSubscriptionResult) => {
              resolve({
                list: result,
                subsctiption: (!userSubscriptionError && userSubscriptionResult[0]) ? userSubscriptionResult : []
              })
            })
          })
        } else {
          reject()
        }
      })
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                                Place Order                                     /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  place_order(params) {
    return new Promise((resolve, reject) => {
      const insertData = {
        user_id: params.login_user_id,
        state_id: params.state_id,
        billing_details: JSON.stringify(params.billing_details),
        shipping_details: JSON.stringify(params.shipping_details),
        sub_total: params.sub_total,
        shipping_charge: params.shipping_charge,
        final_total: params.final_total,
        transaction_id: params.transaction_id,
        order_id: params.order_id,
        insert_datetime: moment().format('X')
      }
      if (params.discount) {
        insertData.discount = params.discount
      }
      if (params.promocode_id) {
        insertData.promocode_id = params.promocode_id
      }
      connection.query(`INSERT INTO ${tbl_orders} SET ?`, insertData, (insertError, insertResult) => {
        if (!insertError) {
          asyncLoop(params.products, (item, next) => {
            const orderDetail = {
              order_id: insertResult.insertId,
              type: item.type,
              price: item.price,
              quantity: item.quantity,
              insert_datetime: moment().format('X')
            }
            if (item.type === 'Tiffin') {
              orderDetail.tiffin_id = item.tiffin_id
            } else {
              orderDetail.product_id = item.product_id
            }
            connection.query('INSERT INTO tbl_order_detail SET ?', orderDetail, (orderDetailError, orderDetailResult) => {
              if (item.tiffin_detail_id && item.tiffin_detail_id.length > 0) {
                asyncLoop(item.tiffin_detail_id, (tiffin, next) => {
                  const tiffinDetail = {
                    order_id: insertResult.insertId,
                    detail_id: orderDetailResult.insertId,
                    category_id: tiffin.tiffin_detail_id,
                    quantity: tiffin.quantity,
                    insert_datetime: moment().format('X')
                  }
                  connection.query('INSERT INTO tbl_order_tiffin_detail SET ?', tiffinDetail, (tiffinDetailError, tiffinDetailResult) => {
                    next()
                  })
                }, () => {
                  connection.query(`select us.id from tbl_user_subscription AS us JOIN tbl_subscription_plan AS s ON s.id = us.subscription_id where us.user_id = ${params.login_user_id} AND s.tiffin_id = ${item.tiffin_id} AND us.use_quantity != s.quantity;`, (subsctiptionError, subsctiptionResult) => {
                    if (!subsctiptionError && subsctiptionResult[0]) {
                      connection.query(`UPDATE tbl_user_subscription SET use_quantity = use_quantity + 1 WHERE id = ${subsctiptionResult[0].id};`, (updateSubscriptionError, updateSubscriptionResult) => {
                        next()
                      })
                    } else {
                      next()
                    }
                  })
                })
              } else {
                next()
              }
            })
          }, () => {
            connection.query('SET SQL_SAFE_UPDATES=0;')
            connection.query(`DELETE FROM tbl_cart WHERE user_id = ${params.login_user_id}`, (emptyError, emptyResult) => {
              const { email, firstName, lastName, phone } = params.billing_details
              if (email) {
                connection.query(`SELECT CONCAT(t.title," : ",IFNULL(GROUP_CONCAT(CONCAT(td.name,' ( Qty. ',otd.quantity,' )')),'')) AS name,od.quantity,t.price FROM tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id JOIN tbl_tiffins AS t ON t.id = od.tiffin_id JOIN tbl_order_tiffin_detail AS otd ON otd.detail_id = od.id join tbl_tiffin_relation as ttr on ttr.id = otd.category_id JOIN tbl_tiffin_detail AS td ON td.id = ttr.tiffin_detail_id JOIN tbl_tiffin_category AS tc ON tc.id = ttr.category_id WHERE o.is_active = 'Active' AND o.id = ${insertResult.insertId} AND tc.quantity != 0 GROUP BY od.id ORDER BY od.id DESC;`, (tiffinOrderError, tiffinOrderResult) => {
                  connection.query(`SELECT p.name,od.quantity,od.price FROM tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id JOIN tbl_product AS p ON p.id = od.product_id WHERE o.is_active = 'Active' AND o.id = ${insertResult.insertId} GROUP BY od.id ORDER BY od.id DESC;`, (trayOrderError, trayOrderResult) => {
                    connection.query(`SELECT td.name,otd.quantity,td.price FROM tbl_order_tiffin_detail AS otd join tbl_tiffin_relation on ttr.id = otd.category_id JOIN tbl_tiffin_detail AS td ON td.id = ttr.tiffin_detial_id JOIN tbl_tiffin_category AS tc ON tc.id = ttr.category_id AND tc.quantity = 0 WHERE otd.order_id = ${insertResult.insertId};`, (extraTiffinOrderError, extraTiffinOrderResult) => {
                      const orders = [...tiffinOrderResult, ...trayOrderResult, ...extraTiffinOrderResult]
                      let orderHtml = ''
                      orders.forEach((element) => {
                        orderHtml += `<tr>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">${element.name}</td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">${element.quantity}x</td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">$${element.price}</td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">$${element.price * element.quantity}</td>
                                              </tr>`
                      })
                      if (params.discount) {
                        orderHtml += `<tr>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;"></td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;"></td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">Discount</td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">$${params.discount.toFixed(2)}</td>
                                              </tr>`
                      }
                      const billingAddress = params.billing_details ? (params.billing_details?.address1 + ', ' + params.billing_details?.address2 + ', ' + params.billing_details?.city + ',' + params.billing_details?.country + ', ' + params.billing_details.state + ',' + params.billing_details.postCode) : ''
                      const shippingAddress = params.shipping_details ? (params.shipping_details?.address1 + ', ' + params.shipping_details?.address2 + ', ' + params.shipping_details?.city + ',' + params.shipping_details?.country + ', ' + params.shipping_details.state + ',' + params.shipping_details.postCode) : ''
                      const emailDetail = {
                        name: (firstName && lastName) ? firstName + lastName : '',
                        order_id: insertResult.insertId,
                        mobile_number: phone,
                        email,
                        transaction_id: params.transaction_id,
                        final_total: params.final_total.toFixed(2),
                        sub_total: params.sub_total.toFixed(2),
                        orders: orderHtml,
                        billing_details: billingAddress,
                        shipping_details: shippingAddress
                      }
                      const sendEmail = {
                        email: 'admin@tiffinmom.com',
                        password: 'zepzgsluuxfbefnw'
                      }
                      if ([1, '1'].includes(params.state_id)) {
                        sendEmail.email = 'orders.nj@tiffinmom.com'
                        sendEmail.password = '@Panna2020'
                      } else if ([3, '3'].includes(params.state_id)) {
                        sendEmail.email = 'orders.louis@tiffinmom.com'
                        sendEmail.password = 'gwksisijduwrhlhg'
                      } else if ([4, '4'].includes(params.state_id)) {
                        sendEmail.email = 'orders.pitts@tiffinmom.com'
                        sendEmail.password = 'zldjzbtuvdztpgoi'
                      }
                      template.place_order(emailDetail, (html) => {
                        send_email(APP_NAME, email, html, sendEmail).then((resClientEmail) => {
                          send_email(APP_NAME, 'admin@tiffinmom.com', html, sendEmail).then((resAdminEmail) => {
                            send_email(APP_NAME, sendEmail.email, html, sendEmail).then((resStateEmail) => {
                              if (params.promocode_id) {
                                const promocode = {
                                  user_id: params.login_user_id,
                                  promocode_id: params.promocode_id,
                                  amount: params.discount,
                                  insert_datetime: moment().format('X')
                                }
                                connection.query('INSERT INTO tbl_promocode_used SET ?', promocode, (promocodeError, promocodeResult) => {
                                  resolve()
                                })
                              } else {
                                resolve()
                              }
                            })
                          })
                        }).catch(() => {
                          if (params.promocode_id) {
                            const promocode = {
                              user_id: params.login_user_id,
                              promocode_id: params.promocode_id,
                              amount: params.discount,
                              insert_datetime: moment().format('X')
                            }
                            connection.query('INSERT INTO tbl_promocode_used SET ?', promocode, (promocodeError, promocodeResult) => {
                              resolve()
                            })
                          } else {
                            resolve()
                          }
                        })
                      })
                    })
                  })
                })
              } else {
                resolve()
              }
            })
          })
        } else {
          reject()
        }
      })
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                                 Order List                                     /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  order_list(params) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM tbl_orders WHERE user_id = ${params.login_user_id} AND is_active = 'Active'`, (error, result) => {
        if (!error && result[0]) {
          asyncLoop(result, (item, next) => {
            connection.query(`SELECT od.*,IF(IFNULL(p.name,'') = '',t.title,p.name) AS name,IF(IFNULL(p.image,'') = '',CONCAT('${S3_URL + TIFFIN_IMAGE}',t.image),CONCAT('${S3_URL + PRODUCT_IMAGE}',p.image)) AS image,IFNULL(GROUP_CONCAT(CONCAT(td.name,' ( Qty. ',otd.quantity,' )')),'') AS tiffin_item FROM tbl_order_detail AS od LEFT JOIN tbl_tiffins AS t ON t.id = od.tiffin_id LEFT JOIN tbl_product AS p ON p.id = od.product_id LEFT JOIN tbl_order_tiffin_detail AS otd ON otd.detail_id = od.id left join tbl_tiffin_relation as ttr on ttr.id = otd.category_id LEFT JOIN tbl_tiffin_detail AS td ON td.id = ttr.tiffin_detail_id WHERE od.order_id = ${item.id} AND od.is_active = 'Active'`, (orderDetailError, orderDetailResult) => {
              item.detail = (!orderDetailError && orderDetailResult[0]) ? orderDetailResult : []
              next()
            })
          }, () => {
            resolve(result)
          })
        } else {
          reject()
        }
      })
    })
  },
  verify_promocode(params) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT id,limit_per_user,value,promocode,type FROM tbl_promocode WHERE is_active = 'Active' AND promocode = '${params.promocode}' AND state_id = ${params.state_id} AND DATE('${moment().format('YYYY-MM-DD')}') BETWEEN start_date AND end_date LIMIT 1;`, (error, result) => {
        if (!error && result[0]) {
          connection.query(`SELECT COUNT(id) AS total FROM tbl_promocode_used WHERE user_id = ${params.login_user_id} AND promocode_id = ${result[0].id}`, (limitError, limitResult) => {
            if (!limitError && limitResult[0].total < result[0].limit_per_user) {
              resolve(result[0])
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
