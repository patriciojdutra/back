const mysql = require('mysql2/promise')
const http = require('../utils/returnStatusHttp')
const notification = require('../pushnotification/push')

const conn = mysql.createPool({
    host: 'mysql25-farm10.kinghost.net',
    user: 'wellcome_add1',
    password: 't3xc8gzPjHyrnhS',
    database: 'wellcome'
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

async function deleteUserById(id) {
    try {
        const query = 'DELETE FROM user WHERE id = ?'
        const [rows] = await conn.query(query, [id])
        return getUserById(id)
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
        console.log(q)
        const [result] = await conn.query(q, l)
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
        const userAddress = await getAddressByUserId(address.userId);
        if (userAddress.success && Object.keys(userAddress.data).length > 0) {
            // usu�rio j� tem endere�o cadastrado, atualizar endere�o
            const query = 'UPDATE `address` SET `cep` = ?, `number` = ?, `street` = ?, `district` = ?, `complement` = ?, `state` = ?, `city` = ? WHERE (`userId` = ?)';
            const [result] = await conn.query(query, [address.cep, address.number, address.street, address.district, address.complement, address.state, address.city, address.userId]);
            return getAddressByUserId(address.userId);
        } else {
            // usu�rio n�o tem endere�o cadastrado, salvar novo endere�o
            const newAddress = { ...address, userId: address.userId };
            const result = await saveAddress(newAddress);
            return result;
        }
    } catch (error) {
        return http.returnError(error);
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

async function changeQuantityOfPlatesAvailableById(id, value) {
    try {
        if (value > 0) {
            const query = 'UPDATE plate SET quantidade = quantidade + ? WHERE id = ?'
            const [rows] = await conn.query(query, [value, id])
        } else {
            const query = 'UPDATE plate SET quantidade = quantidade ? WHERE id = ? AND quantidade > 0'
            const [rows] = await conn.query(query, [value, id])
        }
        return getPlateById(id)
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
        const result = rows[0]
        let note = await getNoteUser(result.userId, "Cooker")
        result.ratingCooker = note.ratingCooker

        return http.returnSuccess(result)
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
            + 'ON T0.userId = T1.userId AND T1.quantidade > 0 '
            + 'HAVING distance < ? '
            + 'ORDER BY distance ASC '
            + 'LIMIT 10; '
        const [rows] = await conn.query(query, [latitude, longitude, latitude, 5000])
        return http.returnSuccess(rows)
    } catch (error) {
        return http.returnError(error)
    }
}

async function savePlate(plate) {
    try {
        const datePlate = new Date(plate.data)
        const query = 'INSERT INTO plate (`userId`, `nome`, `descricao`, `preco`, `quantidade`, `data`, `horario`, `obs`, urlImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
        const [result] = await conn.query(query, [plate.userId, plate.nome, plate.descricao, plate.preco, plate.quantidade, datePlate, plate.horario, plate.obs, plate.urlImage])
        return http.returnSuccess(result)
    } catch (error) {
        return http.returnError(error)
    }
}

async function createReserve(reserve) {
    try {
        const query = 'INSERT INTO reserve (`status`, `cookerId`, `comerId`, `plateId`, `orderId`, chargeId) VALUES (?, ?, ?, ?, ?, ?);'
        const [result] = await conn.query(query, [reserve.status, reserve.cookerId, reserve.comerId, reserve.plateId, reserve.orderId, reserve.chargeId])

        const plate = await changeQuantityOfPlatesAvailableById(reserve.plateId, -1)

        //notification change status
        const cooker = await getUserById(reserve.cookerId)
        const comer = await getUserById(reserve.comerId)
        notification.sendMessage(
            cooker[1].data.token,
            "Nova solicitação",
            "O comer " + comer[1].data.name + " esta aguardando sua resposta")

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

function getCurrentDate() {
    const dataAtual = new Date();
    const dia = dataAtual.getDate(); // Retorna o dia do mês (1-31)
    const mes = dataAtual.getMonth() + 1; // Retorna o mês (0-11). Adiciona 1 para ajustar o índice baseado em zero.
    const ano = dataAtual.getFullYear(); // Retorna o ano (quatro dígitos)
    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada
}

async function getReserveByComerId(params) {
    try {

        var query = ""

        if (params.status == "scheduled") {
            //Retorna as reservas onde a data do prato é >= a data atual
            query = 'SELECT * FROM reserve T0 '
                + 'INNER JOIN plate T1 '
                + 'ON T0.plateId = T1.id '
                + 'INNER JOIN user T2 '
                + 'ON T0.cookerId = T2.id '
                + 'where comerId = ? '
                + 'and status = \"scheduled" '
                + 'and Date(T1.data) >= \"' + getCurrentDate() + "\""

        } else if (params.status == "concluded") {
            //Retorna as reservas onde a data do prato é < que a data atual
            query = 'SELECT * FROM reserve T0 '
                + 'INNER JOIN plate T1 '
                + 'ON T0.plateId = T1.id '
                + 'INNER JOIN user T2 '
                + 'ON T0.cookerId = T2.id '
                + 'where comerId = ? and comerRated = \"false\"'
                + 'and status = \"scheduled" '
                + 'and Date(T1.data) < \"' + getCurrentDate() + "\""

        } else {
            //Retorna as reservas que estão aguardando aprovação da solicitação
            query = 'SELECT * FROM reserve T0 '
                + 'INNER JOIN plate T1 '
                + 'ON T0.plateId = T1.id '
                + 'INNER JOIN user T2 '
                + 'ON T0.cookerId = T2.id '
                + 'where comerId = ? and status = ?'
        }

        console.log(query)

        const [rows] = await conn.query(query, [params.id, params.status])
        return http.returnSuccess(rows)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getReserveByCookerId(params) {
    try {

        var query = ""

        if (params.status == "scheduled") {
            //Retorna as reservas onde a data do prato é >= a data atual
            query = 'SELECT * FROM reserve T0 '
                + 'INNER JOIN plate T1 '
                + 'ON T0.plateId = T1.id '
                + 'INNER JOIN user T2 '
                + 'ON T0.comerId = T2.id '
                + 'where cookerId = ? '
                + 'and status = \"scheduled" '
                + 'and Date(T1.data) >= \"' + getCurrentDate() + "\""

        } else if (params.status == "concluded") {
            //Retorna as reservas onde a data do prato é < que a data atual
            query = 'SELECT * FROM reserve T0 '
                + 'INNER JOIN plate T1 '
                + 'ON T0.plateId = T1.id '
                + 'INNER JOIN user T2 '
                + 'ON T0.comerId = T2.id '
                + 'where cookerId = ? and cookerRated = \"false\"'
                + 'and status = \"scheduled" '
                + 'and Date(T1.data) < \"' + getCurrentDate() + "\""

        } else {
            //Retorna as reservas que estão aguardando aprovação da solicitação
            query = 'SELECT * FROM reserve T0 '
                + 'INNER JOIN plate T1 '
                + 'ON T0.plateId = T1.id '
                + 'INNER JOIN user T2 '
                + 'ON T0.comerId = T2.id '
                + 'where cookerId = ? and status = ?'
        }

        console.log(query)

        const [rows] = await conn.query(query, [params.id, params.status])
        return http.returnSuccess(rows)
    } catch (error) {
        return http.returnError(error)
    }
}

async function updateReserve(reserve) {
    try {
        var query = 'UPDATE reserve SET status = ? WHERE reserveId = ?'
        const [result] = await conn.query(query, [reserve.status, reserve.reserveId])

        const res = await getReserveById(reserve.reserveId)
        const comer = await getUserById(res[1].data.comerId)
        const cooker = await getUserById(res[1].data.cookerId)

        if (reserve.status == "canceled") {
            console.log("\n Alterando quantidade disponivel do prato: " + res[1].data.plateId)
            const plate = await changeQuantityOfPlatesAvailableById(res[1].data.plateId, 1)
        }

        //notification change status
        notification.sendMessage(
            comer[1].data.token, // token device
            cooker[1].data.name + " respondeu sua solicitação", // title push
            "") // msg push

        return getReserveById(reserve.reserveId)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getComerRatingById(id) {
    try {
        const query = 'select * From comerRating where id_comer = ?'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}


async function getCookerRatingById(id) {
    try {
        const query = 'select * From cookerRating where id_cooker = ?'
        const [rows] = await conn.query(query, [id])
        return http.returnSuccess(rows[0])
    } catch (error) {
        return http.returnError(error)
    }
}

async function checkUserRating(cookerId, comerId, isCooker) {
    let query;
    try {
        if (isCooker) {
            query = 'SELECT * FROM cookerRating WHERE id_cooker = ? AND id_comer = ?'
        } else {
            query = 'SELECT * FROM comerRating WHERE id_cooker = ? AND id_comer = ?'
        }
        const [rows] = await conn.query(query, [cookerId, comerId])
        const result = rows.length !== 0
        return http.returnSuccess({"hasRating":result})
    } catch (error) {
        return http.returnError(error)
    }
}

async function cookerRating(rating) {
    try {
        const query = 'INSERT INTO `comerRating` (`id_comer`,`id_cooker`,`rating`,`date`, `commentary`) VALUES (?, ?, ?, ?, ?)'
        const [result] = await conn.query(query, [rating.id, rating.id_comer, rating.id_cooker, rating.rating, rating.date, rating.commentary])
        return http.returnSuccess(result)
    } catch (error) {
        return http.returnError(error)
    }
}

async function rate(rating) {
    try {
        var query;
        var query2;

        if (rating.userType === 'Cooker') {
            query = 'INSERT INTO `rating` (`id_cooker`,`id_comer`, `id_reserve`, `rating`,`date`, `commentary`, `evaluatorId`, `evaluatorName`, `urlImageEvaluator`, `ratedId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            query2 = 'UPDATE reserve SET cookerRated = ? WHERE reserveId = ?'
        } else {
            query = 'INSERT INTO `rating` (`id_cooker`,`id_comer`, `id_reserve`, `rating`,`date`, `commentary`, `evaluatorId`, `evaluatorName`, `urlImageEvaluator`, `ratedId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            query2 = 'UPDATE reserve SET comerRated = ? WHERE reserveId = ?'
        }
        
        const [result] = await conn.query(query, [rating.id_cooker, rating.id_comer, rating.id_reserve, rating.rating, new Date(rating.date), rating.commentary, rating.evaluatorId, rating.evaluatorName, rating.urlImageEvaluator, rating.ratedId])
        const [result2] = await conn.query(query2, ['true', rating.id_reserve])

        return http.returnSuccess(result)
    } catch (error) {
        return http.returnError(error)
    }
}

async function getRating(userId, userType) {
    try {
        const result = await getNoteUser(userId, userType)
        return http.returnSuccess(result)
    }catch (error) {
        return http.returnError(error)
    }
}

async function getNoteUser(userId, userType) {
    const result = {}

    try {
        var query;

        if (userType === 'Cooker') {
            query = 'SELECT * FROM rating where id_cooker = ? and ratedId = ? ORDER BY date, id DESC LIMIT 5;'
        } else {
            query = 'SELECT * FROM rating where id_comer = ? and ratedId = ? ORDER BY date, id DESC LIMIT 5;'
        }
        
        const [rowsRating] = await conn.query(query, [userId, userId])

        let ratingCooker = 0
        rowsRating.forEach((e) => {
            ratingCooker +=  e.rating
        });

        result.ratingCooker = ratingCooker/rowsRating.length
        result.comments = rowsRating

        return result
    }catch (error) {
        return result
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
    createReserve,
    getReserveByComerId,
    getReserveByCookerId,
    updateReserve,
    deleteUserById,
    getComerRatingById,
    getCookerRatingById,
    rate,
    checkUserRating,
    getRating
}