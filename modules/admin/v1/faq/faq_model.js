let con = require('../../../../config/database');
let { PER_PAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

let tbl_faqs = `tbl_faqs`;
let tbl_state = `tbl_state`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                  Add FAQ                                       /////
    //////////////////////////////////////////////////////////////////////////////////////////
    add_faq(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                state_id: params.state_id,
                question: params.question,
                answer: params.answer,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO ${tbl_faqs} SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                  Edit FAQ                                      /////
    //////////////////////////////////////////////////////////////////////////////////////////
    edit_faq(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                state_id: params.state_id,
                question: params.question,
                answer: params.answer,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_faqs} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                              Change FAQ Status                                 /////
    //////////////////////////////////////////////////////////////////////////////////////////
    change_faq_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_faqs} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                  FAQ List                                      /////
    //////////////////////////////////////////////////////////////////////////////////////////
    faq_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND question LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY f.id DESC`;
            }
            con.query(`SELECT f.id,f.question,f.state_id,f.answer,f.is_active,f.insert_datetime,s.name AS state_name FROM ${tbl_faqs} AS f JOIN ${tbl_state} AS s ON s.id = f.state_id WHERE f.is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(tbl_faqs, (count) => {
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