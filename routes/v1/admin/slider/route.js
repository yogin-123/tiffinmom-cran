const lang = require('../../../../config/language');
const model = require('./slider_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Add Slider                                       /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/add_slider", (req, res) => {
    let params = req.body;
    let rules = {
        title: "required",
        description: "required",
        media_name: "required",
        media_type: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_slider(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['slider_added_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['slider_added_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Edit Slider                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/edit_slider", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        title: "required",
        description: "required",
        media_name: "required",
        media_type: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_slider(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['slider_updated_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['slider_updated_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                           Change Slider Status                                 /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_slider_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_slider_status(params).then((response) => {
            let message = lang[req.language]['slider_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['slider_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Slider List                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/slider_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.slider_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['slider_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['slider_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;