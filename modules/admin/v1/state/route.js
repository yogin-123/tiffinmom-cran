const lang = require('../../../../config/language');
const model = require('./state_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/add_state", (req, res) => {
    let params = req.body;
    let rules = {
        name: "required",
        address: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_state(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['state_created'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['state_not_created'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/edit_state", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        name: "required",
        address: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_state(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['state_updated'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['state_not_updated'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_state_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_state_status(params).then((response) => {
            let message = lang[req.language]['state_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['state_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/state_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.state_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['state_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['state_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/full_state_list", (req, res) => {
        model.full_state_list().then((response) => {
            sendResponse(res, 1, lang[req.language]['state_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['state_list_not_found'], null);
        })
})

module.exports = router;