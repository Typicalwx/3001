var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* GET home page. */
router.get('/', async function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/', async function (req, res, next) {
    let { userId, name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk } = req.body
    clerk = JSON.parse(clerk);
    location = JSON.parse(location)
    let data = await client.post("/storedetails", {
        name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk,
        user: {
            $ref: "users",
            $id: userId
        }
    });
    console.log(data)
    res.send({ status: 1 })
});

router.get('/', async function (req, res, next) {
    let { userId } = req.query
    let data = await client.get("/storedetails", {
        "user.$id": userId,
    });
    res.send(data)
});


router.put('/:id', async function (req, res, next) {
    let { id } = req.params
    let { name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk } = req.body
    clerk = JSON.parse(clerk);
    location = JSON.parse(location)
    await client.put("/storedetails/" + id, {
        name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk
    });
    res.send({ status: 1 })
});


router.delete('/:id', async function (req, res, next) {
    let { id } = req.params
    await client.delete("/storedetails/" + id);
    res.send({ status: 1 })
});
module.exports = router;