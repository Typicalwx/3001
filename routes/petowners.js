var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");

router.post('/', async function (req, res, next) {
    let { phone, Nickname, name, headerImg, addr, area, integral, pets, pwd } = req.body;
    pets = JSON.parse(pets);
    let data = await client.post("/petowners", {
        phone, Nickname, name, headerImg, addr, area, integral, pets, pwd,
        // MembershipCard: {
        //     $ref: "stores",
        //     $id: storeId
        // }
    });
    console.log(data)
    res.send({ status: 1 })
});

router.get('/', async function (req, res, next) {
    let { type, value, page, rows, storeId } = req.query
    let seraobj = {};
    if (type) {
     
        seraobj = { [type]: value }
    }
    let data = await client.get("/petowners", { page, rows, ...seraobj, }

        //  {
        //     ...obj, page, rows, "store.$id": storeId,
        //     submitType: "findJoin", ref: "stores"
        // }
    );
    res.send(data)
});

router.get('/:id', async function (req, res, next) {
    let { id } = req.query
    let data = await client.get("/petowners/" + id);
    res.send(data)
});



router.put('/:id', async function (req, res, next) {
    let { id } = req.params
    let { phone, Nickname, name, headerImg, addr, area, integral, pets, pwd } = req.body;
    pets = JSON.parse(pets);
    await client.put("/petowners/" + id, {
        phone, Nickname, name, headerImg, addr, area, integral, pets, pwd,
        // MembershipCard: {
        //     $ref: "stores",
        //     $id: storeId
        // }
    });
    res.send({ status: 1 })
});

router.delete('/:id', async function (req, res, next) {
    let { id } = req.params
    await client.delete("/petowners/" + id);
    res.send({ status: 1 })
});


module.exports = router;