const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_tiffin_detail_old = sequelize.define('tbl_tiffin_detail_old', {
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.DOUBLE
    },
    tiffin_id: {
        type: Sequelize.BIGINT
    },
    category_id: {
        type: Sequelize.BIGINT
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
}, { timestamps: false, freezeTableName: true })

tbl_tiffin_detail_old.sync({ alter: true, force: false })

module.exports = tbl_tiffin_detail_old
