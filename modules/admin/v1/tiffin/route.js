const lang = require('../../../../config/language');
const model = require('./tiffin_model');
const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

router.post("/add_tiffin", (req, res) => {
    let params = req.body;
    let rules = {
        state_id: "required",
        image: "required",
        title: "required",
        delivery_on: "required",
        price: "required",
        description: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_tiffin(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_added'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_not_added'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/edit_tiffin", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        state_id: "required",
        title: "required",
        delivery_on: "required",
        price: "required",
        description: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_tiffin(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_updated'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_not_updated'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_tiffin_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_tiffin_status(params).then((response) => {
            let message = lang[req.language]['tiffin_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['tiffin_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/tiffin_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.tiffin_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/add_tiffin_category", (req, res) => {
    let params = req.body;
    let rules = {
        categorys: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_tiffin_category(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_category_added'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_category_not_added'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/edit_tiffin_category", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        name: "required",
        quantity: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_tiffin_category(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_category_updated'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_category_not_updated'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_tiffin_change_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_tiffin_category_status(params).then((response) => {
            let message = lang[req.language]['tiffin_category_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['tiffin_category_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/tiffin_category_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.tiffin_category_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_category_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_category_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/add_tiffin_items", (req, res) => {
    let params = req.body;
    let rules = { items: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.add_tiffin_items(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_items_added'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_items_not_added'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/edit_tiffin_item", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        tiffin_id: "required",
        category_id: "required",
        name: "required",
        price: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.edit_tiffin_item(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_item_updated'], null);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_item_not_updated'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/change_tiffin_item_status", (req, res) => {
    let params = req.body;
    let rules = {
        id: "required",
        status: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        let status = (params.status == "Active") ? "active" : ((params.status == "Inactive") ? "inactive" : "deleted")
        model.change_tiffin_item_status(params).then((response) => {
            let message = lang[req.language]['tiffin_item_status_su'].replace('{status}', status);
            sendResponse(res, 1, message, null);
        }).catch((error) => {
            let message = lang[req.language]['tiffin_item_status_un'].replace('{status}', status);
            sendResponse(res, 0, message, null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

router.post("/tiffin_items_list", (req, res) => {
    let params = req.body;
    let rules = { page: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        model.tiffin_items_list(params).then((response) => {
            sendResponse(res, 1, lang[req.language]['tiffin_items_list_su'], response);
        }).catch((error) => {
            sendResponse(res, 0, lang[req.language]['tiffin_items_list_not_found'], null);
        })
    } else {
        sendResponse(res, 0, validation.error, null);
    }
})

module.exports = router;