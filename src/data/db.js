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
        const query = 'select * From user where id = ?'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}


async function createUser(user) {
    try {
        const query = 'INSERT INTO `user` (`id`,`name`,`email`,`password`,`userType`, `imageUrl`) VALUES (?, ?, ?, ?, ?, ?)'
        const [result] = await conn.query(query, [user.id, user.name, user.email, user.password, user.userType, user.imageUrl])
        saveUserTerms(user.id)
        return getUserById(result.insertId)
    } catch (error) {
        return http.returnError(error)
    }
}

async function updateTaxDataUser(taxData) {
    try {
        const birthDate = new Date(taxData.birthDate)
        const query = 'UPDATE `user` SET `birthDay` = ?, `phone` = ?, `cpf` = ?, `imageUrl` = ? WHERE (`id` = ?)'
        const [result] = await conn.query(query, [birthDate, taxData.phone, taxData.cpf, taxData.imageUrl, taxData.id])
        return getUserById(result.insertId)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getAddressByUserId(userId) {
    try {
        const query = 'select * From address where userId = ?'
        const [rows] = await conn.query(query, [userId])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}

async function saveAddress(address) {
    try {
        const query = 'INSERT INTO `address` (`userId`, `cep`, `number`, `street`, `district`, `complement`, `state`, `city`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        const [result] = await conn.query(query, [address.userId, address.cep, address.number, address.street, address.district, address.complement, address.state, address.city])
        return getAddressByUserId(address.userId)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getUserTermById(id) {
    try {
        const query = 'SELECT IF ((SELECT count(term) FROM userTerms as T0 INNER JOIN terms as T1 ON T0.version = T1.version WHERE T0.userId = ? AND T1.currentVersion = 1) = 0, "true", "false") as term;'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}

async function getTerms() {
    try {
        const query = 'SELECT * FROM terms WHERE id = (SELECT count(id) FROM terms);'
        const [rows] = await conn.query(query)
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}

async function updateUserTerms(userId) {
    try {
        const query = 'UPDATE userTerms SET version = (SELECT version FROM terms WHERE id = (SELECT count(id) FROM terms)) WHERE userId = ?;'
        const [result] = await conn.query(query, [userId])
        return http.returnSuccess({})
    } catch (error) {
        return http.returnError(error)
    }
}

async function saveUserTerms(userId) {
    try {
        const query = 'INSERT INTO userTerms (userId, version) VALUES (?, (SELECT version FROM terms WHERE id = (SELECT count(id) FROM terms)));'
        const [result] = await conn.query(query, [userId])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateTaxDataUser,
    saveAddress,
    getAddressByUserId,
    getUserTermById,
    getTerms,
    updateUserTerms
}
