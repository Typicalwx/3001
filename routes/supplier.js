var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* 增加供应商详情 */
router.post('/', async function (req, res, next) {
    let { name, addr, phone, web, licenseImage, remark,
        usersId } = req.body
    await client.post("/supplier", {
        name, addr, phone, web, licenseImage, remark,
        info: {
            $ref: "users",
            $id: usersId
        }
    })
    res.send({ status: 1 });
});

  

/* 查询供应商详情 */
router.get('/', async function (req, res, next) {
    let data = await client.get("/supplier",
        { findType: "exact", submitType: "findJoin", ref: "users" })
    res.send(data);
});

/* 通过id查询供应商详情 */
router.get('/:id', async function (req, res, next) {
    let id = req.params.id
    let data = await client.get("/supplier/" + id,
        { findType: "exact", submitType: "findJoin", ref: "users" })
    res.send(data);
});

/* 修改供应商详情 */
router.put('/:id', async function (req, res, next) {
    let id = req.params.id
    let { name, addr, phone, web, licenseImage, remark,
        usersId } = req.body
    await client.put("/supplier/" + id, {
        name, addr, phone, web, licenseImage, remark,
        info: {
            $ref: "users",
            $id: usersId
        }
    })
    res.send({ status: 1 });
});

module.exports = router;