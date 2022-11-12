// const lang = require('../../../../config/language');
const model = require('./braintree_payment_model');
// const { sendResponse, checkValidation } = require('../../../../config/common');
const router = require('express').Router(); // get an instance of the express Router


router.get('/generate/token', model.getGenerateToken)
router.post('/process/payment', model.processPayment)
module.exports=router;