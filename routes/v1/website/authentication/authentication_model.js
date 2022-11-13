const con = require('../../../../config/database');
const { S3_URL, USER_IMAGE } = require('../../../../config/constants');
const moment = require('moment');

const tbl_user = `tbl_user`;
const tbl_verification_otp = `tbl_verification_otp`;
const tbl_contact_us = `tbl_contact_us`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                  Signin                                        /////
    //////////////////////////////////////////////////////////////////////////////////////////
    signin(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id,CONCAT('${S3_URL + USER_IMAGE}',profile_image) AS profile_image,first_name,last_name,email,is_active FROM ${tbl_user} WHERE is_active != 'Delete' AND email = '${params.email}' AND password = '${params.password}' LIMIT 1`, (err, result) => {
                if (!err) {
                    if (result[0] != undefined) {
                        if (result[0].is_active == "Inactive") {
                            resolve({ code: 3 });
                        } else {
                            resolve({ code: 1, data: result[0] });
                        }
                    } else {
                        reject();
                    }
                }
                else {
                    reject();
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                  Signup                                        /////
    //////////////////////////////////////////////////////////////////////////////////////////
    signup(params) {
        return new Promise((resolve, reject) => {
            con.query(`INSERT INTO ${tbl_user} SET ?`, params, (err, result) => {
                if (!err && result) {
                    resolve(result);
                }
                else {
                    reject();
                }
            });
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                               Edit Profile                                     /////
    //////////////////////////////////////////////////////////////////////////////////////////
    edit_check_unique(id, params, callback) {
        this.edit_unique_fields('email', id, params.email).then((email) => {
            callback(true);
        }).catch((error) => {
            callback(false, params.email);
        });
    },
    edit_unique_fields(field, id, params) {
        return new Promise((resolve, reject) => {
            if (params != '') {
                con.query(`SELECT id FROM ${tbl_user} WHERE ${field} = "${params}" AND is_active != "Delete" LIMIT 1`, (err, result) => {
                    if (result.length == 1 && result[0].id == id) {
                        resolve();
                    }
                    else if (result.length == 0) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            } else {
                resolve();
            }
        });
    },
    edit_profile(user_id, params) {
        return new Promise((resolve, reject) => {
            con.query(`UPDATE ${tbl_user} SET ? WHERE id = '${user_id}'`, params, (err, result) => {
                if (!err) {
                    this.user_details({ "user_id": user_id }).then((response) => {
                        delete response.password;
                        resolve(response)
                    }).catch((err) => {
                        reject()
                    })
                } else {
                    reject()
                }
            });
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Get Profile                                     /////
    //////////////////////////////////////////////////////////////////////////////////////////
    user_details(params) {
        return new Promise((resolve, reject) => {
            let where = ``;
            if (params.user_id) {
                where = `AND id = '${params.user_id}'`;
            } else {
                where = `AND email = '${params.email}'`;
            }
            con.query(`SELECT id,CONCAT('${S3_URL + USER_IMAGE}',profile_image) AS profile_image,email,password,first_name,last_name FROM ${tbl_user} WHERE is_active = 'Active' ${where}`, (err, result) => {
                if (!err && result[0] != undefined) {
                    resolve(result[0]);
                }
                else {
                    reject();
                }
            });
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                               Verify OTP                                       /////
    //////////////////////////////////////////////////////////////////////////////////////////
    verify_otp(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id FROM ${tbl_verification_otp} WHERE is_active = 'Active' AND email = '${params.email}' AND otp = '${params.otp}' LIMIT 1`, (error, result) => {
                if (!error && result[0]) {
                    let update_data = {
                        is_active: 'Inactive',
                    }
                    con.query(`UPDATE ${tbl_verification_otp} SET ? WHERE id = ${result[0].id}`, update_data, (updateError, updateResult) => {
                        resolve();
                    })
                } else {
                    reject();
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                              Reset Password                                    /////
    //////////////////////////////////////////////////////////////////////////////////////////
    reset_password(params) {
        return new Promise((resolve, reject) => {
            con.query(`UPDATE ${tbl_user} SET password = '${params.password}' WHERE email = '${params.email}'`, (err, result) => {
                if (!err) {
                    con.query(`SELECT id FROM ${tbl_user} WHERE email = '${params.email}'`, (uErr, uResult) => {
                        this.logout(uResult[0].id, () => { })
                        resolve()
                    })
                } else {
                    reject()
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                              Change Password                                   /////
    //////////////////////////////////////////////////////////////////////////////////////////
    change_password(params) {
        return new Promise((resolve, reject) => {
            con.query(`UPDATE ${tbl_user} SET password = '${params.password}' WHERE id = '${params.login_user_id}'`, (err, result) => {
                if (!err) {
                    resolve()
                } else {
                    reject()
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                          Update Verification Otp                               /////
    //////////////////////////////////////////////////////////////////////////////////////////
    updateVerificationOtp(params) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id FROM ${tbl_verification_otp} WHERE email = ${params.email} LIMIT 1`, (error, result) => {
                let update_data = {
                    email: params.email,
                    otp: params.otp,
                    is_active: 'Active',
                    insert_datetime: moment().format("X")
                }
                if (!error && result[0]) {
                    con.query(`UPDATE ${tbl_verification_otp} SET ? WHERE id = ${result[0].id}`, update_data, (updateError, updateResult) => {
                        if (!updateError) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                } else {
                    con.query(`INSERT INTO ${tbl_verification_otp} SET ?`, update_data, (insertError, insertResult) => {
                        if (!insertError) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                State List                                      /////
    //////////////////////////////////////////////////////////////////////////////////////////
    state_list() {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id,name,address FROM tbl_state WHERE is_active = 'Active'`, (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject();
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                Contact Us                                      /////
    //////////////////////////////////////////////////////////////////////////////////////////
    contact_us(params) {
        return new Promise((resolve, reject) => {
            let insert_data = {
                name: params.name,
                email: params.email,
                message: params.message,
                insert_datetime: moment().format("X")
            }
            con.query(`INSERT INTO ${tbl_contact_us} SET ?`, insert_data, (err, result) => {
                if (!err && result) {
                    resolve(result);
                }
                else {
                    reject();
                }
            });
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                   Logout                                       /////
    //////////////////////////////////////////////////////////////////////////////////////////
    logout(id) {
        return new Promise((resolve, reject) => {
            let update_data = {
                token: '',
                last_login_datetime: moment().format("X")
            }
            con.query(`UPDATE ${tbl_user} SET ? WHERE id = '${id}'`, update_data, (err) => {
                resolve()
            })
        })
    }
}