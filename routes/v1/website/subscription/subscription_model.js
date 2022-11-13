const connection = require('../../../../config/database');
const moment = require('moment');

module.exports = {
    subscription_list(params) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT p.id,p.name,p.price,p.description,p.tiffin_id,p.quantity,t.title FROM tbl_subscription_plan AS p JOIN tbl_tiffins AS t ON t.id = p.tiffin_id WHERE p.is_active = 'Active' AND p.state_id = ${params.state_id}`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    reject()
                }
            })
        })
    },
    subscription_added(params) {
        return new Promise((resolve, reject) => {
            let insertData = {
                user_id: params.login_user_id,
                transaction_id: params.transaction_id,
                subscription_id: params.subscription_id,
                price: params.price,
                insert_datetime: moment().format("X")
            }
            connection.query(`INSERT INTO tbl_user_subscription SET ?`, insertData, (error, result) => {
                if (!error) {
                    resolve();
                } else {
                    reject();
                }
            })
        })
    },
    my_subscription(user_id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT us.id,sp.name,us.price,sp.description,us.insert_datetime,sp.quantity,us.use_quantity FROM tbl_user_subscription AS us JOIN tbl_subscription_plan AS sp ON sp.id = us.subscription_id WHERE us.user_id = ${user_id}`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result);
                } else {
                    reject();
                }
            })
        })
    }
}