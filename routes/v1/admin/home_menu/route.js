const lang = require('../../../../config/language');
const model = require('./home_menu_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/edit_menu", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        state_id: "required",
        name: "required",
        menu: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_menu(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['menu_updated_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['menu_updated_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_menu_status", (req, res) => {
    let params = req.body;
    const rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_menu_status(params).then((response) => {
            let message = lang[req.language]['menu_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['menu_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/menu_list", (req, res) => {
    let params = req.body;
    const rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.menu_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['menu_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['menu_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;