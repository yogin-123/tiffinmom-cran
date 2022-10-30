const lang = require('../../../../config/language');
const model = require('./order_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/change_order_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_order_status(params).then((response) => {
            let message = lang[req.language]['order_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['order_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/order_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.order_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['order_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 2, lang[req.language]['no_order'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post(`/place_order`, (request, response) => {
    let params = request.body;
    let rules = {
        state_id: "required",
        billing_details: "required",
        shipping_details: "required",
        sub_total: "required",
        shipping_charge: "required",
        final_total: "required",
        products: "required",
        transaction_id: "required",
        order_id: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.place_order(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['order_place_su'], null);
        }).catch((error) => {
            sendResponse(response, 0, lang[request.language]['order_place_un'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
})

module.exports = router;