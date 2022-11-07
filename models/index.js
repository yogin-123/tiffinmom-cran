/* eslint-disable camelcase */
const tbl_tiffins = require('./lib/tbl_tiffins')
const tbl_tiffin_category = require('./lib/tbl_tiffin_category')
const tbl_tiffin_detail = require('./lib/tbl_tiffin_detail')
const tbl_tiffin_relation = require('./lib/tbl_tiffin_relation')

tbl_tiffins.belongsToMany(tbl_tiffin_category, { through: tbl_tiffin_relation, foreignKey: 'category_id' })
tbl_tiffin_category.belongsToMany(tbl_tiffins, { through: tbl_tiffin_relation, foreignKey: 'tiffin_id' })

tbl_tiffins.belongsToMany(tbl_tiffin_detail, { through: tbl_tiffin_relation, foreignKey: 'tiffin_detail_id' })
tbl_tiffin_detail.belongsToMany(tbl_tiffins, { through: tbl_tiffin_relation, foreignKey: 'tiffin_id' })

tbl_tiffin_category.belongsToMany(tbl_tiffin_detail, { through: tbl_tiffin_relation, foreignKey: 'tiffin_detail_id' })
tbl_tiffin_detail.belongsToMany(tbl_tiffin_category, { through: tbl_tiffin_relation, foreignKey: 'category_id' })

module.exports = {
  tbl_tiffins,
  tbl_tiffin_category,
  tbl_tiffin_detail,
  tbl_tiffin_relation
}
