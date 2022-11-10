const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_order_detail = sequelize.define('tbl_order_detail', {
    order_id: {
        type: Sequelize.INTEGER
    },
    type: {
        type: Sequelize.STRING
    },
    tiffin_id: {
        type: Sequelize.BIGINT
    },
    product_id: {
        type: Sequelize.BIGINT
    },
    price: {
        type: Sequelize.BIGINT
    },
    quantity: {
        type: Sequelize.INTEGER
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
        type: Sequelize.STRING,
        default: moment().format('X')
    }
}, { timestamps: false, freezeTableName: true })

tbl_order_detail.sync({ alter: true, force: false })

module.exports = tbl_order_detail
