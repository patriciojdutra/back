const express = require('express');
const server = express();
server.use(express.json())
const db = require('./src/data/db')
const not = require('./src/pushnotification/push')

server.get('/user/:id', async (req, res) => {
    console.log("\nGetUserById Request = " + req.params.id)
    const result = await db.getUserById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.delete('/user/:id', async (req, res) => {
    console.log("\deleteUser Request = " + req.params.id)
    const result = await db.deleteUserById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/user', async (req, res) => {
    console.log("\nCreateUser Request = " + JSON.stringify(req.body))
    const result = await db.createUser(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.put('/user', async (req, res) => {
   console.log("\nRequest = " + JSON.stringify(req.body))
   const result = await db.updateTaxDataUser(req.body)
   console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
   return res.status(result[0]).json(result[1])
});


server.put('/user', async (req, res) => {
    console.log("\nupdateUser Request = " + JSON.stringify(req.body))
    const result = await db.updateUser(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/address/:id', async (req, res) => {
    console.log("\ngetAddressByUserId Request = " + req.params.id)
    const result = await db.getAddressByUserId(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/address', async (req, res) => {
    console.log("\nsaveAddress Request = " + JSON.stringify(req.body))
    const result = await db.saveAddress(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.put('/address', async (req, res) => {
    console.log("\nupdateAddress Request = " + JSON.stringify(req.body))
    const result = await db.updateAddress(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/userTerms/:id', async (req, res) => {
    console.log("\ngetUserTermById Request = " + req.params.id)
    const result = await db.getUserTermById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/terms', async (req, res) => {
    console.log("\ngetTerms Request")
    const result = await db.getTerms()
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/terms/:id', async (req, res) => {
    console.log("\ngetUserTermById Request = " + req.params.id)
    const result = await db.getUserTermById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.put('/terms', async (req, res) => {
    console.log("\nupdateUserTerms Request = " + JSON.stringify(req.body))
    const result = await db.updateUserTerms(req.body.userId)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/plate/:id', async (req, res) => {
    console.log("\ngetPlateById Request = " + req.params.id)
    const result = await db.getPlateById(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/plate/details/:id', async (req, res) => {
    console.log("\ngetDetailsPlate Request = " + req.params.id)
    const result = await db.getDetailsPlate(req.params.id)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/plate', async (req, res) => {
    console.log("\nsavePlate Request = " + JSON.stringify(req.body))
    const result = await db.savePlate(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/plate/:latitude/:longitude/:distance', async (req, res) => {
    console.log("\ngetPlatesByLocation Request = " + JSON.stringify(req.params))
    const result = await db.getPlatesByLocation(req.params.latitude, req.params.longitude, req.params.distance)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.post('/reserve', async (req, res) => {
    console.log("\ncreateReserve Request = " + JSON.stringify(req.body))
    const result = await db.createReserve(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/reserve/comer/:status/:id', async (req, res) => {
    console.log("\ngetReserveByComerId Request = " + JSON.stringify(req.params))
    const result = await db.getReserveByComerId(req.params)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/reserve/cooker/:status/:id', async (req, res) => {
    console.log("\ngetReserveByCookerId Request = " + JSON.stringify(req.params))
    const result = await db.getReserveByCookerId(req.params)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.put('/reserve', async (req, res) => {
    console.log("\nupdateReserve Request = " + JSON.stringify(req.body))
    const result = await db.updateReserve(req.body)
    console.log("\nResponse = " + result[0] + ' - ' + JSON.stringify(result[1]))
    return res.status(result[0]).json(result[1])
});

server.get('/notification/:token', async (req, res) => {
    console.log("\notification Request = " + req.params.token)
    not.sendMessage(req.params.token)
    return res.status(200).json("{}")
});

server.listen(21048, () => {
    console.log("Servidor esta rodando..... king host update")
});

