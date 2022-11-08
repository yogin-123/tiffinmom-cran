const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_tiffin_relation = sequelize.define('tbl_tiffin_relation', {
  tiffin_id: {
    type: Sequelize.BIGINT
  },
  category_id: {
    type: Sequelize.BIGINT
  },
  tiffin_detail_id: {
    type: Sequelize.BIGINT
  },
  position: {
    type: Sequelize.INTEGER
  },
  created_at: {
    type: Sequelize.INTEGER
    // default: moment().format('X')
  },
  updated_at: {
    type: Sequelize.INTEGER
    // default: moment().format('X')
  }
}, { timestamps: false, freezeTableName: true })

tbl_tiffin_relation.sync({ force: false, alter: true })

module.exports = tbl_tiffin_relation
