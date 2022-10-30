const con = require('../../../../config/database')
const { S3_URL, ADMIN_IMAGE } = require('../../../../config/constants')
const moment = require('moment')

module.exports = {
  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                                  Signin                                        /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  signin(params) {
    return new Promise((resolve, reject) => {
      con.query(`SELECT id,state_id,CONCAT('${S3_URL + ADMIN_IMAGE}',profile_image) AS profile_image,name,email,is_active,role,isDashboard AS is_dashboard,isCategory AS is_category,isProduct AS is_product,isModifiers AS is_modifiers,isModifiersSet AS is_modifiers_set,isItems AS is_items,isOrder AS is_order,isUser AS is_user,isPromoCode AS is_promocode,isGallery AS is_gallery,isFAQ AS is_faq,isTiffin AS is_tiffin,isTiffinCategory AS is_tiffin_category,isTiffinItem AS is_tiffin_item,isSlider AS is_slider,isSubscription AS is_subscription,isOrderReport AS is_order_report,isDeliveryReport AS is_delivery_report,isKitchenReport AS is_kitchen_report,isRevenueReport AS is_revenue_report,isMenu AS is_menu FROM tbl_admin WHERE is_active != 'Delete' AND email = '${params.email}' AND password = '${params.password}' LIMIT 1`, (err, result) => {
        if (!err) {
          if (result[0] != undefined) {
            if (result[0].is_active == 'Inactive') {
              resolve({ code: 3 })
            } else {
              resolve({ code: 1, data: result[0] })
            }
          } else {
            reject()
          }
        } else {
          reject()
        }
      })
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                               Edit Profile                                     /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  edit_check_unique(id, params, callback) {
    this.edit_unique_fields('email', id, params.email).then((email) => {
      callback(true)
    }).catch((error) => {
      callback(false, params.email)
    })
  },
  edit_unique_fields(field, id, params) {
    return new Promise((resolve, reject) => {
      if (params != '') {
        con.query(`SELECT id FROM tbl_admin WHERE ${field} = "${params}" AND is_active != "Delete" LIMIT 1`, (err, result) => {
          if (result.length == 1 && result[0].id == id) {
            resolve()
          } else if (result.length == 0) {
            resolve()
          } else {
            reject()
          }
        })
      } else {
        resolve()
      }
    })
  },
  edit_profile(user_id, params) {
    return new Promise((resolve, reject) => {
      con.query(`UPDATE tbl_admin SET ? WHERE id = '${user_id}'`, params, (err, result) => {
        if (!err) {
          this.user_details({ user_id }).then((response) => {
            delete response.password
            resolve(response)
          }).catch((err) => {
            reject()
          })
        } else {
          reject()
        }
      })
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                                Get Profile                                     /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  user_details(params) {
    return new Promise((resolve, reject) => {
      let where = ''
      if (params.user_id) {
        where = `AND id = '${params.user_id}'`
      } else {
        where = `AND email = '${params.email}'`
      }
      con.query(`SELECT id,CONCAT('${S3_URL + ADMIN_IMAGE}',profile_image) AS profile_image,email,password,name,role,isDashboard AS is_dashboard,isCategory AS is_category,isProduct AS is_product,isModifiers AS is_modifiers,isModifiersSet AS is_modifiers_set,isItems AS is_items,isOrder AS is_order,isUser AS is_user,isPromoCode AS is_promocode,isGallery AS is_gallery,isFAQ AS is_faq,isTiffin AS is_tiffin,isTiffinCategory AS is_tiffin_category,isTiffinItem AS is_tiffin_item,isSlider AS is_slider,isSubscription AS is_subscription,isOrderReport AS is_order_report,isDeliveryReport AS is_delivery_report,isKitchenReport AS is_kitchen_report,isRevenueReport AS is_revenue_report,isMenu AS is_menu FROM tbl_admin WHERE is_active = 'Active' ${where}`, (err, result) => {
        if (!err && result[0] != undefined) {
          resolve(result[0])
        } else {
          reject()
        }
      })
    })
  },

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// //                                   Logout                                       /////
  /// ///////////////////////////////////////////////////////////////////////////////////////
  logout(id) {
    return new Promise((resolve, reject) => {
      const update_data = {
        token: '',
        last_login_datetime: moment().format('X')
      }
      con.query(`UPDATE tbl_admin SET ? WHERE id = '${id}'`, update_data, (err) => {
        resolve()
      })
    })
  }
}
