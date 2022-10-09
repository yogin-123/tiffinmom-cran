const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    // ======================================================================================
    //                                      APP
    // ======================================================================================
    'APP_NAME'              : "Tiffin Mom",
    'PORT'                  : process.env.PORT,

    // ======================================================================================
    //                                 EMAIL & PASSWORD
    // ======================================================================================
    'EMAIL_ID'              : process.env.EMAIL_ID,
    'EMAIL_PASSWORD'        : process.env.EMAIL_PASSWORD,

    // ======================================================================================
    //                                  AWS S3 BUCKET
    // ======================================================================================
    'S3_URL'                : 'https://tiffinmom-s3.s3.amazonaws.com/',

    // ======================================================================================
    //                                 IMAGE & VIDEO PATH
    // ======================================================================================
    'USER_IMAGE'            : 'user/',
    'ADMIN_IMAGE'           : 'admin/',
    'GALLERY_IMAGE'         : 'gallery/',
    'SLIDER_IMAGE'          : 'slider/',
    'OFFER_IMAGE'           : 'offer/',
    'PRODUCT_IMAGE'         : 'product/',
    'TIFFIN_IMAGE'          : 'tiffin/',

    // ======================================================================================
    //                                      LIMIT
    // ======================================================================================
    "PER_PAGE"              : 10,
}