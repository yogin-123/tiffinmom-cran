let con = require('../../../../config/database');
let moment = require('moment');

module.exports = {
    orders_report(body) {
        return new Promise((resolve, reject) => {
            let start_date = body.start_date;
            let end_date = body.end_date;
            let state_id = body.state_id;
            let where = ``;
            if (start_date && end_date) {
                where = `AND o.insert_datetime >= ${moment(start_date).format("X")} AND o.insert_datetime <= ${moment(end_date).format("X")}`;
            }
            if (state_id) {
                where = `AND o.state_id = ${state_id}`;
            }
            con.query(`SELECT IFNULL(GROUP_CONCAT(CONCAT(td.name,' ( Qty. ',otd.quantity,' )')),'') AS tiffin_item,o.id,od.quantity,o.shipping_details,IF(IFNULL(p.name, '') = '',t.title,p.name) AS name,o.sub_total,od.price AS final_total,o.transaction_id,o.order_id FROM tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id LEFT JOIN tbl_product AS p ON p.id = od.product_id LEFT JOIN tbl_tiffins AS t ON t.id = od.tiffin_id LEFT JOIN tbl_order_tiffin_detail AS otd ON otd.detail_id = od.id LEFT JOIN tbl_tiffin_detail AS td ON td.id = otd.category_id WHERE o.is_active = 'Active' ${where} GROUP BY od.id ORDER BY od.id DESC;`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    resolve([])
                }
            })
        })
    },
    tray_menu_report(body) {
        return new Promise((resolve, reject) => {
            let start_date = body.start_date;
            let end_date = body.end_date;
            let state_id = body.state_id;
            let where = ``;
            if (start_date && end_date) {
                where = `AND o.insert_datetime >= ${moment(start_date).format("X")} AND o.insert_datetime <= ${moment(end_date).format("X")}`;
            }
            if (state_id) {
                where = `AND o.state_id = ${state_id}`;
            }
            con.query(`select p.name AS product_name,c.name AS category_name,SUM(od.quantity) AS quantity from tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id AND od.type = 'Single' JOIN tbl_product AS p ON p.id = od.product_id JOIN tbl_category AS c ON c.id =p.category_id WHERE o.is_active = 'Active' ${where} GROUP BY od.product_id ORDER BY o.id DESC;`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    resolve([])
                }
            })
        })
    },
    kitchen_report(body) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let tiffinWhere = ``;
            const { start_id: startId, end_id: endId, tiffin_id: tiffinId, state_id: stateId } = body;
            if (startId && endId) {
                where += ` AND o.id >= ${startId} AND o.id <= ${endId}`;
            }
            if (![0, -1, "0", "-1"].includes(tiffinId)) {
                tiffinWhere += ` AND od.tiffin_id = ${tiffinId}`;
            }
            if (stateId) {
                where += ` AND o.state_id = ${stateId}`;
            }
            con.query(`select o.id,td.name,SUM(otd.quantity  * od.quantity) quantity from tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id JOIN tbl_order_tiffin_detail AS otd ON otd.detail_id = od.id JOIN tbl_tiffin_detail AS td ON td.id = otd.category_id JOIN tbl_tiffin_category AS tc ON tc.id = td.category_id AND tc.quantity != 0 where o.is_active = 'Active' ${where} ${tiffinWhere} group by otd.category_id order by SUM(otd.quantity) desc;`, (mainItemError, mainItemResult) => {
                con.query(`select o.id,td.name,SUM(otd.quantity  * od.quantity) quantity from tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id JOIN tbl_order_tiffin_detail AS otd ON otd.detail_id = od.id JOIN tbl_tiffin_detail AS td ON td.id = otd.category_id JOIN tbl_tiffin_category AS tc ON tc.id = td.category_id AND tc.quantity = 0 where o.is_active = 'Active' ${where} ${tiffinWhere} group by otd.category_id order by SUM(otd.quantity) desc;`, (extraItemError, extraItemResult) => {
                    con.query(`select o.id,p.name,SUM(od.quantity) quantity from tbl_orders AS o JOIN tbl_order_detail AS od ON od.order_id = o.id AND od.tiffin_id = 0 AND od.product_id != 0 JOIN tbl_product AS p ON p.id = od.product_id where o.is_active = 'Active' ${where} group by p.id order by SUM(od.quantity) desc;`, (trayItemError, trayItemResult) => {
                        let kitchenResport = {
                            mail_item: [],
                            extra_item: [],
                            tray_item: []
                        }
                        if (!mainItemError && mainItemResult[0]) {
                            kitchenResport.mail_item = mainItemResult;
                        }
                        if (!extraItemError && extraItemResult[0]) {
                            kitchenResport.extra_item = extraItemResult;
                        }
                        if (!trayItemError && trayItemResult[0]) {
                            kitchenResport.tray_item = trayItemResult;
                        }
                        resolve(kitchenResport)
                    })
                })
            })
        })
    },
    revenu_report(body) {
        return new Promise((resolve, reject) => {
            let where = ``;
            let state_id = body.state_id;
            let start_date = body.start_date;
            let end_date = body.end_date;
            if (start_date && end_date) {
                where = `AND insert_datetime >= ${moment(start_date).format("X")} AND insert_datetime <= ${moment(end_date).format("X")}`;
            }
            if (state_id) {
                where = `AND state_id = ${state_id}`;
            }
            con.query(`SELECT SUM(final_total) AS total,DATE_FORMAT(FROM_UNIXTIME(insert_datetime),'%d-%m-%Y') AS order_date,COUNT(id) AS total_orders FROM tbl_orders WHERE is_active = 'Active' ${where} GROUP BY DATE_FORMAT(FROM_UNIXTIME(insert_datetime),'%d-%m-%Y') ORDER BY id DESC;`, (dateWiseError, dateWiseResult) => {
                con.query(`SELECT SUM(final_total) AS total,DATE_FORMAT(FROM_UNIXTIME(insert_datetime), '%m') AS order_month,DATE_FORMAT(FROM_UNIXTIME(insert_datetime), '%Y') AS order_year,COUNT(id) AS total_orders FROM tbl_orders WHERE is_active = 'Active' ${where} GROUP BY DATE_FORMAT(FROM_UNIXTIME(insert_datetime), '%m') ORDER BY id DESC;`, (monthWiseError, monthWiseResult) => {
                    con.query(`SELECT SUM(final_total) AS total,DATE_FORMAT(FROM_UNIXTIME(insert_datetime), '%Y') AS order_year,COUNT(id) AS total_orders FROM tbl_orders WHERE is_active = 'Active' ${where} GROUP BY DATE_FORMAT(FROM_UNIXTIME(insert_datetime), '%Y') ORDER BY id DESC;`, (yearWiseError, yearWiseResult) => {
                        let revenuReport = {
                            date_wise: [],
                            month_wise: [],
                            year_wise: []
                        }
                        if (!dateWiseError && dateWiseResult[0]) {
                            revenuReport.date_wise = dateWiseResult;
                        }
                        if (!monthWiseError && monthWiseResult[0]) {
                            revenuReport.month_wise = monthWiseResult;
                        }
                        if (!yearWiseError && yearWiseResult[0]) {
                            revenuReport.year_wise = yearWiseResult;
                        }
                        resolve(revenuReport);
                    })
                })
            })
        })
    },
    user_report(body) {
        return new Promise((resolve, reject) => {
            con.query(`select u.id,u.first_name,u.last_name,u.email,u.insert_datetime,COUNT(o.id) AS total_order from tbl_user AS u JOIN tbl_orders AS o ON o.user_id = u.id GROUP BY u.id ORDER BY u.id DESC;`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result);
                } else {
                    reject();
                }
            })
        })
    }
}