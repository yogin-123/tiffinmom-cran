const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_tiffin_category = sequelize.define('tbl_tiffin_category', {
  user_id: {
    type: Sequelize.BIGINT
  },
  name: {
    type: Sequelize.STRING
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  position: {
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
    type: Sequelize.INTEGER,
    default: moment().format('X')
  }
}, { freezeTableName: true, timestamps: false })

tbl_tiffin_category.sync({ force: false, alter: true })

module.exports = tbl_tiffin_category
