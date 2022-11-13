const config = require('./constants')
const mysql = require('mysql')

const con = mysql.createPool({
  connectionLimit: 10,
  host: config.DB_HOST,
  user: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  dateStrings: 'date'
})

con.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  } else {
    console.log(`DB ${config.DB_NAME} connected`)
  }
  if (connection) {
    connection.release()
  }
})

module.exports = con
