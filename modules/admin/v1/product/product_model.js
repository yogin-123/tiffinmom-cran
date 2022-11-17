let con = require('../../../../config/database');
let { PER_PAGE, S3_URL, PRODUCT_IMAGE } = require('../../../../config/constants');
let moment = require('moment');
let { totalCount } = require('../../../../config/common');

let tbl_product = `tbl_product`;
let tbl_state = `tbl_state`;
let tbl_category = `tbl_category`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Add Product                                     /////
    //////////////////////////////////////////////////////////////////////////////////////////
    add_product(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                state_id: params.state_id,
                image: params.image,
                name: params.name,
                price: params.price,
                category_id: params.category_id,
                insert_datetime: moment().format("X")
            }
            if (params.description) {
                insertData.description = params.description
            }
            con.query(`INSERT INTO ${tbl_product} SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                 Edit Product                                   /////
    //////////////////////////////////////////////////////////////////////////////////////////
    edit_product(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                state_id: params.state_id,
                name: params.name,
                price: params.price,
                description: '',
                category_id: params.category_id,
                update_datetime: moment().format("X")
            }
            if (params.description) {
                updateData.description = params.description
            }
            con.query(`UPDATE ${tbl_product} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                           Change Product Status                                /////
    //////////////////////////////////////////////////////////////////////////////////////////
    change_product_status(params) {
        return new Promise((resolve, reject) => {
            let updateData = {
                is_active: params.status,
                update_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_product} SET ? WHERE id = ${params.id}`, updateData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Product List                                    /////
    //////////////////////////////////////////////////////////////////////////////////////////
    product_list(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let order_by = ``;
            if (params.search) {
                where += `AND p.name LIKE '%${params.search}%'`;
            }
            if (params.state_id) {
                where += `AND p.state_id = '${params.state_id}'`;
            }
            if (params.sort_by_column && params.sort_by_order) {
                order_by = `ORDER BY ${params.sort_by_column} ${params.sort_by_order}`;
            } else {
                order_by = `ORDER BY p.id DESC`;
            }
            con.query(`SELECT p.id,p.state_id,p.category_id,p.name,p.price,p.description,CONCAT('${S3_URL + PRODUCT_IMAGE}',p.image) AS image,p.is_active,p.insert_datetime,s.name AS state_name,c.name AS category_name FROM ${tbl_product} AS p JOIN ${tbl_state} AS s ON s.id = p.state_id JOIN ${tbl_category} AS c ON c.id = p.category_id WHERE p.is_active != 'Delete' ${where} ${order_by} LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`, (error, result) => {
                if (!error && result[0]) {
                    totalCount(tbl_product, (count) => {
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