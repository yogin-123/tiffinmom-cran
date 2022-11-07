const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_tiffin_detail = sequelize.define('tbl_tiffin_detail', {
    name: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.FLOAT,
    },
    is_active: {
        type: Sequelize.STRING,
        default: 'Active'
    },
    insert_datetime: {
        type: Sequelize.INTEGER,
        default: moment().format('X')
    },
    update_datetime: {
        type: Sequelize.INTEGER,
        default: moment().format('X')
    }
}, { timestamps: false, freezeTableName: true });

tbl_tiffin_detail.sync()

module.exports = tbl_tiffin_detail