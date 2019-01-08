var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* GET home page. */
// router.get('/', async function (req, res, next) {
//     res.render('index', { title: 'Express' });
// });


router.post('/', async function (req, res, next) {
    let { storeId, name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price, newPrice } = req.body
    let data = await client.post("/storegoods", {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price, newPrice,
        store: {
            $ref: "stores",
            $id: storeId
        }
    });
    console.log(data)
    res.send({ status: 1 })
});

router.get('/', async function (req, res, next) {
    let { type, value, page, rows, storeId } = req.query
    let obj = { [type]: value };
    let data = await client.get("/storegoods", {
        ...obj, page, rows, "store.$id": storeId,
        submitType: "findJoin", ref: "stores"
    });
    res.send(data)
});

router.put('/:id', async function (req, res, next) {
    let { id } = req.params
    let { name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, newPrice } = req.body
    await client.put("/storegoods/" + id, {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, newPrice
    });
    res.send({ status: 1 })
});

router.delete('/:id', async function (req, res, next) {
    let { id } = req.params
    await client.delete("/storegoods/" + id);
    res.send({ status: 1 })
});


module.exports = router;