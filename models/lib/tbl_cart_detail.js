const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_cart_detail = sequelize.define('tbl_cart_detail', {
  cart_id: {
    type: Sequelize.INTEGER
  },
  tiffin_detail_id: {
    type: Sequelize.BIGINT
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  is_active: {
    type: Sequelize.STRING,
    defaultValue: 'Active'
  },
  insert_datetime: {
    type: Sequelize.INTEGER,
    defaultValue: moment().format('X')
  },
  update_datetime: {
    type: Sequelize.STRING,
    defaultValue: moment().format('X')
  }
}, { timestamps: false, freezeTableName: true })

tbl_cart_detail.sync({ alter: true, force: false })

module.exports = tbl_cart_detail
