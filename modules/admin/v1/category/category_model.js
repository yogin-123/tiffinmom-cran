let con = require('../../../../config/database');
let { PER_PAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

let tbl_category = `tbl_category`;
let tbl_state = `tbl_state`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Add Category                                    /////
    //////////////////////////////////////////////////////////////////////////////////////////
    add_category(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                state_id: params.state_id,
                name: params.name,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO ${tbl_category} SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                 Edit Category                                  /////
    //////////////////////////////////////////////////////////////////////////////////////////
    edit_category(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                state_id: params.state_id,
                name: params.name,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_category} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                           Change Category Status                               /////
    //////////////////////////////////////////////////////////////////////////////////////////
    change_category_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_category} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Category List                                   /////
    //////////////////////////////////////////////////////////////////////////////////////////
    category_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND name LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY id DESC`;
            }
            let limit = ``;
            if (params.page && params.page !== -1) {
                limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`;
            }
            con.query(`SELECT c.id,c.state_id,c.name,c.is_active,c.insert_datetime,s.name AS state_name FROM ${tbl_category} AS c JOIN ${tbl_state} AS s ON s.id = c.state_id WHERE c.is_active != 'Delete' ${where} ${order_by} `, (error, result) => {
                if (!error && result[0]) {
                    totalCount(tbl_category, (count) => {
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
}