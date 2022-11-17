const lang = require('../../../../config/language');
const model = require('./promocode_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/add_promocode", (req, res) => {
    let params = req.body;
    let rules = {
        state_id: "required",
        promocode: "required",
        value: "required",
        limit_per_user: "required",
        start_date: "required",
        end_date: "required",
        description: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        model.unique_promocode(params).then((uniqueResponse) => {
            params.login_user_id = req.login_user_id;
            model.add_promocode(params).then((response) => {
                sendResponse(res, 1, lang[req.language]['promocode_created'], null);
            }).catch((error) => {
                sendResponse(res, 0, lang[req.language]['promocode_not_created'], null);
            })
        }).catch((uniqueError) => {
            sendResponse(res, 0, lang[req.language]['unique_promocode'].replace('{val}', params.email), null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/edit_promocode", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        state_id: "required",
        promocode: "required",
        value: "required",
        limit_per_user: "required",
        start_date: "required",
        end_date: "required",
        description: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        model.edit_unique_promocode(params).then((uniqueResponse) => {
            params.login_user_id = req.login_user_id;
            model.edit_promocode(params).then((response) => {
                sendResponse(res, 1, lang[req.language]['promocode_detail_updated'], null);
            }).catch((error) => {
                sendResponse(res, 0, lang[req.language]['promocode_not_updated'], null);
            })
        }).catch((uniqueError) => {
            sendResponse(res, 0, lang[req.language]['unique_promocode'].replace('{val}', params.email), null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_promocode_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_promocode_status(params).then((response) => {
            let message = lang[req.language]['promocode_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['promocode_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/promocode_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.promocode_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['promocode_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['promocode_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;