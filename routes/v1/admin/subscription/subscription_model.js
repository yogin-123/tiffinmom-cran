let con = require('../../../../config/database');
let { PER_PAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

module.exports = {
    add_subscription(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                state_id: params.state_id,
                name: params.name,
                price: params.price,
                description: params.description,
                tiffin_id: params.tiffin_id,
                quantity: params.quantity,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO tbl_subscription_plan SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    edit_subscription(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                state_id: params.state_id,
                name: params.name,
                price: params.price,
                description: params.description,
                tiffin_id: params.tiffin_id,
                quantity: params.quantity,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE tbl_subscription_plan SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    change_subscription_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE tbl_subscription_plan SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    subscription_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND name LIKE '%${params.search}%'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY id DESC`;
            }
            con.query(`SELECT * FROM tbl_subscription_plan WHERE is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(`tbl_subscription_plan`, (count) => {
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
    full_subscription_list(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM tbl_subscription_plan WHERE is_active = 'Active' AND state_id = ${params.state_id} ORDER BY id DESC`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    reject();
                }
            })
        })
    },
    subscription_added(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.user_id,
                transaction_id: params.transaction_id,
                subscription_id: params.subscription_id,
                price: params.price,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO tbl_user_subscription SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
}