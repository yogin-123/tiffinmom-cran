const lang = require('../../../../config/language');
const dashboard_model = require('./dashboard_model');
const { sendResponse } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                             Dashboard Totals                                  /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/dashboard_totals", function (req, res) {
    let params = req.body;
    params.login_user_id = req.login_user_id;
    dashboard_model.dashboard_totals().then((response) => {
        sendResponse(res, 1, lang[req.language]['dashboard_totals_su'], response);
    }).catch((error) => {
        sendResponse(res, 0, lang[req.language]['dashboard_totals_un'], null);
    })
})

module.exports = router;