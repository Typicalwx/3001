var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* 增加平台管理员详情 */
router.post('/', async function (req, res, next) {
    let { name, addr, tel, usersId, img } = req.body
    await client.post("/admins", {
        name, addr, tel, img,
        user: {
            $ref: "users",
            $id: usersId
        }
    })
    res.send({ status: 1 });
});


/* 查询平台管理员详情 */
router.get('/', async function (req, res, next) {
    let data = await client.get("/admins",
        { findType: "exact", submitType: "findJoin", ref: "users" })
    res.send(data);
});

/* 通过id查询平台管理员详情 */
router.get('/:id', async function (req, res, next) {
    let id = req.params.id
    let data = await client.get("/admins/" + id,
        { findType: "exact", submitType: "findJoin", ref: "users" })
    res.send(data);
});

/* 修改平台管理员详情 */
router.put('/:id', async function (req, res, next) {
    let id = req.params.id
    let { name, addr, tel, usersId, img } = req.body
    await client.put("/admins/" + id, {
        name, addr, tel, img,
        info: {
            $ref: "users",
            $id: usersId
        }
    })
    res.send({ status: 1 });
});

module.exports = router;