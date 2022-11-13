/* eslint-disable camelcase */
const app = require('express').Router()
const { website_validate_token } = require('../../../config/common')

app.use('/authentication', website_validate_token, require('./authentication/route'))
app.use('/home', website_validate_token, require('./home/route'))
app.use('/product', website_validate_token, require('./product/route'))
app.use('/subscription', website_validate_token, require('./subscription/router'))
app.use('/tiffin', website_validate_token, require('./tiffin/route'))

module.exports = app
