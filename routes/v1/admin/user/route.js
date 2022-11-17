const lang = require('../../../../config/language');
const model = require('./user_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                                 User List                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/user_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.user_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['user_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['user_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/full_user_list", (req, res) => {
    model.full_user_list().then((response) => {
        sendResponse(res, 1, lang[req.language]['user_list_su'], response);
    }).catch((error) => {
        sendResponse(res, 0, lang[req.language]['user_list_not_found'], null);
    })
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                            Change User Status                                  /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_user_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_user_status(params).then((response) => {
            let message = lang[req.language]['user_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['user_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;