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
    console.log("Request = " + JSON.stringify(user))
    const result = await db.createUser(user)
    console.log("Response = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.listen(3000, () => {
    console.log("Servidor esta rodando.....")
});

