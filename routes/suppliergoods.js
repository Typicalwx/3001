var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/*供应商品增加*/
router.post('/', async function (req, res, next) {
    let {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, SpecialFuc, placeOfOrigin,
        date, shelfLife, features, price, images,
        supplierId
    } = req.body
    images = images && JSON.parse(images)
    await client.post("/suppliergoods", {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, SpecialFuc, placeOfOrigin,
        date, shelfLife, features, price, images,
        supplier: {
            $ref: "supplier",
            $id: supplierId
        }
    })

    res.send({ status: 1 });
});


/*供应商品查询*/
router.get('/', async function (req, res, next) {
    let data = await client.get("/suppliergoods",
        { findType: "exact", submitType: "findJoin", ref: "supplier" })
    res.send(data);
});

// 通过id查询
router.get('/:id', async function (req, res, next) {
    let id = req.params.id
    let data = await client.get("/suppliergoods/"+id,
        { findType: "exact", submitType: "findJoin", ref: "supplier" })
    res.send(data);
});

/*供应商品删除*/
router.delete('/:id', async function (req, res, next) {
    let id = req.params.id
    await client.delete("/suppliergoods/" + id)
    res.send({ status: 1 });
});


/*供应商品修改*/
router.put('/:id', async function (req, res, next) {
    let id = req.params.id
    let {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, SpecialFuc, placeOfOrigin,
        date, shelfLife, features, price, images
    } = req.body
    images = images && JSON.parse(images)
    await client.put("/suppliergoods/" + id, {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, SpecialFuc, placeOfOrigin,
        date, shelfLife, features, price, images,
        supplier: {
            $ref: "supplier",
            $id: supplierId
        }

    })
    res.send({ status: 1 });
});

module.exports = router;