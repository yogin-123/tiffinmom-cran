let con = require('../../../../config/database');
let { PER_PAGE, S3_URL, USER_IMAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

let tbl_user = `tbl_user`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                            Change User Status                                  /////
    //////////////////////////////////////////////////////////////////////////////////////////
    change_user_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_user} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                 User List                                      /////
    //////////////////////////////////////////////////////////////////////////////////////////
    user_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND first_name LIKE '%${params.search}%' AND last_name LIKE '%${params.search}%' AND email LIKE '%${params.search}%'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY id DESC`;
            }
            con.query(`SELECT id,first_name,last_name,email,CONCAT('${S3_URL + USER_IMAGE}',profile_image) AS profile_image,is_active,insert_datetime FROM ${tbl_user} WHERE is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(tbl_user, (count) => {
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
    full_user_list() {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id,first_name,last_name,email FROM ${tbl_user} WHERE is_active = 'Active' ORDER BY id DESC`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    reject();
                }
            })
        })
    },
}