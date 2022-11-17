const lang = require('../../../../config/language');
const model = require('./subscription_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/add_subscription", (req, res) => {
    let params = req.body;
    let rules = {
        state_id: "required",
        name: "required",
        price: "required",
        description: "required",
        tiffin_id: "required",
        quantity: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_subscription(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['subscription_created'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['subscription_not_created'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/edit_subscription", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        state_id: "required",
        name: "required",
        price: "required",
        description: "required",
        tiffin_id: "required",
        quantity: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_subscription(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['subscription_updated'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['subscription_not_updated'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_subscription_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_subscription_status(params).then((response) => {
            let message = lang[req.language]['subscription_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['subscription_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/subscription_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.subscription_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['subscription_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['subscription_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/full_subscription_list", (req, res) => {
    let params = req.body;
    let rules = { state_id: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.full_subscription_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['subscription_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['subscription_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post(`/custom_user_subscription`, (request, response) => {
    let params = request.body;
    let rules = {
        user_id: "required",
        transaction_id: "required",
        subscription_id: "required",
        price: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        params.login_user_id = request.login_user_id;
        model.subscription_added(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['subscription_list'], responseData);
        }).catch((error) => {
            sendResponse(response, 2, lang[request.language]['no_subscription'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

module.exports = router;