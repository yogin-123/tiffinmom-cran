const lang = require('../../../../config/language');
const model = require('./setting_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                             How It Work Page                                   /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/how_it_work_page", (req, res) => {
    let params = req.body;
    let rules = {
        state_id: "required",
        data: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.how_it_work_page(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['data_added_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['data_added_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                            Get Page Data                                       /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/get_page_data", (req, res) => {
    let params = req.body;
    const rules = { page_name: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.get_page_data(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['page_data'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['page_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;