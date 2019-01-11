var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


router.post('/', async function (req, res, next) {
    let { userId, name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk } = req.body
    clerk = JSON.parse(clerk);
    location = JSON.parse(location)
    let data = await client.post("/stores", {
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
    let { type, value, page, rows, usersId } = req.query;
    let seraobj = {};
    if (type) {
        seraobj = { [type]: value }
    }
    let data = await client.get("/stores", {
        ...seraobj, submitType: "findJoin", ref: "users",
    }
    );
    res.send(data)
});


router.put('/:id', async function (req, res, next) {
    let { id } = req.params
    let { name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk } = req.body
    clerk = JSON.parse(clerk);
    location = JSON.parse(location)
    await client.put("/stores/" + id, {
        name, number, licenseImage, addr, location, city,
        legal, phone, storeImage, feature, commission, clerk
    });
    res.send({ status: 1 })
});

router.delete('/:id', async function (req, res, next) {
    let { id } = req.params
    await client.delete("/stores/" + id);
    res.send({ status: 1 })
});
module.exports = router;