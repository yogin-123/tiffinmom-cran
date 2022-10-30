const lang = require('../../../../config/language')
const model = require('./category_model')
const { sendResponse, checkValidation } = require('../../../../config/common')
const router = require('express').Router() // get an instance of the express Router

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                               Add Category                                     /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/add_category', (req, res) => {
  const params = req.body
  const rules = {
    state_id: 'required',
    name: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.add_category(params).then((response) => {
      sendResponse(res, 1, lang[req.language].category_added_su, null)
    }).catch(() => {
      sendResponse(res, 0, lang[req.language].category_added_un, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                                Edit Category                                   /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/edit_category', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    state_id: 'required',
    name: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.edit_category(params).then((response) => {
      sendResponse(res, 1, lang[req.language].category_updated_su, null)
    }).catch(() => {
      sendResponse(res, 0, lang[req.language].category_updated_un, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                          Change Category Status                                /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/change_category_status', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    status: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    const status = (params.status === 'Active') ? 'active' : ((params.status === 'Inactive') ? 'inactive' : 'deleted')
    model.change_category_status(params).then((response) => {
      const message = lang[req.language].category_status_su.replace('{status}', status)
      sendResponse(res, 1, message, null)
    }).catch(() => {
      const message = lang[req.language].category_status_un.replace('{status}', status)
      sendResponse(res, 0, message, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

/// ///////////////////////////////////////////////////////////////////////////////////////
/// //                               Category List                                    /////
/// ///////////////////////////////////////////////////////////////////////////////////////
router.post('/category_list', (req, res) => {
  const params = req.body
  const rules = { page: 'required' }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.category_list(params).then((response) => {
      sendResponse(res, 1, lang[req.language].category_list_su, response)
    }).catch(() => {
      sendResponse(res, 0, lang[req.language].category_list_not_found, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

module.exports = router
