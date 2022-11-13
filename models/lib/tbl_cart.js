const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_cart = sequelize.define('tbl_cart', {
  user_id: {
    type: Sequelize.INTEGER
  },
  state_id: {
    type: Sequelize.INTEGER
  },
  type: {
    type: Sequelize.STRING
  },
  product_id: {
    type: Sequelize.BIGINT
  },
  tiffin_id: {
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
    defaultValue: 'Active'
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

tbl_cart.sync({ alter: true, force: false })

module.exports = tbl_cart
