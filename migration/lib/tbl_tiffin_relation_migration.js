const con = require('../../config/database')

module.exports = async function () {
  con.query('SELECT * FROM tbl_tiffin_detail group by name, price', async (err, results) => {
    if (err) console.log(err)
    else {
      for await (const result of results) {
        con.query(`SELECT * FROM tbl_tiffin_detail WHERE name = '${result.name}' and price = ${result.price}`, async (err1, results1) => {
          if (results1) {
            for await (const result1 of results1) {
              const insertQuery = {
                tiffin_id: result1.tiffin_id,
                category_id: result1.category_id,
                tiffin_detail_id: result.id,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime()
              }
              con.query('INSERT INTO tbl_tiffin_relation SET ?', insertQuery, (insertErr, insertResult) => {
                console.log({ insertErr, insertResult })
              })
            //   con.query(`DELETE FROM tbl_tiffin_detail WHERE name = '${result.name}' and price = ${result.price} and id != ${result.id}`, (deleteErr, deleteResult) => {
            //     console.log({ deleteErr, deleteResult })
            //   })
            }
          }
        })
      }
    }
  })
}
