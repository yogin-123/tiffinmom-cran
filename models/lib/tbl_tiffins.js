const Sequelize = require('sequelize')
const sequelize = require('../../config/sequelize')
const moment = require('moment')

const tbl_tiffins = sequelize.define('tbl_tiffins', {
    state_id: {
        type: Sequelize.BIGINT,
    },
    image: {
        type: Sequelize.STRING,
    },
    title: {
        type: Sequelize.STRING,
    },
    delivery_on: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.FLOAT,
    },
    description: {
        type: Sequelize.STRING,
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
});

tbl_tiffins.sync()

module.exports = tbl_tiffins