let con = require('../../../../config/database');
let { PER_PAGE, S3_URL, GALLERY_IMAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

let tbl_gallery = `tbl_gallery`;
let tbl_state = `tbl_state`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Add Gallery                                     /////
    //////////////////////////////////////////////////////////////////////////////////////////
    add_gallery(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                title: params.category,
                media_name: params.media_name,
                media_type: params.media_type,
                state_id: params.state_id,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO ${tbl_gallery} SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Edit Gallery                                    /////
    //////////////////////////////////////////////////////////////////////////////////////////
    edit_gallery(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                title: params.category,
                media_name: params.media_name,
                media_type: params.media_type,
                state_id: params.state_id,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_gallery} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                            Change Gallery Status                               /////
    //////////////////////////////////////////////////////////////////////////////////////////
    change_gallery_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_gallery} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Gallery List                                    /////
    //////////////////////////////////////////////////////////////////////////////////////////
    gallery_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND title LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY gallery.id DESC`;
            }
            con.query(`SELECT gallery.id,title AS category,state_id,media_name,CONCAT('${S3_URL + GALLERY_IMAGE}',media_name) AS media_link,media_type,gallery.is_active,gallery.insert_datetime,state.name AS state_name FROM ${tbl_gallery} AS gallery JOIN ${tbl_state} AS state ON state.id = gallery.state_id WHERE gallery.is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(tbl_gallery, (count) => {
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