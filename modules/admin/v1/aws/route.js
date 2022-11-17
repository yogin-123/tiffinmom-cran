const {S3_ACCESS_KEY,S3_SECRET_KEY,S3_REGION,S3_FOLDER_NAME,S3_BUCKET_NAME} = require('../../../config/constants');
const {checkValidation,sendResponse} = require('../../../config/common');
const moment = require('moment');
const aws = require('aws-sdk');
const s3 = new aws.S3({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
    region: S3_REGION
});
const lang = require("../../../config/language");

const router = require('express').Router(); // get an instance of the express Router

//////////////////////////////////////////////////////////////////////////////////////////
/////                                   Get URL                                      /////
//////////////////////////////////////////////////////////////////////////////////////////
router.post("/getURL",(req,res)=>{
    let params = req.body;
    const rules = {
        fileType: "required",
        bucketFolderName: "required"
    }
    if(checkValidation(params, rules, res))
    {
        const fileName = S3_FOLDER_NAME+'/'+params.bucketFolderName+'/'+Math.floor(10000 + Math.random() * 90000)+moment().format("X")+'.'+params.fileType;
        const s3Params = {
            Bucket: S3_BUCKET_NAME,
            Key: fileName,
            Expires: 60 * 60,
            ContentType: "image/"+params.fileType,
            ACL: "public-read"
        }
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err) {
                sendResponse(res, "0", lang[req.language]['something_wrong'], null);
            } else {
                sendResponse(res, "1", lang[req.language]['text_details_are'], data);
            }
        });
    }
});

module.exports = router;