var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', function (req, res, next) {
    let { storeId, name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price } = req.query
    let data = await client.post("/storegoods", {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price,
        store: {
            $ref: "stores",
            $id: storeId
        }
    });
    console.log(data)
    res.send({ status: 1 })
});

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
    let { type, value, page, rows, storeId } = req.query
    let obj = { [type]: value };
    let data = await client.get("/storegoods", {
        ...obj, page, rows, "store.$id": storeId,
        submitType: "findJoin", ref: "stores"
    });
    res.send(data)
});

router.put('/:id', function (req, res, next) {
    let { id } = req.params
    let { storeId, name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price } = req.body
    await client.put("/storegoods/" + id, {
        storeId, name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price
    });
    res.send({ status: 1 })
});

router.delete('/:id', function (req, res, next) {
    let { id } = req.params
    await client.delete("/storegoods/" + id);
    res.send({ status: 1 })
});


module.exports = router;