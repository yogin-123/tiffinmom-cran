const Sequelize = require('sequelize')
const config = require('./constants')
const sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timestamps: false
});
(() => {
    console.log('called')
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((err) => {
        console.error('Unable to connect to the database:', err);
    })
})()

module.exports = sequelize