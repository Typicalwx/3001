var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
/* GET users listing. */

// 增加用户
router.post("/", async function (req, res) {
  let { account, pwd, email, phone, name, role, state } = req.body;
  await client.post("/users", { account, pwd, email, phone, name, role, state });
  res.send({
    status: 1
  })
})
// 修改用户
router.put('/:id', async function (req, res, next) {
  let id = req.params.id
  let { account, pwd, email, phone, name, role, state } = req.body
  await client.put("/users/" + id, { account, pwd, email, phone, name, role, state })
  res.send({ status: 1 });
});

// 通过id查询用户
router.get('/:id', async function (req, res, next) {
  let id = req.params.id
  let data = await client.get("/users/" + id)
  res.send(data);
});

// 查询所有用户
router.get('/', async function (req, res, next) {
  let data = await client.get("/users")
  res.send(data);
});
module.exports = router;
