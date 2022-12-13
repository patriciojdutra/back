const mysql = require('mysql2/promise')
const http = require('../utils/returnStatusHttp')

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234', //root1234
    database: 'wellcomeDB'
})

async function getAllUsers() {
    try {
        const query = 'select id, name, email From user'
        const [rows] = await conn.query(query)
        return http.returnSuccess(rows)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getUserById(id) {
    try {
        const query = 'select id, name, email From user where id = ?'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}

async function createUser(user) {
    try {
        const query = 'INSERT INTO `user` (`id`,`name`,`email`,`password`,`userType`) VALUES (?, ?, ?, ?, ?)'
        const [result] = await conn.query(query, [user.id, user.name, user.email, user.password, user.userType])
        return getUserById(result.insertId)
    } catch (error) {
        return http.returnError(error)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser
}
