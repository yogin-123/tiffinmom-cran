let con = require('../../../../config/database');
let { PER_PAGE, S3_URL, SLIDER_IMAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

let tbl_slider = `tbl_slider`;
let tbl_state = `tbl_state`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                 Add Slider                                     /////
    //////////////////////////////////////////////////////////////////////////////////////////
    add_slider(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                title: params.title,
                description: params.description,
                media_name: params.media_name,
                media_type: params.media_type,
                state_id: params.state_id,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO ${tbl_slider} SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Edit Slider                                     /////
    //////////////////////////////////////////////////////////////////////////////////////////
    edit_slider(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                title: params.title,
                description: params.description,
                media_name: params.media_name,
                media_type: params.media_type,
                state_id: params.state_id,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_slider} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                            Change Slider Status                                /////
    //////////////////////////////////////////////////////////////////////////////////////////
    change_slider_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_slider} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Slider List                                     /////
    //////////////////////////////////////////////////////////////////////////////////////////
    slider_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND title LIKE '%${params.search}%'`;
            }
            if(params.state_id){
                where += `AND state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY slider.id DESC`;
            }
            con.query(`SELECT slider.id,title,state_id,description,media_name,CONCAT('${S3_URL + SLIDER_IMAGE}',media_name) AS media_link,media_type,slider.is_active,slider.insert_datetime,state.name AS state_name FROM ${tbl_slider} AS slider JOIN ${tbl_state} AS state ON state.id = slider.state_id WHERE slider.is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(tbl_slider, (count) => {
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