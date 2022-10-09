let con = require('../../../../config/database');
let { PER_PAGE, S3_URL, ADMIN_IMAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

module.exports = {
    unique_fields(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id FROM tbl_admin WHERE email = '${params.email}' LIMIT 1`, (err, result) => {
                if (result.length > 0) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    },

    add_sub_admin(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                admin_id: params.login_user_id,
                state_id: params.state_id,
                profile_image: params.profile_image,
                name: params.name,
                email: params.email,
                password: params.password,
                role: 'Sub-Admin',
                isDashboard: params.is_dashboard,
                isCategory: params.is_category,
                isProduct: params.is_product,
                isModifiers: params.is_modifiers,
                isModifiersSet: params.is_modifiers_set,
                isItems: params.is_items,
                isOrder: params.is_order,
                isUser: params.is_user,
                isPromoCode: params.is_promo_code,
                isGallery: params.is_gallery,
                isFAQ: params.is_faq,
                isTiffin: params.is_tiffin,
                isTiffinCategory: params.is_tiffin_category,
                isTiffinItem: params.is_tiffin_item,
                isSubscription: params.is_subscription,
                isSlider: params.is_slider,
                isOrderReport: params.is_order_report,
                isDeliveryReport: params.is_delivery_report,
                isKitchenReport: params.is_kitchen_report,
                isRevenueReport: params.is_revenue_report,
                isMenu: params.is_menu,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO tbl_admin SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    edit_unique_fields(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id FROM tbl_admin WHERE email = "${params.email}" LIMIT 1`, (err, result) => {
                if (result.length == 1 && result[0].id == params.id) {
                    resolve();
                }
                else if (result.length == 0) {
                    resolve();
                }
                else {
                    reject();
                }
            });
        });
    },
    edit_sub_admin(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                state_id: params.state_id,
                name: params.name,
                email: params.email,
                isDashboard: params.is_dashboard,
                isCategory: params.is_category,
                isProduct: params.is_product,
                isModifiers: params.is_modifiers,
                isModifiersSet: params.is_modifiers_set,
                isItems: params.is_items,
                isOrder: params.is_order,
                isUser: params.is_user,
                isPromoCode: params.is_promo_code,
                isGallery: params.is_gallery,
                isFAQ: params.is_faq,
                isTiffin: params.is_tiffin,
                isTiffinCategory: params.is_tiffin_category,
                isTiffinItem: params.is_tiffin_item,
                isSubscription: params.is_subscription,
                isSlider: params.is_slider,
                isOrderReport: params.is_order_report,
                isDeliveryReport: params.is_delivery_report,
                isKitchenReport: params.is_kitchen_report,
                isRevenueReport: params.is_revenue_report,
                isMenu: params.is_menu,
                update_datetime: moment().format("X")
            }
            if (params.profile_image) {
                updateData.profile_image = params.profile_image;
            }
            if (params.password) {
                updateData.password = params.password;
            }
            con.query(`UPDATE tbl_admin SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    change_sub_admin_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE tbl_admin SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    sub_admin_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND name LIKE '%${params.search}%' OR email LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY id DESC`;
            }
            con.query(`SELECT *,CONCAT('${S3_URL + ADMIN_IMAGE}',profile_image) AS profile_image FROM tbl_admin WHERE is_active != 'Delete' AND role != 'Super-Admin' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(`tbl_admin`, (count) => {
                        resolve({
                            page: parseInt(params.page) + 1,
                            count: (count - 1),
                            result: result
                        })
                    })
                } else {
                    reject();
                }
            })
        })
    },
}