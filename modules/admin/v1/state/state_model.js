let con = require('../../../../config/database');
let { PER_PAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

module.exports = {
    add_state(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                name: params.name,
                address: params.address,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO tbl_state SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    edit_state(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                name: params.name,
                address: params.address
            }
            con.query(`UPDATE tbl_state SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    change_state_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status
            }
            con.query(`UPDATE tbl_state SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    state_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND name LIKE '%${params.search}%' OR address LIKE '%${params.search}%'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY id DESC`;
            }
            con.query(`SELECT * FROM tbl_state WHERE is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(`tbl_state`, (count) => {
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