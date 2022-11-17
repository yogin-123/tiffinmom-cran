const lang = require('../../../../config/language');
const model = require('./product_model');
const { sendResponse, checkValidation, get_old_image_name_and_delete } = require('../../../../config/common');
const { PRODUCT_IMAGE } = require('../../../../config/constants');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                                 Add Product                                    /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/add_product", (req, res) => {
    let params = req.body;
    let rules = {
        state_id: "required",
        image: "required",
        name: "required",
        price: "required",
        category_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_product(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['product_added_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['product_added_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Edit Product                                    /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/edit_product", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        state_id: "required",
        name: "required",
        price: "required|email",
        category_id: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        if (params.image) {
            get_old_image_name_and_delete(`tbl_category`, `image`, `id = ${params.id}`, PRODUCT_IMAGE, () => { });
        }
        model.edit_product(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['product_updated_su'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['product_updated_un'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                          Change Product Status                                 /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_product_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_product_status(params).then((response) => {
            let message = lang[req.language]['product_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['product_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Product List                                    /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/product_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.product_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['product_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['product_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;