const lang = require('../../../../config/language');
const model = require('./gallery_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Add Gallery                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/add_gallery", (req, res) => {
    let params = req.body;
    let rules = {
        category: "required",
        media_name: "required",
        media_type: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_gallery(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['gallery_added_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['gallery_added_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Edit Gallery                                    /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/edit_gallery", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        category: "required",
        media_name: "required",
        media_type: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_gallery(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['gallery_updated_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['gallery_updated_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                           Change Gallery Status                                /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_gallery_status", (req, res) => {
    let params = req.body;
    const rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_gallery_status(params).then((response) => {
            let message = lang[req.language]['gallery_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['gallery_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Gallery List                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/gallery_list", (req, res) => {
    let params = req.body;
    const rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.gallery_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['gallery_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['gallery_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;