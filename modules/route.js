const express = require('express');
const app = express();
const { admin_validate_token, website_validate_token } = require('../config/common');

// admin routes
app.use('/admin/v1/authentication', admin_validate_token, require('./admin/v1/authentication/route'));
app.use('/admin/v1/dashboard', admin_validate_token, require('./admin/v1/dashboard/route'));
app.use('/admin/v1/modifiers', admin_validate_token, require('./admin/v1/modifiers/route'));
app.use('/admin/v1/gallery', admin_validate_token, require('./admin/v1/gallery/route'));
app.use('/admin/v1/slider', admin_validate_token, require('./admin/v1/slider/route'));
app.use('/admin/v1/user', admin_validate_token, require('./admin/v1/user/route'));
app.use('/admin/v1/category', admin_validate_token, require('./admin/v1/category/route'));
app.use('/admin/v1/product', admin_validate_token, require('./admin/v1/product/route'));
app.use('/admin/v1/faq', admin_validate_token, require('./admin/v1/faq/route'));
app.use('/admin/v1/setting', admin_validate_token, require('./admin/v1/setting_detail/route'));
app.use('/admin/v1/subadmin', admin_validate_token, require('./admin/v1/subadmin/route'));
app.use('/admin/v1/order', admin_validate_token, require('./admin/v1/order/route'));
app.use('/admin/v1/state', admin_validate_token, require('./admin/v1/state/route'));
app.use('/admin/v1/tiffin', admin_validate_token, require('./admin/v1/tiffin/route'));
app.use('/admin/v1/menu', admin_validate_token, require('./admin/v1/home_menu/route'));
app.use('/admin/v1/subscription', admin_validate_token, require('./admin/v1/subscription/route'));
app.use('/admin/v1/report', require('./admin/v1/report/route'));
app.use('/admin/v1/promocode', admin_validate_token, require('./admin/v1/promocode/route'));

// website routes
app.use('/website/v1/authentication', website_validate_token, require('./website/v1/authentication/route'));
app.use('/website/v1/home', website_validate_token, require('./website/v1/home/route'));
app.use('/website/v1/product', website_validate_token, require('./website/v1/product/route'));
app.use('/website/v1/subscription', website_validate_token, require('./website/v1/subscription/router'));
app.use('/website/v1/tiffin', website_validate_token, require('./website/v1/tiffin/route'));

app.use((req, res, next) => {
    res.status(404);
    res.send('This Url Is Not Valid');
});

module.exports = app