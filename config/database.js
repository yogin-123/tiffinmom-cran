const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit : 10,
    host : 'tiffinmom.c5zzrbennz5s.us-east-1.rds.amazonaws.com',
    user : 'tiffinmom_rds',
    password : 'ok2NEgai6Hv7IrZZBSJa',
    database : 'tiffinmom',
    waitForConnections: true,
    dateStrings: 'date'
});

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
    }   
    if (connection) {
        connection.release()    
    }
    return;
});

module.exports = con;