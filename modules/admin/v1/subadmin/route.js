const lang = require('../../../../config/language');
const model = require('./subadmin_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/add_sub_admin", (req, res) => {
    let params = req.body;
    let rules = {
        state_id: "required",
        profile_image: "required",
        name: "required",
        email: "required",
        password: "required",
        is_dashboard: "required",
        is_category: "required",
        is_product: "required",
        is_modifiers: "required",
        is_modifiers_set: "required",
        is_items: "required",
        is_order: "required",
        is_user: "required",
        is_promo_code: "required",
        is_gallery: "required",
        is_faq: "required",
        is_tiffin: "required",
        is_tiffin_category: "required",
        is_tiffin_item: "required",
        is_slider: "required",
        is_subscription: "required",
        is_order_report: "required",
        is_delivery_report: "required",
        is_kitchen_report: "required",
        is_revenue_report: "required",
        is_menu: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        model.unique_fields(params).then((uniqueResponse) => {
            params.login_user_id = req.login_user_id;
            model.add_sub_admin(params).then((response) => {
                sendResponse(res, 1, lang[req.language]['subadmin_created'], null);
            }).catch((error) => {
                sendResponse(res, 0, lang[req.language]['subadmin_not_created'], null);
            })
        }).catch((uniqueError) => {
            sendResponse(res, 0, lang[req.language]['unique_unsuccess'].replace('{val}', params.email), null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/edit_sub_admin", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        state_id: "required",
        name: "required",
        email: "required",
        is_dashboard: "required",
        is_category: "required",
        is_product: "required",
        is_modifiers: "required",
        is_modifiers_set: "required",
        is_items: "required",
        is_order: "required",
        is_user: "required",
        is_promo_code: "required",
        is_gallery: "required",
        is_faq: "required",
        is_tiffin: "required",
        is_tiffin_category: "required",
        is_tiffin_item: "required",
        is_slider: "required",
        is_subscription: "required",
        is_order_report: "required",
        is_delivery_report: "required",
        is_kitchen_report: "required",
        is_revenue_report: "required",
        is_menu: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        model.edit_unique_fields(params).then((uniqueResponse) => {
            params.login_user_id = req.login_user_id;
            model.edit_sub_admin(params).then((response) => {
                sendResponse(res, 1, lang[req.language]['subadmin_detail_updated'], null);
            }).catch((error) => {
                sendResponse(res, 0, lang[req.language]['subadmin_not_updated'], null);
            })
        }).catch((uniqueError) => {
            sendResponse(res, 0, lang[req.language]['unique_unsuccess'].replace('{val}', params.email), null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_sub_admin_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_sub_admin_status(params).then((response) => {
            let message = lang[req.language]['subadmin_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['subadmin_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/sub_admin_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.sub_admin_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['subadmin_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['subadmin_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;