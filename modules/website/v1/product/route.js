const router = require('express').Router();
const model = require('./product_model');
const lang = require('../../../../config/language');
const { sendResponse, checkValidation } = require('../../../../config/common');

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Category List                                    /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/category_list`, (request, response) => {
    let params = request.body;
    let rules = { state_id: "required" }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.categorys(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['category_list_su'], responseData);
        }).catch((error) => {
            sendResponse(response, 2, lang[request.language]['category_list_not_found'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Product List                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/product_list`, (request, response) => {
    let params = request.body;
    let rules = {
        page: "required",
        category_id: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        model.products(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['product_list_su'], responseData);
        }).catch((error) => {
            sendResponse(response, 2, lang[request.language]['product_list_not_found'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Add To Cart                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/add_to_cart`, (request, response) => {
    let params = request.body;
    let rules = {
        state_id: "required",
        quantity: "required",
        price: "required",
        type: "required|in:Single,Tiffin"
    }
    if (params.type === "Tiffin") {
        rules.tiffin_detail_id = "required";
        rules.tiffin_id = "required";
    } else {
        rules.product_id = "required";
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        params.login_user_id = request.login_user_id;
        model.add_to_cart(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['product_added_to_cart'].replace('{status}', responseData), null);
        }).catch((error) => {
            sendResponse(response, 0, lang[request.language]['product_not_added_to_cart'].replace('{status}', error), null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                 Cart List                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/cart_list`, (request, response) => {
    let params = request.body;
    params.login_user_id = request.login_user_id;
    model.cart_list(params).then((responseData) => {
        sendResponse(response, 1, lang[request.language]['cart_list_su'], responseData);
    }).catch((error) => {
        sendResponse(response, 2, lang[request.language]['cart_list_not_found'], null);
    })
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Place Order                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/place_order`, (request, response) => {
    let params = request.body;
    let rules = {
        state_id: "required",
        billing_details: "required",
        shipping_details: "required",
        sub_total: "required",
        shipping_charge: "required",
        final_total: "required",
        products: "required",
        transaction_id: "required",
        order_id: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        params.login_user_id = request.login_user_id;
        model.place_order(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['order_place_su'], null);
        }).catch((error) => {
            sendResponse(response, 0, lang[request.language]['order_place_un'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                  My Order                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.get(`/my_order`, (request, response) => {
    let params = request.body;
    params.login_user_id = request.login_user_id;
    model.order_list(params).then((responseData) => {
        sendResponse(response, 1, lang[request.language]['order_list_su'], responseData);
    }).catch((error) => {
        sendResponse(response, 2, lang[request.language]['no_order'], null);
    })
});

router.post(`/verify_promocode`, (request, response) => {
    let params = request.body;
    let rules = {
        state_id: "required",
        promocode: "required"
    }
    let validation = checkValidation(params, rules, request.language);
    if (validation.status) {
        params.login_user_id = request.login_user_id;
        model.verify_promocode(params).then((responseData) => {
            sendResponse(response, 1, lang[request.language]['promocode_verify_su'], responseData);
        }).catch((error) => {
            sendResponse(response, 0, lang[request.language]['promocode_verify_un'], null);
        })
    } else {
        sendResponse(response, 0, validation.error, null);
    }
})

module.exports = router;