const lang = require('../../../../config/language')
const model = require('./tiffin_model')
const { sendResponse, checkValidation } = require('../../../../config/common')
const router = require('express').Router() // get an instance of the express Router

router.post('/add_tiffin', (req, res) => {
  const params = req.body
  const rules = {
    state_id: 'required',
    image: 'required',
    title: 'required',
    delivery_on: 'required',
    price: 'required',
    description: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.add_tiffin(params).then((response) => {
      sendResponse(res, 1, lang[req.language].tiffin_added, null)
    }).catch(() => {
      sendResponse(res, 0, lang[req.language].tiffin_not_added, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/edit_tiffin', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    state_id: 'required',
    title: 'required',
    delivery_on: 'required',
    price: 'required',
    description: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.edit_tiffin(params).then((response) => {
      sendResponse(res, 1, lang[req.language].tiffin_updated, null)
    }).catch(() => {
      sendResponse(res, 0, lang[req.language].tiffin_not_updated, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/change_tiffin_status', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    status: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    const status = (params.status === 'Active') ? 'active' : ((params.status === 'Inactive') ? 'inactive' : 'deleted')
    model.change_tiffin_status(params).then((response) => {
      const message = lang[req.language].tiffin_status_su.replace('{status}', status)
      sendResponse(res, 1, message, null)
    }).catch(() => {
      const message = lang[req.language].tiffin_status_un.replace('{status}', status)
      sendResponse(res, 0, message, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/tiffin_list', (req, res) => {
  const params = req.body
  const rules = { page: 'required' }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.tiffin_list(params).then((response) => {
      sendResponse(res, 1, lang[req.language].tiffin_list_su, response)
    }).catch((err) => {
      if (err) sendResponse(res, 0, lang[req.language].tiffin_category_already_exists, null)
      else sendResponse(res, 0, lang[req.language].tiffin_list_not_found, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/add_tiffin_category', (req, res) => {
  const params = req.body
  const rules = {
    categorys: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.add_tiffin_category(params).then((response) => {
      return sendResponse(res, 1, lang[req.language].tiffin_category_added, null)
    }).catch((err) => {
      if (err) return sendResponse(res, 0, lang[req.language].tiffin_category_already_exists, null)
      else return sendResponse(res, 0, lang[req.language].tiffin_category_not_added, null)
    })
  } else {
    return sendResponse(res, 0, validation.error, null)
  }
})

router.post('/edit_tiffin_category', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    name: 'required',
    quantity: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.edit_tiffin_category(params).then((response) => {
      return sendResponse(res, 1, lang[req.language].tiffin_category_updated, null)
    }).catch((err) => {
      if (err) return sendResponse(res, 5, lang[req.language].tiffin_category_already_exists, null)
      return sendResponse(res, 0, lang[req.language].tiffin_category_not_updated, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/change_tiffin_change_status', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    status: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    const status = (params.status === 'Active') ? 'active' : ((params.status === 'Inactive') ? 'inactive' : 'deleted')
    model.change_tiffin_category_status(params).then((response) => {
      const message = lang[req.language].tiffin_category_status_su.replace('{status}', status)
      sendResponse(res, 1, message, null)
    }).catch(() => {
      const message = lang[req.language].tiffin_category_status_un.replace('{status}', status)
      sendResponse(res, 0, message, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/tiffin_category_list', (req, res) => {
  const params = req.body
  const rules = { page: 'required' }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.tiffin_category_list(params).then((response) => {
      if (!response) return sendResponse(res, 0, lang[req.language].tiffin_category_list_not_found, null)
      else return sendResponse(res, 1, lang[req.language].tiffin_category_list_su, response)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/add_tiffin_items', (req, res) => {
  const params = { items: req.body }
  const rules = { items: 'required' }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.add_tiffin_items(params).then((response) => {
      sendResponse(res, 1, lang[req.language].tiffin_items_added, null)
    }).catch((err) => {
      if (err) return sendResponse(res, 5, lang[req.language].tiffin_item_already_exists, null)
      sendResponse(res, 0, lang[req.language].tiffin_items_not_added, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/edit_tiffin_item', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    name: 'required',
    price: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.edit_tiffin_item(params).then((response) => {
      sendResponse(res, 1, lang[req.language].tiffin_item_updated, null)
    }).catch((err) => {
      if (err) sendResponse(res, 5, lang[req.language].tiffin_item_already_exists, null)
      sendResponse(res, 0, lang[req.language].tiffin_item_not_updated, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/change_tiffin_item_status', (req, res) => {
  const params = req.body
  const rules = {
    id: 'required',
    status: 'required'
  }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    const status = (params.status === 'Active') ? 'active' : ((params.status === 'Inactive') ? 'inactive' : 'deleted')
    model.change_tiffin_item_status(params).then((response) => {
      const message = lang[req.language].tiffin_item_status_su.replace('{status}', status)
      sendResponse(res, 1, message, null)
    }).catch(() => {
      const message = lang[req.language].tiffin_item_status_un.replace('{status}', status)
      sendResponse(res, 0, message, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

router.post('/tiffin_items_list', (req, res) => {
  const params = req.body
  const rules = { page: 'required' }
  const validation = checkValidation(params, rules, req.language)
  if (validation.status) {
    params.login_user_id = req.login_user_id
    model.tiffin_items_list(params).then((response) => {
      sendResponse(res, 1, lang[req.language].tiffin_items_list_su, response)
    }).catch(() => {
      sendResponse(res, 0, lang[req.language].tiffin_items_list_not_found, null)
    })
  } else {
    sendResponse(res, 0, validation.error, null)
  }
})

module.exports = router
