const moment = require('moment-timezone');
let con = require('../../../../config/database');
let { PER_PAGE } = require('../../../../config/constants');
let { totalCount, send_email } = require('../../../../config/common');
const template = require('../../../../config/template');

module.exports = {
    change_order_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE tbl_orders SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    order_list(params) {
        return new Promise((resolve, reject) => {
            const { start_date: startDate, end_date: endDate, start_id: startId, end_id: endId, tiffin_id: tiffinId } = params;
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND o.final_total LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND o.state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY o.id DESC`;
            }
            if (startDate && endDate) {
                where += ` AND (o.insert_datetime >= ${moment(startDate).format('X')} AND o.insert_datetime <= ${moment(endDate).format('X')} )`;
            }
            if (startId && endId) {
                where += ` AND o.id >= ${startId} AND o.id <= ${endId}`
            }
            if (tiffinId) {
                where += ` AND (od.tiffin_id = ${tiffinId} OR od.tiffin_id = 0)`;
            }
            con.query(`SELECT IFNULL(GROUP_CONCAT(CONCAT(td.name,' ( Qty. ',otd.quantity,' )')),'') AS tiffin_item,o.id,od.quantity,IF(IFNULL(p.name, '') = '',t.title,p.name) AS name,o.sub_total,o.state_id,o.user_id,o.billing_details,o.shipping_details,o.insert_datetime,o.transaction_id,o.order_id,o.is_active,o.final_total FROM tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id LEFT JOIN tbl_product AS p ON p.id = od.product_id LEFT JOIN tbl_tiffins AS t ON t.id = od.tiffin_id LEFT JOIN tbl_order_tiffin_detail AS otd ON otd.detail_id = od.id LEFT JOIN tbl_tiffin_detail AS td ON td.id = otd.category_id WHERE o.is_active = 'Active' ${where} GROUP BY od.id ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(`tbl_orders`, (count) => {
                        resolve({
                            page: parseInt(params.page) + 1,
                            count: count,
                            result: result
                        })
                    })
                } else {
                    reject();
                }
            })
        })
    },
    place_order(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: 0,
                state_id: params.state_id,
                billing_details: JSON.stringify(params.billing_details),
                shipping_details: JSON.stringify(params.shipping_details),
                sub_total: params.sub_total,
                shipping_charge: params.shipping_charge,
                final_total: params.final_total,
                transaction_id: params.transaction_id,
                order_id: params.order_id,
                insert_datetime: moment().format("X")
            }
            connection.query(`INSERT INTO tbl_orders SET ?`, insertData, (insertError, insertResult) => {
                if (!insertError) {
                    asyncLoop(params.products, (item, next) => {
                        let orderDetail = {
                            order_id: insertResult.insertId,
                            type: item.type,
                            price: item.price,
                            quantity: item.quantity,
                            insert_datetime: moment().format("X")
                        }
                        if (item.type === "Tiffin") {
                            orderDetail.tiffin_id = item.tiffin_id;
                        } else {
                            orderDetail.product_id = item.product_id;
                        }
                        connection.query(`INSERT INTO tbl_order_detail SET ?`, orderDetail, (orderDetailError, orderDetailResult) => {
                            if (item.tiffin_detail_id && item.tiffin_detail_id.length > 0) {
                                asyncLoop(item.tiffin_detail_id, (tiffin, next) => {
                                    let tiffinDetail = {
                                        order_id: insertResult.insertId,
                                        detail_id: orderDetailResult.insertId,
                                        category_id: tiffin.tiffin_detail_id,
                                        quantity: tiffin.quantity,
                                        insert_datetime: moment().format("X")
                                    }
                                    connection.query(`INSERT INTO tbl_order_tiffin_detail SET ?`, tiffinDetail, (tiffinDetailError, tiffinDetailResult) => {
                                        next();
                                    })
                                }, () => {
                                    next();
                                })
                            } else {
                                next();
                            }
                        })
                    }, () => {
                        let { email, firstName, lastName, phone } = params.billing_details;
                        if (email) {
                            connection.query(`SELECT CONCAT(t.title," : ",IFNULL(GROUP_CONCAT(CONCAT(td.name,' ( Qty. ',otd.quantity,' )')),'')) AS name,od.quantity,t.price FROM tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id JOIN tbl_tiffins AS t ON t.id = od.tiffin_id JOIN tbl_order_tiffin_detail AS otd ON otd.detail_id = od.id JOIN tbl_tiffin_detail AS td ON td.id = otd.category_id JOIN tbl_tiffin_category AS tc ON tc.id = td.category_id WHERE o.is_active = 'Active' AND o.id = ${insertResult.insertId} AND tc.quantity != 0 GROUP BY od.id ORDER BY od.id DESC;`, (tiffinOrderError, tiffinOrderResult) => {
                                connection.query(`SELECT p.name,od.quantity,od.price FROM tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id JOIN tbl_product AS p ON p.id = od.product_id WHERE o.is_active = 'Active' AND o.id = ${insertResult.insertId} GROUP BY od.id ORDER BY od.id DESC;`, (trayOrderError, trayOrderResult) => {
                                    connection.query(`SELECT td.name,otd.quantity,td.price FROM tbl_order_tiffin_detail AS otd JOIN tbl_tiffin_detail AS td ON td.id = otd.category_id JOIN tbl_tiffin_category AS tc ON tc.id = td.category_id AND tc.quantity = 0 WHERE otd.order_id = ${insertResult.insertId};`, (extraTiffinOrderError, extraTiffinOrderResult) => {
                                        let orders = [...tiffinOrderResult, ...trayOrderResult, ...extraTiffinOrderResult];
                                        let orderHtml = ``;
                                        orders.map((element) => {
                                            orderHtml += `<tr>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">${element.name}</td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">${element.quantity}x</td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">$${element.price}</td>
                                                <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">$${element.price * element.quantity}</td>
                                              </tr>`
                                        })
                                        let emailDetail = {
                                            name: (firstName && lastName) ? firstName + lastName : ``,
                                            order_id: insertResult.insertId,
                                            mobile_number: phone,
                                            email: email,
                                            transaction_id: params.transaction_id,
                                            final_total: params.final_total.toFixed(2),
                                            sub_total: params.sub_total.toFixed(2),
                                            orders: orderHtml
                                        }
                                        let sendEmail = {
                                            email: `admin@tiffinmom.com`,
                                            password: `@Panna2020`
                                        };
                                        if ([1, "1"].includes(params.state_id)) {
                                            sendEmail.email = `orders.nj@tiffinmom.com`
                                            sendEmail.password = `@Panna2020`
                                        } else if ([3, "3"].includes(params.state_id)) {
                                            sendEmail.email = `orders.louis@tiffinmom.com`
                                            sendEmail.password = `desifoodgalaxy@2021`
                                        } else if ([4, "4"].includes(params.state_id)) {
                                            sendEmail.email = `orders.pitts@tiffinmom.com`
                                            sendEmail.password = `@Panna2020`
                                        }
                                        template.place_order(emailDetail, (html) => {
                                            send_email(APP_NAME, email, html, sendEmail).then((resClientEmail) => {
                                                send_email(APP_NAME, `admin@tiffinmom.com`, html, sendEmail).then((resAdminEmail) => {
                                                    send_email(APP_NAME, sendEmail.email, html, sendEmail).then((resStateEmail) => {
                                                        resolve()
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        } else {
                            resolve();
                        }
                    })
                } else {
                    reject()
                }
            })
        })
    },
}