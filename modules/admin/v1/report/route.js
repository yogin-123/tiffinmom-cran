const model = require('./report_model');
const moment = require('moment');
const excel = require("exceljs");
const { sendResponse } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/orders_report", (req, res) => {
    model.orders_report(req.body).then((response) => {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Report");
        worksheet.columns = [
            { header: "Order Number", key: "id" },
            { header: "First Name", key: "first_name" },
            { header: "Last Name", key: "last_name" },
            { header: "Email", key: "email" },
            { header: "Address", key: "address" },
            { header: "State", key: "state" },
            { header: "City", key: "city" },
            { header: "Post Code", key: "post_code" },
            { header: "Mobile Number", key: "phone" },
            { header: "Item Name", key: "name" },
            { header: "Item Quantity", key: "quantity" },
            { header: "Tiffin Items", key: "tiffin_item" }
        ];

        let report = response.map((element) => {
            let shipping_details = JSON.parse(element.shipping_details);
            element.first_name = shipping_details.firstName;
            element.last_name = shipping_details.lastName;
            element.email = shipping_details.email;
            element.address = `${(shipping_details.address1) ? shipping_details.address1 : ''} ${(shipping_details.address2) ? shipping_details.address2 : ''}`;
            element.state = (shipping_details.state) ? shipping_details.state : '';
            element.city = (shipping_details.city) ? shipping_details.city : '';
            element.post_code = (shipping_details.postCode) ? shipping_details.postCode : '';
            return element;
        });

        worksheet.addRows(report);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=orders-report-${moment().format('DD-MM-YYYY-hh-mm-ss')}.xlsx`
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end()
        })
    }).catch((error) => {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Report");

        worksheet.columns = [
            { header: "Order Number", key: "id" },
            { header: "First Name", key: "first_name" },
            { header: "Last Name", key: "last_name" },
            { header: "Email", key: "email" },
            { header: "Address", key: "address" },
            { header: "State", key: "state" },
            { header: "City", key: "city" },
            { header: "Post Code", key: "postCode" },
            { header: "Mobile Number", key: "phone" },
            { header: "Item Name", key: "name" },
            { header: "Item Quantity", key: "quantity" },
            { header: "Tiffin Items", key: "tiffin_item" }
        ];

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=orders-report-${moment().format('DD-MM-YYYY-hh-mm-ss')}.xlsx`
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end()
        })
    })
})

router.post("/tray_report", (req, res) => {
    model.tray_menu_report(req.body).then((response) => {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Report");

        worksheet.columns = [
            { header: "Product Name", key: "product_name" },
            { header: "Category Name", key: "category_name" },
            { header: "Quantity", key: "quantity" }
        ];

        worksheet.addRows(response);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=tray-report-${moment().format('DD-MM-YYYY-hh-mm-ss')}.xlsx`
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end()
        })
    }).catch((error) => {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Report");

        worksheet.columns = [
            { header: "Product Name", key: "product_name" },
            { header: "Category Name", key: "category_name" },
            { header: "Quantity", key: "quantity" }
        ];

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=tray-report-${moment().format('DD-MM-YYYY-hh-mm-ss')}.xlsx`
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end()
        })
    })
})

router.post("/kitchen_report", (req, res) => {
    model.kitchen_report(req.body).then((response) => {
        sendResponse(res, 1, 'data', response);
    }).catch(() => {
        sendResponse(res, 0, 'no data', null);
    })
})

router.post("/revenu_report", (req, res) => {
    model.revenu_report(req.body).then((response) => {
        sendResponse(res, 1, 'data', response)
    }).catch(() => {
        sendResponse(res, 0, 'no data', null)
    })
})

router.post("/user_report", (req, res) => {
    model.user_report(req.body).then((response) => {
        sendResponse(res, 1, 'data', response)
    }).catch(() => {
        sendResponse(res, 0, 'No data', null)
    })
})

module.exports = router;