var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* GET home page. */
// router.get('/', async function (req, res, next) {
//     res.render('index', { title: 'Express' });
// });


router.post('/', async function (req, res, next) {
    let { storeId, name, title, type, method, applySfc, exclusiveSfc, goodState,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price, newPrice, sales, images } = req.body
    console.log(images)
    images = JSON.parse(images)
    let data = await client.post("/storegoods", {
        name, title, type, method, applySfc, exclusiveSfc, goodState,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, price, newPrice, sales, images,
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
    console.log(type, value, page, rows, storeId)
    let obj = { [type]: value };
    let data = await client.get("/storegoods", {
        ...obj,
        page, rows,
        "store.$id": storeId,
        submitType: "findJoin", ref: "stores",
        // findType: "exact"
    });
    console.log(data)
    res.send(data)
});

router.get('/:id', async function (req, res, next) {
    let { id } = req.params
    let data = await client.get("/storegoods/" + id, { submitType: "findJoin", ref: "stores" });
    res.send(data)
});

router.put('/:id', async function (req, res, next) {
    let { id } = req.params
    let { name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, newPrice, sales, images } = req.body
    let data = await client.put("/storegoods/" + id, {
        name, title, type, method, applySfc, exclusiveSfc,
        total, packSfc, flavor, specialFuc, placeOfOrigin, date, shelfLife, features, newPrice, sales, images
    });
    res.send(data)
});

router.delete('/:id', async function (req, res, next) {
    let { id } = req.params
    await client.delete("/storegoods/" + id);
    res.send({ status: 1 })
});

router.delete('/', async function (req, res, next) {
    //根据上传的id添加电影
    // let movieId = req.params.id;
    let { data } = req.body;
    data = JSON.parse(data);
    let arrMovieId = [];
    // 将多条数据的id存进数组
    for (let i = 0; i < data.length; i++) {
        arrMovieId.push(data[i]._id);
    }
    console.log("arrMovieId", arrMovieId);
    // 一次性删除多条数据，ids是id集合
    await client.delete("/storegoods", {
        ids: arrMovieId
    });
    res.send({ status: 1 });
});



module.exports = router;