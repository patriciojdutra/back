const express = require('express');
const server = express();
server.use(express.json())
const db = require('./src/data/db')


server.get('/user', async (req, res) => {
    const result = await db.getAllUsers()
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/user/:id', async (req, res) => {
    console.log("\nRequest = " + req.params.id)
    const result = await db.getUserById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/user', async (req, res) => {
    console.log("\nRequest = " + JSON.stringify(req.body))
    const result = await db.createUser(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

//server.put('/user', async (req, res) => {
//    console.log("\nRequest = " + JSON.stringify(req.body))
//    const result = await db.updateTaxDataUser(req.body)
//    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
//    return res.status(result[0]).json(result[1])
//});

server.put('/user', async (req, res) => {
    console.log("\nRequest = " + JSON.stringify(req.body))
    const result = await db.updateUser(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/address/:id', async (req, res) => {
    console.log("\nRequest = " + req.params.id)
    const result = await db.getAddressByUserId(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/address', async (req, res) => {
    console.log("\nRequest = " + JSON.stringify(req.body))
    const result = await db.saveAddress(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.put('/address', async (req, res) => {
    console.log("\nRequest = " + JSON.stringify(req.body))
    const result = await db.updateAddress(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/userTerms/:id', async (req, res) => {
    console.log("\nRequest = " + req.params.id)
    const result = await db.getUserTermById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/terms', async (req, res) => {
    const result = await db.getTerms()
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/terms/:id', async (req, res) => {
    console.log("\nRequest = " + req.params.id)
    const result = await db.getUserTermById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.put('/terms', async (req, res) => {
    console.log("\nRequest = " + JSON.stringify(req.body))
    const result = await db.updateUserTerms(req.body.userId)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/plate/:id', async (req, res) => {
    console.log("\nRequest = " + req.params.id)
    const result = await db.getPlateById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/plate', async (req, res) => {
    console.log("\nRequest = " + JSON.stringify(req.body))
    const result = await db.savePlate(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/plate/:latitude/:longitude/:distance', async (req, res) => {
    console.log("\nRequest = " + JSON.stringify(req.params))
    const result = await db.getPlatesByLocation(req.params.latitude, req.params.longitude, req.params.distance)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.listen(3000, () => {
    console.log("Servidor esta rodando.....")
});

