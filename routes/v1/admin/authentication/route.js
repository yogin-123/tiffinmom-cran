/* eslint-disable camelcase */
const { ADMIN_IMAGE } = require('../../../../config/constants')
const moment = require('moment')
const lang = require('../../../../config/language')
const authentication_model = require('./authentication_model')
const { state_list } = require('../../website/authentication/authentication_model')
const { checkValidation, sendResponse, checkAdminDeviceInfo, get_old_image_name_and_delete } = require('../../../../config/common')

const router = require('express').Router() // get an instance of the express Router

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                                  Signin                                        /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/signin', (req, res) => {
  const params = req.body
  const rules = {
    email: 'required|email',
    password: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    authentication_model.signin(params).then((response) => {
      if (response.code == 3) {
        sendResponse(res, 3, lang[req.language].text_user_login_inactive, null)
      } else if (response.code == 1) {
        checkAdminDeviceInfo(response.data.id, params).then((resToken) => {
          delete response.data.password
          response.data.token = resToken.token
          sendResponse(res, 1, lang[req.language].signin_success, response.data)
        }).catch((error) => {
          sendResponse(res, 0, lang[req.language].device_info_not_update, null)
        })
      } else {
        sendResponse(res, 0, lang[req.language].text_user_login_fail, null)
      }
    }).catch((err) => {
      sendResponse(res, 0, lang[req.language].text_user_login_fail, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                               Edit Profile                                     /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/edit_profile', (req, res) => {
  const params = req.body
  const rules = {
    name: 'required',
    email: 'required|email'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    authentication_model.edit_check_unique(req.login_user_id, params, (response, val) => {
      if (response) {
        const data = {
          name: params.name,
          email: params.email,
          update_datetime: moment().format('X')
        }
        if (params.profile_image) {
          get_old_image_name_and_delete('tbl_admin', 'profile_image', `id = ${req.login_user_id}`, ADMIN_IMAGE, () => { })
          data.profile_image = params.profile_image
        }
        authentication_model.edit_profile(req.login_user_id, data).then((resData) => {
          sendResponse(res, '1', lang[req.language].text_user_edit_profile_success, resData)
        }).catch((err) => {
          sendResponse(res, '0', lang[req.language].text_user_edit_profile_fail, null)
        })
      } else {
        sendResponse(res, '0', lang[req.language].unique_unsuccess.replace('{val}', val), null)
      }
    })
  } else {
    sendResponse(res, '0', validation.error, null)
  }
})

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                                Get Profile                                     /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/get_profile', (req, res) => {
  const params = req.body
  const rules = { user_id: 'required' }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    authentication_model.user_details(params).then((response) => {
      delete response.password
      sendResponse(res, '1', lang[req.language].get_profile_data, response)
    }).catch((err) => {
      sendResponse(res, '2', lang[req.language].get_no_profile_data, null)
    })
  } else {
    sendResponse(res, '0', validation.error, null)
  }
})

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                                State List                                      /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.get('/state_list', (req, res) => {
  state_list().then((response) => {
    sendResponse(res, '1', lang[req.language].state_list, response)
  }).catch((error) => {
    sendResponse(res, '0', lang[req.language].something_wrong, null)
  })
})

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                                   Logout                                       /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/logout', (req, res) => {
  authentication_model.logout(req.login_user_id).then((resCode) => {
    sendResponse(res, '1', lang[req.language].text_user_logout, null)
  }).catch((err) => {
    sendResponse(res, '0', lang[req.language].something_wrong, null)
  })
})

module.exports = router
