let con = require('../../../../config/database');
let { PER_PAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

module.exports = {
    unique_promocode(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id FROM tbl_promocode WHERE promocode = '${params.promocode}' LIMIT 1`, (err, result) => {
                if (result.length > 0) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    },

    add_promocode(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                state_id: params.state_id,
                promocode: params.promocode,
                value: params.value,
                limit_per_user: params.limit_per_user,
                start_date: params.start_date,
                end_date: params.end_date,
                description: params.description,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO tbl_promocode SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    edit_unique_promocode(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id FROM tbl_promocode WHERE promocode = "${params.promocode}" LIMIT 1`, (err, result) => {
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
    edit_promocode(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                state_id: params.state_id,
                state_id: params.state_id,
                promocode: params.promocode,
                value: params.value,
                limit_per_user: params.limit_per_user,
                start_date: params.start_date,
                end_date: params.end_date,
                description: params.description,
                update_datetime: moment().format("X")
            }
            if (params.profile_image) {
                updateData.profile_image = params.profile_image;
            }
            if (params.password) {
                updateData.password = params.password;
            }
            con.query(`UPDATE tbl_promocode SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    change_promocode_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE tbl_promocode SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    promocode_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND p.promocode LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND p.state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY p.id DESC`;
            }
            con.query(`SELECT p.*,s.name AS state_name FROM tbl_promocode AS p JOIN tbl_state AS s ON s.id = p.state_id WHERE p.is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(`tbl_promocode`, (count) => {
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