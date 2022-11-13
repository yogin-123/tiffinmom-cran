const { USER_IMAGE, APP_NAME } = require('../../../../config/constants');
const moment = require('moment');
const lang = require("../../../../config/language");
const authentication_model = require('./authentication_model');
const { checkValidation, sendResponse, checkUserDeviceInfo, get_old_image_name_and_delete, check_unique, send_email } = require('../../../../config/common');

const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                                  Signup                                        /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post('/signup', (req, res) => {
    let params = req.body;
    let rules = {
        email: "required|email",
        first_name: "required",
        last_name: "required",
        password: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        check_unique(params, (response, val) => {
            if (response) {
                sendResponse(res, "0", lang[req.language]['unique_unsuccess'].replace('{val}', val), null);
            }
            else {
                let data = {
                    "email": params.email,
                    "first_name": params.first_name,
                    "last_name": params.last_name,
                    "password": params.password,
                    "insert_datetime": moment().format("X")
                }
                authentication_model.signup(data).then((result) => {
                    checkUserDeviceInfo(result.insertId).then((resToken) => {
                        authentication_model.user_details({ "user_id": result.insertId }).then((responseUserDetail) => {
                            delete responseUserDetail.password;
                            responseUserDetail.token = resToken.token;
                            sendResponse(res, "1", lang[req.language]['text_user_signup_success'], responseUserDetail);
                        }).catch((err) => {
                            sendResponse(res, "0", lang[req.language]['signup_unsuccess'], null);
                        })
                    }).catch((error) => {
                        sendResponse(res, "0", lang[req.language]['device_info_not_update'], null);
                    })
                }).catch((error) => {
                    sendResponse(res, "0", lang[req.language]['signup_unsuccess'], null);
                })
            }
        });
    } else {
        sendResponse(res, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                  Signin                                        /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post('/signin', (req, res) => {
    let params = req.body;
    let rules = {
        email: "required|email",
        password: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        authentication_model.signin(params).then((response) => {
            if (response.code == 3) {
                sendResponse(res, 3, lang[req.language]["text_user_login_inactive"], null);
            } else if (response.code == 1) {
                checkUserDeviceInfo(response.data.id, params).then((resToken) => {
                    response.data.token = resToken.token;
                    sendResponse(res, 1, lang[req.language]["signin_success"], response.data);
                }).catch((error) => {
                    sendResponse(res, 0, lang[req.language]['device_info_not_update'], null);
                });
            } else {
                sendResponse(res, 0, lang[req.language]["text_user_login_fail"], null);
            }
        }).catch((err) => {
            sendResponse(res, 0, lang[req.language]["text_user_login_fail"], null);
        });
    } else {
        sendResponse(res, 0, validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                               Edit Profile                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post('/edit_profile', (req, res) => {
    let params = req.body;
    let rules = {
        first_name: "required",
        last_name: "required",
        email: "required|email"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        authentication_model.edit_check_unique(req.login_user_id, params, (response, val) => {
            if (response) {
                var data = {
                    "first_name": params.first_name,
                    "last_name": params.last_name,
                    "email": params.email,
                    "update_datetime": moment().format("X")
                }
                if (params.profile_image) {
                    get_old_image_name_and_delete(`tbl_user`, `profile_image`, `id = ${req.login_user_id}`, USER_IMAGE, () => { });
                    data.profile_image = params.profile_image;
                }
                authentication_model.edit_profile(req.login_user_id, data).then((resData) => {
                    sendResponse(res, '1', lang[req.language]['text_user_edit_profile_success'], resData);
                }).catch((err) => {
                    sendResponse(res, '0', lang[req.language]['text_user_edit_profile_fail'], null);
                })
            }
            else {
                sendResponse(res, '0', lang[req.language]['unique_unsuccess'].replace('{val}', val), null);
            }
        });
    } else {
        sendResponse(res, '0', validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Get Profile                                     /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/get_profile", (req, res) => {
    let params = req.body;
    let rules = { user_id: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        authentication_model.user_details(params).then((response) => {
            delete response.password;
            sendResponse(res, "1", lang[req.language]['get_profile_data'], response);
        }).catch((err) => {
            sendResponse(res, "2", lang[req.language]['get_no_profile_data'], null);
        })
    } else {
        sendResponse(res, "0", validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                 Send OTP                                       /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/send_otp", (req, res) => {
    let params = req.body;
    let rules = { email: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        authentication_model.user_details(params).then((response) => {
            let { send_otp } = require('../../../../config/template');
            params.otp = Math.floor(1000 + Math.random() * 9000);
            send_otp(params.otp, (html) => {
                send_email(APP_NAME, params.email, html).then((resEmail) => {
                    authentication_model.updateVerificationOtp(params).then((resOTPUpdate) => {
                        sendResponse(res, "1", lang[req.language]['signup_otp_send'].replace('{field}', 'email address'), null);
                    }).catch((errOTPUpdate) => {
                        sendResponse(res, "0", lang[req.language]['something_wrong'], null);
                    })
                }).catch((error) => {
                    console.log(error)
                    sendResponse(res, "0", lang[req.language]['otp_not_send'].replace('{field}', 'email address'), null);
                })
            })
        }).catch((err) => {
            sendResponse(res, "0", lang[req.language]['otp_not_send'].replace('{field}', 'email address'), null);
        })
    } else {
        sendResponse(res, "0", validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Verify OTP                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/verify_otp", (req, res) => {
    let params = req.body;
    let rules = {
        email: "required",
        otp: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        authentication_model.verify_otp(params).then((response) => {
            sendResponse(res, "1", lang[req.language]["text_verify_otp_success"], null);
        }).catch((error) => {
            sendResponse(res, "0", lang[req.language]['text_invalid_otp'], null);
        })
    } else {
        sendResponse(res, "0", validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                              Reset Password                                    /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/reset_password", (req, res) => {
    let params = req.body;
    let rules = {
        email: "required",
        password: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        authentication_model.reset_password(params).then((response) => {
            sendResponse(res, "1", lang[req.language]['text_user_change_password_success'], null)
        }).catch((error) => {
            sendResponse(res, "0", lang[req.language]['something_wrong'], null)
        })
    } else {
        sendResponse(res, "0", validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                              Change Password                                   /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/change_password", (req, res) => {
    let params = req.body;
    let rules = { password: "required" }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        params.login_user_id = req.login_user_id;
        authentication_model.change_password(params).then((response) => {
            sendResponse(res, "1", lang[req.language]['text_user_change_password_success'], null)
        }).catch((error) => {
            sendResponse(res, "0", lang[req.language]['something_wrong'], null)
        })
    } else {
        sendResponse(res, "0", validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                Contact Us                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/contact_us", (req, res) => {
    let params = req.body;
    let rules = {
        name: "required",
        email: "required",
        message: "required"
    }
    let validation = checkValidation(params, rules, req.language);
    if (validation.status) {
        authentication_model.contact_us(params).then((response) => {
            sendResponse(res, "1", lang[req.language]['text_user_contactus_success'], null)
        }).catch((error) => {
            sendResponse(res, "0", lang[req.language]['text_user_contactus_fails'], null)
        })
    } else {
        sendResponse(res, "0", validation.error, null);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                   Logout                                       /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/logout", (req, res) => {
    authentication_model.logout(req.login_user_id).then((resCode) => {
        sendResponse(res, "1", lang[req.language]['text_user_logout'], null)
    }).catch((err) => {
        sendResponse(res, "0", lang[req.language]['something_wrong'], null)
    })
});

//////////////////////////////////////////////////////////////////////////////////////////
/////                                State List                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.get("/state_list", (req, res) => {
    authentication_model.state_list().then((response) => {
        sendResponse(res, "1", lang[req.language]['state_list'], response)
    }).catch((error) => {
        sendResponse(res, "0", lang[req.language]['something_wrong'], null)
    })
});

module.exports = router;