const mysql = require('mysql2/promise')
const http = require('../utils/returnStatusHttp')

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234', //root1234
    database: 'wellcomeDB'
})

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
        const query = 'UPDATE `user` SET `birthDate` = ?, `phone` = ?, `cpf` = ?, `imageUrl` = ? WHERE (`id` = ?)'
        const [result] = await conn.query(query, [birthDate, taxData.phone, taxData.cpf, taxData.imageUrl, taxData.id])
        return getUserById(result.insertId)
    } catch (error) {
        return http.returnError(error)
    }
}

async function updateUser(user) {
    var q = 'UPDATE `user` SET '
    var endQuery = "WHERE (`id` = ?)"
    var l = []
    var i = 0
    try {
        for (const prop in user) {
            if (prop != "id") {
                if (i < Object.keys(user).length - 2) {
                    q += prop + " = ?, "
                } else {
                    q += prop + " = ? "
                }

                if (prop == "birthDate") {
                    const birthDate = new Date(user[prop])
                    l[i] = birthDate
                } else {
                    l[i] = user[prop]
                }
                i++
            }
        }
        q = q + endQuery
        l[i] = user["id"]
        const [result] = await conn.query(q,l)
        return getUserById(user.id)
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
        const query = 'INSERT INTO `address` (`userId`, `cep`, `number`, `street`, `district`, `complement`, `state`, `city`, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const [result] = await conn.query(query, [address.userId, address.cep, address.number, address.street, address.district, address.complement, address.state, address.city, address.latitude, address.longitude])
        return getAddressByUserId(address.userId)
    } catch (error) {
        return http.returnError(error)
    }
}

async function updateAddress(address) {
    try {
        const query = 'UPDATE `address` SET `cep` = ?, `number` = ?, `street` = ?, `district` = ?, `complement` = ?, `state` = ?, `city` = ? WHERE (`id` = ?)'
        const [result] = await conn.query(query, [address.cep, address.number, address.street, address.district, address.complement, address.state, address.city, address.id])
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

async function getPlateById(id) {
    try {
        const query = 'SELECT * FROM plate WHERE userId = ?;'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getDetailsPlate(id) {
    try {
        const query = 'SELECT * FROM plate T0 '
        + 'INNER JOIN address T1 '
        + 'ON T0.userId = T1.userId '
        + 'INNER JOIN user T2 '
        + 'ON T0.userId = T2.id '
        + 'where T0.id = ?;'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}

async function getPlatesByLocation(latitude, longitude, distance) {
    try {
        const query = 'SELECT DISTINCT T1.*, T0.latitude, T0.longitude, '
            + '(6371 * acos( '
            + 'cos( radians(?)) '
            + '* cos( radians( T0.latitude )) '
            + '* cos( radians( T0.longitude ) - radians(?) ) '
            + '+ sin( radians(?) )'
            + '* sin( radians( T0.latitude )))) AS distance '
            + 'FROM address T0 '
            + 'INNER JOIN plate T1 '
            + 'ON T0.userId = T1.userId '
            + 'HAVING distance < ? '
            + 'ORDER BY distance ASC '
            + 'LIMIT 10; '
        const [rows] = await conn.query(query, [latitude, longitude, latitude, distance])
        return http.returnSuccess(rows)
    } catch (error) {
        return http.returnError(error)
    }
}

async function savePlate(plate) {
    try {
        const query = 'INSERT INTO plate (`userId`, `nome`, `descricao`, `preco`, `quantidade`, `data`, `horario`, `obs`, urlImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
        const [result] = await conn.query(query, [plate.userId, plate.nome, plate.descricao, plate.preco, plate.quantidade, plate.data, plate.horario, plate.obs, plate.urlImage])
        return http.returnSuccess(result)
    } catch (error) {
        return http.returnError(error)
    }
}

async function createReserve(reserve) {
    try {
        const query = 'INSERT INTO reserve (`status`, `cookerId`, `comerId`, `plateId`, `orderId`) VALUES (?, ?, ?, ?, ?);'
        const [result] = await conn.query(query, [reserve.status, reserve.cookerId, reserve.comerId, reserve.plateId, reserve.orderId])
        return getReserveById(result.insertId)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getReserveById(id) {
    try {
        const query = 'select * From reserve where reserveId = ?'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}

module.exports = {
    getUserById,
    createUser,
    updateTaxDataUser,
    saveAddress,
    getAddressByUserId,
    getUserTermById,
    getTerms,
    updateUserTerms,
    updateAddress,
    savePlate,
    getPlateById,
    getPlatesByLocation, 
    updateUser,
    getDetailsPlate,
    createReserve
}
