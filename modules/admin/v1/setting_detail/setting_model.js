let con = require('../../../../config/database');
let moment = require('moment');

let tbl_setting_details = `tbl_setting_details`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                             How It Work Page                                   /////
    //////////////////////////////////////////////////////////////////////////////////////////
    how_it_work_page(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id FROM ${tbl_setting_details} WHERE attribute_name = 'how_it_work' LIMIT 1`, (error, result) => {
                if (!error && result[0]) {
                    let updateData = {
                        state_id: params.state_id,
                        attribute_value: params.data,
                        update_datetime: moment().format("X")
                    }
                    con.query(`UPDATE ${tbl_setting_details} SET ? WHERE id = ${result[0].id}`, updateData, (error, result) => {
                        if (!error) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                } else {
                    let insertData = {
                        user_id: params.login_user_id,
                        state_id: params.state_id,
                        attribute_name: 'how_it_work',
                        attribute_value: params.data,
                        insert_datetime: moment().format("X")
                    }
                    con.query(`INSERT INTO ${tbl_setting_details} SET ?`, insertData, (error, result) => {
                        if (!error) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                            Get Page Data                                       /////
    //////////////////////////////////////////////////////////////////////////////////////////
    get_page_data(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT attribute_value FROM ${tbl_setting_details} WHERE attribute_name = '${params.page_name}' LIMIT 1`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result[0].attribute_value)
                } else {
                    reject();
                }
            })
        })
    },
}