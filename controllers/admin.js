const db = require('../models/database.js')


async function showAdminpage (req , res){
    const userId = req.params.id
    const sql = `SELECT * FROM user`
    const deleteUser = `DELETE FROM user WHERE id = ?  `
    let [adminRow] = await db.query(sql)
    let [deleteUserRows] = await db.query(deleteUser , [userId])
    res.render('admin.ejs' , {infos : adminRow , userDelete : deleteUserRows})
}
module.exports.showAdminpage = showAdminpage