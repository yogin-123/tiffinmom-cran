const connection = require('../../../../config/database');
const asyncLoop = require('node-async-loop');
let { S3_URL, TIFFIN_IMAGE } = require('../../../../config/constants');

module.exports = {
    tiffin_list(params) {
        return new Promise((resolve, reject) => {
            let state_id = params.state_id;
            let where = ``;
            if(state_id){
                where = `AND state_id = ${state_id}`;
            }
            connection.query(`SELECT CONCAT('${S3_URL + TIFFIN_IMAGE}',image) AS image,id,title,delivery_on,price,description FROM tbl_tiffins WHERE is_active = 'Active' ${where}`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    reject()
                }
            })
        })
    },
    tiffin_detail(params) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT CONCAT('${S3_URL + TIFFIN_IMAGE}',image) AS image,id,title,delivery_on,price,description FROM tbl_tiffins WHERE is_active = 'Active' AND id = ${params.tiffin_id} LIMIT 1`, (error, result) => {
                if (!error && result[0]) {
                    connection.query(`SELECT tc.id,tc.name,tc.quantity FROM tbl_tiffin_detail AS td JOIN tbl_tiffin_category AS tc ON tc.id = td.category_id WHERE tc.is_active = 'Active' AND td.is_active = 'Active' AND td.tiffin_id = ${params.tiffin_id} GROUP BY td.category_id`, (categoryError, categoryResult) => {
                        if (!categoryError && categoryResult[0]) {
                            asyncLoop(categoryResult, (item, next) => {
                                connection.query(`SELECT id,name,price FROM tbl_tiffin_detail WHERE is_active = 'Active' AND tiffin_id = ${params.tiffin_id} AND category_id = ${item.id}`, (itemsError, itemResult) => {
                                    if (!itemsError && itemResult[0]) {
                                        item.item = itemResult;
                                    }
                                    next()
                                })
                            }, () => {
                                result[0].category = categoryResult
                                resolve(result[0])
                            })
                        } else {
                            reject();
                        }
                    })
                } else {
                    reject()
                }
            })
        })
    }
}