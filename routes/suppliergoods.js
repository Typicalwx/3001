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
// router.get('/', async function (req, res, next) {
//     let { page, rows, name, value } = req.query;
//     let q = {};
//     if (name) { //老师代码 包含模糊查询
//         q = { [name]: value }
//     }
//     let data = await client.get("/suppliergoods",
//         { page, rows, submitType: "findJoin", ref: "supplier", ...q })
//     res.send(data);
// });


//关联查找
router.get('/', async function (req, res, next) {
    let { page, rows, name, value, supplierId } = req.query;
    let q = {};
    if (name) { //老师代码 包含模糊查询
        q = { [name]: value }
    }
    let data = await client.get("/suppliergoods",
        {
            page, rows, submitType: "findJoin", ref: "supplier", ...q,
            "supplier.$id": supplierId,  
            //集合里面关联了其他集合，想要通过内层集合的id获取外层集合，可以用内层关联的 (属性名 . $id : id)
        }

    )
    res.send(data);
});

// 通过id查询
router.get('/:id', async function (req, res, next) {
    let id = req.params.id
    let data = await client.get("/suppliergoods/" + id,
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
        date, shelfLife, features, price, images,
        supplierId
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