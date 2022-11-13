/* eslint-disable camelcase */
const app = require('express').Router()
const { admin_validate_token } = require('../../../config/common')

app.use('/authentication', admin_validate_token, require('./authentication/route'))
app.use('/dashboard', admin_validate_token, require('./dashboard/route'))
app.use('/modifiers', admin_validate_token, require('./modifiers/route'))
app.use('/gallery', admin_validate_token, require('./gallery/route'))
app.use('/slider', admin_validate_token, require('./slider/route'))
app.use('/user', admin_validate_token, require('./user/route'))
app.use('/category', admin_validate_token, require('./category/route'))
app.use('/product', admin_validate_token, require('./product/route'))
app.use('/faq', admin_validate_token, require('./faq/route'))
app.use('/setting', admin_validate_token, require('./setting_detail/route'))
app.use('/subadmin', admin_validate_token, require('./subadmin/route'))
app.use('/order', admin_validate_token, require('./order/route'))
app.use('/state', admin_validate_token, require('./state/route'))
app.use('/tiffin', admin_validate_token, require('./tiffin/route'))
app.use('/menu', admin_validate_token, require('./home_menu/route'))
app.use('/subscription', admin_validate_token, require('./subscription/route'))
app.use('/report', require('./report/route'))
app.use('/promocode', admin_validate_token, require('./promocode/route'))

module.exports = app
