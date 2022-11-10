/* eslint-disable camelcase */
const tbl_tiffins = require('./lib/tbl_tiffins')
const tbl_tiffin_category = require('./lib/tbl_tiffin_category')
const tbl_tiffin_detail = require('./lib/tbl_tiffin_detail')
const tbl_tiffin_relation = require('./lib/tbl_tiffin_relation')
const tbl_order_detail = require('./lib/tbl_order_detail')
const tbl_order_tiffin_detail = require('./lib/tbl_order_tiffin_detail')
const tbl_tiffin_detail_old = require('./lib/tbl_tiffin_detail_old')

module.exports = {
  tbl_tiffins,
  tbl_tiffin_category,
  tbl_tiffin_detail,
  tbl_tiffin_relation,
  tbl_order_detail,
  tbl_order_tiffin_detail,
  tbl_tiffin_detail_old
}
