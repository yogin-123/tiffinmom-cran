const lang = require('../../../../config/language');
const model = require('./faq_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                                 Add FAQ                                        /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/add_faq", (req, res) => {
    let params = req.body;
    let rules = {
        question: "required",
        answer: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_faq(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['faq_added_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['faq_added_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                                  Edit FAQ                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/edit_faq", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        question: "required",
        answer: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_faq(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['faq_updated_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['faq_updated_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                             Change FAQ Status                                  /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_faq_status", (req, res) => {
    let params = req.body;
    const rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_faq_status(params).then((response) => {
            let message = lang[req.language]['faq_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['faq_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                                 FAQ List                                       /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/faq_list", (req, res) => {
    let params = req.body;
    const rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.faq_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['faq_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['faq_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;