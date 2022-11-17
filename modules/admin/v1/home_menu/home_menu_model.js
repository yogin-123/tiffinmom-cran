let con = require('../../../../config/database');
let { PER_PAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

module.exports = {
    edit_menu(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                id: params.id,
                state_id: params.state_id,
                name: params.name,
                data: JSON.stringify(params.menu),
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE tbl_home_menu SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    change_menu_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE tbl_home_menu SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    menu_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND m.name LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND m.state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY m.id DESC`;
            }
            con.query(`SELECT m.*,s.name AS state_name FROM tbl_home_menu AS m JOIN tbl_state AS s ON s.id = m.state_id WHERE m.is_active != 'Delete' ${where} ${order_by}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(`tbl_home_menu`, (count) => {
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