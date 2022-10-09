const connection = require('../../../../config/database');
const { PER_PAGE, S3_URL, GALLERY_IMAGE, SLIDER_IMAGE } = require('../../../../config/constants');

const tbl_slider = `tbl_slider`;
const tbl_gallery = `tbl_gallery`;
const tbl_home_menu = `tbl_home_menu`;
const tbl_faqs = `tbl_faqs`;
const tbl_setting_details = `tbl_setting_details`;

module.exports = {
    //////////////////////////////////////////////////////////////////////////////////////////
    /////                               Home Data                                        /////
    //////////////////////////////////////////////////////////////////////////////////////////
    home_data_list(params) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT title, description, CONCAT('${S3_URL + SLIDER_IMAGE}',media_name) AS image FROM ${tbl_slider} WHERE is_active = 'Active' AND state_id = ${params.state_id} ORDER BY id DESC`, (errorSlider, resultSlider) => {
                connection.query(`SELECT CONCAT('${S3_URL + GALLERY_IMAGE}',media_name) AS image FROM ${tbl_gallery} WHERE is_active = 'Active' AND state_id = ${params.state_id} ORDER BY id DESC LIMIT 4`, (errorGallery, resultGallery) => {
                    connection.query(`SELECT name,data FROM ${tbl_home_menu} WHERE is_active = 'Active' AND state_id = ${params.state_id} LIMIT 4`, (errorMenu, resultMenu) => {
                        let slider = [];
                        let gallery = [];
                        let menu = [];
                        if (!errorSlider && resultSlider[0]) {
                            slider = resultSlider;
                        }
                        if (!errorGallery && resultGallery[0]) {
                            gallery = resultGallery;
                        }
                        if (!errorMenu && resultMenu[0]) {
                            menu = resultMenu;
                        }
                        resolve({
                            slider: slider,
                            gallery: gallery,
                            menu: menu
                        })
                    })
                })
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                   FAQ's                                        /////
    //////////////////////////////////////////////////////////////////////////////////////////
    faq_list(params) {
        return new Promise((resolve, reject) => {
            let limit = ``;
            if (!["-1", -1].includes(params.page)) {
                limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`;
            }
            connection.query(`SELECT id,question,answer FROM ${tbl_faqs} WHERE is_active = 'Active' AND state_id = ${params.state_id} ORDER BY id DESC ${limit}`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    reject()
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                                 Gallery                                        /////
    //////////////////////////////////////////////////////////////////////////////////////////
    gallery(params) {
        return new Promise((resolve, reject) => {
            let limit = ``;
            if (!["-1", -1].includes(params.page)) {
                limit = `LIMIT ${(parseInt(params.page) * parseInt(PER_PAGE))},${parseInt(PER_PAGE)}`;
            }
            connection.query(`SELECT CONCAT('${S3_URL + GALLERY_IMAGE}',media_name) AS image FROM ${tbl_gallery} WHERE is_active = 'Active' AND state_id = ${params.state_id} ORDER BY id DESC ${limit}`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result)
                } else {
                    reject()
                }
            })
        })
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    /////                             How It Work Page                                   /////
    //////////////////////////////////////////////////////////////////////////////////////////
    how_it_work_page_data(params) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT attribute_value FROM ${tbl_setting_details} WHERE attribute_name = 'how_it_work' AND state_id = ${params.state_id} LIMIT 1`, (error, result) => {
                if (!error && result[0]) {
                    resolve(result[0].attribute_value)
                } else {
                    reject()
                }
            })
        })
    },
}