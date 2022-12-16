const express = require('express');
const server = express();
server.use(express.json())
const db = require('./src/data/db')


server.get('/user', async (req, res) => {
    const result = await db.getAllUsers()
    console.log(result[0] + ' - ' +result[1])
    return res.status(result[0]).json(result[1])
});

server.get('/user/:id', async (req, res) => {
    const id = req.params.id
    const result = await db.getUserById(id)
    console.log(result[0] + ' - ' +result[1])
    return res.status(result[0]).json(result[1])
});

server.post('/user', async (req, res) => {
    const user = {id, name, email, password, userType} = req.body
    console.log("Request = " + user)
    const result = await db.createUser(user)
    console.log("Response = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.put('/user', async (req, res) => {
    const taxData = {id, birthDate, phone, cpf} = req.body
    console.log("Request = " + JSON.stringify(taxData))
    const result = await db.updateTaxDataUser(taxData)
    console.log("Response = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/address', async (req, res) => {
    const address = {userId, cep, number, street, district, complement, state, city} = req.body
    const result = await db.saveAddress(address)
    console.log("Response = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/userTerms/:id', async (req, res) => {
    const id = req.params.id
    const result = await db.getUserTermById(id)
    console.log("Response = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.listen(3000, () => {
    console.log("Servidor esta rodando.....")
});

