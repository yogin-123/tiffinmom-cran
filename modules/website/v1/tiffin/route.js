const router = require('express').Router();
const model = require('./tiffin_model');
const lang = require('../../../../config/language');
const { sendResponse, checkValidation } = require('../../../../config/common');

router.get(`/tiffin_list/:state_id`, (request, response) => {
    model.tiffin_list(request.params).then((responseData) => {
        sendResponse(response, 1, lang[request.language]['tiffin_list'], responseData);
    }).catch((error) => {
        sendResponse(response, 2, lang[request.language]['no_tiffin'], null);
    })
});

router.post(`/tiffin_detail`, (request, response) => {
    let params = request.body;
    let rules = { tiffin_id: "required" }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.tiffin_detail(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['tiffin_detail'], responseData);
        }).catch((error) => {
            sendResponse(response, 2, lang[request.language]['tiffin_not_avaiable'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

module.exports = router;