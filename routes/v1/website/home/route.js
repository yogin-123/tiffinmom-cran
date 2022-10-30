const router = require('express').Router();
const model = require('./home_model');
const lang = require('../../../../config/language');
const { sendResponse, checkValidation } = require('../../../../config/common');

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Home Data                                        /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/home_data`, (request, response) => {
    let params = request.body;
    let rules = { state_id: "required" }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.home_data_list(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['home_list_su'], responseData);
        }).catch((error) => {
            sendResponse(response, 0, lang[request.language]['home_no_data'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                  FAQ's                                         /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/faqs`, (request, response) => {
    let params = request.body;
    let rules = {
        page: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.faq_list(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['faq_list_su'], responseData);
        }).catch((error) => {
            sendResponse(response, 0, lang[request.language]['faq_no_data'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                 Gallery                                        /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/gallery`, (request, response) => {
    let params = request.body;
    let rules = {
        page: "required",
        state_id: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.gallery(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['gallery_list_su'], responseData);
        }).catch((error) => {
            sendResponse(response, 2, lang[request.language]['gallery_list_not_found'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                             How It Work Page                                   /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/how_it_work_page`, (request, response) => {
    let params = request.body;
    let rules = { state_id: "required" }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.how_it_work_page_data(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['page_data'], responseData);
        }).catch((error) => {
            sendResponse(response, 0, lang[request.language]['page_not_found'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

module.exports = router;