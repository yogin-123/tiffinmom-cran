let con = require('../../../../config/database');

let total_admin = `total_admin`;
let tbl_modifiers = `tbl_modifiers`;
let tbl_modifiers_set = `tbl_modifiers_set`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                             Dashboard Totals                                  /////
    //////////////////////////////////////////////////////////////////////////////////////////
    dashboard_totals() {
        return new Promise((resolve, reject) => {
            con.query(`
            SELECT 
            (SELECT COUNT(id) FROM ${total_admin} WHERE id != 1) AS total_admin,
            (SELECT COUNT(id) FROM ${tbl_modifiers}) AS total_modifiers,
            (SELECT COUNT(id) FROM ${tbl_modifiers_set}) AS total_modifiers_set`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result);
                } else {
                    reject();
                }
            })
        })
    },
}