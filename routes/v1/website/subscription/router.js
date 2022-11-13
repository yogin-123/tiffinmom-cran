const router = require('express').Router();
const model = require('./subscription_model');
const lang = require('../../../../config/language');
const { sendResponse, checkValidation } = require('../../../../config/common');

router.post(`/subscription_list`, (request, response) => {
    let params = request.body;
    let rules = { state_id: "required" }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.subscription_list(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['subscription_list'], responseData);
        }).catch((error) => {
            sendResponse(response, 2, lang[request.language]['no_subscription'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

router.post(`/user_subscription`, (request, response) => {
    let params = request.body;
    let rules = {
        transaction_id: "required",
        subscription_id: "required",
        price: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        params.login_user_id = request.login_user_id;
        model.subscription_added(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['subscription_list'], responseData);
        }).catch((error) => {
            sendResponse(response, 2, lang[request.language]['no_subscription'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

router.get(`/my_subscription`, (request, response) => {
    model.my_subscription(request.login_user_id).then((responseData) => {
        sendResponse(response, 1, lang[request.language]['my_subscription_list'], responseData);
    }).catch((error) => {
        sendResponse(response, 2, lang[request.language]['no_subscription'], null);
    })
});

module.exports = router;