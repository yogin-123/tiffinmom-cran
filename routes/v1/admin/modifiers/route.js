const lang = require('../../../../config/language');
const modifiers_model = require('./modifiers_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                              Add Modifiers Set                                 /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/add_modifiers_set", function (req, res) {
    let params = req.body;
    if (params.modifiers_sets !== []) {
        params.login_user_id = req.login_user_id;
        modifiers_model.add_modifiers_set(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['modifiers_set_added_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['modifiers_set_added_un'], null);
        })
    } else {
        sendResponse(res, 0, lang[req.language]['text_sql_err'], null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                             Edit Modifiers Set                                 /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/edit_modifiers_set", function (req, res) {
    let params = req.body;
    const rules = {
        id: "required",
        name: "required",
        sorting_number: "required",
        price: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        modifiers_model.edit_modifiers_set(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['modifiers_set_updated_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['modifiers_set_updated_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                         Change Modifiers Set Status                            /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_modifiers_set_status", function (req, res) {
    let params = req.body;
    const rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        modifiers_model.change_modifiers_set_status(params).then((response) => {
            let message = lang[req.language]['modifiers_set_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['modifiers_set_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                            Modifiers Set List                                  /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/modifiers_set_list", function (req, res) {
    let params = req.body;
    const rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        modifiers_model.modifiers_set_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['modifiers_set_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['modifiers_set_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                              Add Modifiers                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/add_modifiers", function (req, res) {
    let params = req.body;
    const rules = {
        name: "required",
        required_number: "required",
        sorting_number: "required",
        toppings_ids: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        modifiers_model.add_modifiers(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['modifiers_added_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['modifiers_added_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Edit Modifiers                                   /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/edit_modifiers", function (req, res) {
    let params = req.body;
    const rules = {
        id: "required",
        name: "required",
        required_number: "required",
        sorting_number: "required",
        toppings_ids: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        modifiers_model.edit_modifiers(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['modifiers_updated_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['modifiers_updated_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                          Change Modifiers Status                               /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_modifiers_status", function (req, res) {
    let params = req.body;
    const rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        modifiers_model.change_modifiers_status(params).then((response) => {
            let message = lang[req.language]['modifiers_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['modifiers_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                             Modifiers List                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/modifiers_list", function (req, res) {
    let params = req.body;
    const rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        modifiers_model.modifiers_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['modifiers_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['modifiers_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;